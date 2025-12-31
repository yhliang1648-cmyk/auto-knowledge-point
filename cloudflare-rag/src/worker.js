/**
 * DSE RAG API - Cloudflare Workers
 * 提供智能考题检索、PDF OCR、向量搜索功能
 * 集成通义千问API
 */

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const path = url.pathname;

    // CORS头
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    };

    // 处理OPTIONS请求
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    try {
      // 路由处理
      if (path === '/api/search' && request.method === 'POST') {
        return await handleSearch(request, env, corsHeaders);
      } else if (path === '/api/upload-pdf' && request.method === 'POST') {
        return await handlePDFUpload(request, env, corsHeaders);
      } else if (path === '/api/ocr' && request.method === 'POST') {
        return await handleOCR(request, env, corsHeaders);
      } else if (path === '/api/embed' && request.method === 'POST') {
        return await handleEmbed(request, env, corsHeaders);
      } else if (path === '/api/health') {
        return new Response(JSON.stringify({ status: 'ok', timestamp: new Date().toISOString() }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      return new Response('Not Found', { status: 404, headers: corsHeaders });
    } catch (error) {
      console.error('Worker错误:', error);
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
  }
};

/**
 * 处理智能搜索请求
 */
async function handleSearch(request, env, corsHeaders) {
  const { query, subject, year, limit = 5 } = await request.json();

  if (!query) {
    return new Response(JSON.stringify({ error: '缺少query参数' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }

  try {
    // 1. 使用通义千问生成query的embedding
    const queryEmbedding = await generateEmbedding(query, env);

    // 2. 在Vectorize中搜索相似题目
    const vectorResults = await env.VECTORIZE.query(queryEmbedding, {
      topK: 20,
      returnMetadata: true
    });

    // 3. 从D1数据库获取完整题目信息
    let questionIds = vectorResults.matches.map(m => m.id);

    // 构建SQL查询
    let sql = `SELECT * FROM questions WHERE id IN (${questionIds.map(() => '?').join(',')})`;
    const conditions = [];
    const params = [...questionIds];

    if (subject && subject !== 'all') {
      conditions.push('subject_code = ?');
      params.push(subject);
    }
    if (year && year !== 'all') {
      conditions.push('year = ?');
      params.push(year);
    }

    if (conditions.length > 0) {
      sql += ' AND ' + conditions.join(' AND');
    }
    sql += ' LIMIT ?';
    params.push(limit);

    const { results: questions } = await env.DB.prepare(sql).bind(...params).all();

    // 4. 使用通义千问生成AI回答
    const aiAnswer = await generateAIAnswer(query, questions, env);

    // 5. 返回结果
    return new Response(JSON.stringify({
      aiAnswer,
      questions,
      searchTime: Date.now()
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('搜索错误:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
}

/**
 * 处理PDF上传
 */
async function handlePDFUpload(request, env, corsHeaders) {
  try {
    const formData = await request.formData();
    const pdfFile = formData.get('pdf');

    if (!pdfFile) {
      return new Response(JSON.stringify({ error: '缺少PDF文件' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // 生成唯一文件名
    const fileName = `${Date.now()}-${pdfFile.name}`;

    // 上传到R2
    await env.PDF_BUCKET.put(fileName, pdfFile.stream(), {
      httpMetadata: {
        contentType: 'application/pdf'
      }
    });

    // 转换PDF为图片并OCR
    const ocrResults = await processPDFWithOCR(fileName, env);

    return new Response(JSON.stringify({
      fileName,
      url: `/api/pdf/${fileName}`,
      ocrResults
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('PDF上传错误:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
}

/**
 * 处理OCR请求
 */
async function handleOCR(request, env, corsHeaders) {
  try {
    const { imageUrl, imageBase64 } = await request.json();

    if (!imageUrl && !imageBase64) {
      return new Response(JSON.stringify({ error: '缺少图片URL或base64数据' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // 使用通义千问OCR API
    const ocrResult = await performQwenOCR(imageUrl || imageBase64, env);

    return new Response(JSON.stringify(ocrResult), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('OCR错误:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
}

/**
 * 处理Embedding请求
 */
async function handleEmbed(request, env, corsHeaders) {
  try {
    const { texts } = await request.json();

    if (!texts || !Array.isArray(texts)) {
      return new Response(JSON.stringify({ error: '缺少texts数组' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const embeddings = await Promise.all(
      texts.map(text => generateEmbedding(text, env))
    );

    return new Response(JSON.stringify({ embeddings }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Embedding错误:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
}

/**
 * 使用通义千问生成embedding
 */
async function generateEmbedding(text, env) {
  // 检查缓存
  const cacheKey = `embedding:${text}`;
  const cached = await env.CACHE.get(cacheKey);
  if (cached) {
    return JSON.parse(cached);
  }

  const response = await fetch(`${env.QWEN_API_ENDPOINT}/api/v1/services/embeddings/text-embedding/text-embedding`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${env.QWEN_API_KEY}`
    },
    body: JSON.stringify({
      model: 'text-embedding-v3',
      input: {
        texts: [text]
      }
    })
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`通义千问Embedding API错误: ${response.status} - ${error}`);
  }

  const data = await response.json();
  const embedding = data.output.embeddings[0].embedding;

  // 缓存结果（24小时）
  await env.CACHE.put(cacheKey, JSON.stringify(embedding), { expirationTtl: 86400 });

  return embedding;
}

/**
 * 使用通义千问OCR识别图片
 */
async function performQwenOCR(imageInput, env) {
  const response = await fetch(`${env.QWEN_API_ENDPOINT}/api/v1/services/aigc/multimodal-generation/generation`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${env.QWEN_API_KEY}`,
      'X-DashScope-Async': 'enable'
    },
    body: JSON.stringify({
      model: 'qwen-vl-ocr-2025-08-28',
      input: {
        messages: [
          {
            role: 'user',
            content: [
              {
                image: imageInput.startsWith('http') ? imageInput : `data:image/jpeg;base64,${imageInput}`
              }
            ]
          }
        ]
      },
      parameters: {
        ocr_options: {
          task: 'advanced_recognition'
        }
      }
    })
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`通义千问OCR API错误: ${response.status} - ${error}`);
  }

  const data = await response.json();
  return {
    text: data.output.choices[0].message.content[0].text,
    boxes: data.output.choices[0].message.content[0].box || []
  };
}

/**
 * PDF OCR处理
 */
async function processPDFWithOCR(fileName, env) {
  // 注意: Cloudflare Workers无法直接处理PDF
  // 需要使用外部服务（如Cloudflare Images或第三方PDF转图片服务）
  // 这里提供一个简化的示例流程

  // 1. 从R2获取PDF
  const pdfObject = await env.PDF_BUCKET.get(fileName);
  const pdfBuffer = await pdfObject.arrayBuffer();

  // 2. 将PDF转换为图片（需要使用外部服务）
  // 这里假设已经转换为base64图片数组
  // 实际部署时需要集成PDF转图片服务

  return {
    pages: [],
    text: '待实现: 需要集成PDF转图片服务'
  };
}

/**
 * 使用通义千问生成AI回答
 */
async function generateAIAnswer(query, questions, env) {
  const context = questions.map((q, i) =>
    `【题目${i + 1}】${q.year}年 ${q.subject} ${q.paper}\nQ${q.number}: ${q.content}`
  ).join('\n\n');

  const prompt = `你是一位專業的DSE考試輔導老師。學生問了以下問題：

${query}

我為你找到了以下相關的歷年DSE考題：

${context}

請你：
1. 直接回答學生的問題
2. 結合上述考題進行分析和講解
3. 指出考試的重點和常見陷阱
4. 提供解題思路和技巧

請用繁體中文回答，語氣要專業但易懂。`;

  const response = await fetch(`${env.QWEN_API_ENDPOINT}/compatible-mode/v1/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${env.QWEN_API_KEY}`
    },
    body: JSON.stringify({
      model: 'qwen-plus',
      messages: [
        {
          role: 'system',
          content: '你是一位經驗豐富的DSE考試輔導專家，精通各科目的考試要點和答題技巧。'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 2000
    })
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`通義千問API錯誤: ${response.status} - ${error}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
}
