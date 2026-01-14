/**
 * DSE RAG System - Cloudflare Workers API
 * 處理搜索請求，使用 Vectorize 進行語義搜索，並通過 Workers AI 生成回答
 */

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // CORS 處理
    if (request.method === 'OPTIONS') {
      return handleCORS();
    }

    // 路由處理
    if (url.pathname === '/api/search') {
      return handleSearch(request, env);
    }

    if (url.pathname === '/api/stats') {
      return handleStats(request, env);
    }

    // 默認返回靜態頁面（由 Pages 處理）
    return new Response('Not Found', { status: 404 });
  }
};

/**
 * 處理搜索請求
 */
async function handleSearch(request, env) {
  try {
    const { query, subject, year } = await request.json();

    if (!query || query.trim() === '') {
      return jsonResponse({ error: '搜索關鍵詞不能為空' }, 400);
    }

    // 1. 使用 Workers AI 生成查詢的嵌入向量
    const queryEmbedding = await generateEmbedding(env.AI, query);

    // 2. 在 Vectorize 中進行相似度搜索
    const searchResults = await env.VECTORIZE.query(queryEmbedding, {
      topK: 10,
      returnMetadata: true,
      filter: buildFilter(subject, year)
    });

    // 3. 提取檢索到的題目
    const questions = searchResults.matches.map(match => ({
      year: match.metadata.year,
      subject: match.metadata.subject,
      paper: match.metadata.paper,
      number: match.metadata.number,
      content: match.metadata.content,
      score: match.score
    }));

    // 4. 使用 Workers AI 生成回答
    const aiAnswer = await generateAnswer(env.AI, query, questions);

    return jsonResponse({
      success: true,
      query,
      aiAnswer,
      questions,
      total: questions.length
    });

  } catch (error) {
    console.error('搜索錯誤:', error);
    return jsonResponse({
      error: '搜索失敗',
      message: error.message
    }, 500);
  }
}

/**
 * 處理統計數據請求
 */
async function handleStats(request, env) {
  try {
    // 從 KV 中獲取統計數據
    const stats = await env.DSE_KV.get('stats', { type: 'json' });

    return jsonResponse(stats || {
      totalQuestions: 0,
      subjects: 12,
      years: 14
    });
  } catch (error) {
    console.error('獲取統計數據錯誤:', error);
    return jsonResponse({ error: '獲取統計失敗' }, 500);
  }
}

/**
 * 生成文本的嵌入向量
 */
async function generateEmbedding(ai, text) {
  const response = await ai.run('@cf/baai/bge-base-en-v1.5', {
    text: text
  });
  return response.data[0];
}

/**
 * 使用 AI 生成回答
 */
async function generateAnswer(ai, query, questions) {
  if (!questions || questions.length === 0) {
    return null;
  }

  // 構建上下文
  const context = questions.slice(0, 5).map((q, index) =>
    `[${index + 1}] ${q.year} ${q.subject} ${q.paper} Q${q.number}: ${q.content}`
  ).join('\n\n');

  const prompt = `你是一位資深的香港 DSE 考試輔導專家。根據以下檢索到的歷屆 DSE 考題，為學生的問題提供專業的解答和建議。

學生問題：${query}

相關歷屆考題：
${context}

請提供：
1. 對學生問題的專業解答
2. 這些考題之間的關聯性
3. 學習建議和要點

請用繁體中文回答，語氣要專業且易於理解。`;

  try {
    const response = await ai.run('@cf/meta/llama-2-7b-chat-int8', {
      prompt: prompt,
      max_tokens: 500
    });

    return response.response || '抱歉，無法生成 AI 回答。';
  } catch (error) {
    console.error('AI 生成錯誤:', error);
    return '根據檢索到的考題，建議仔細研讀每道題目的出題方式和考點。';
  }
}

/**
 * 構建篩選條件
 */
function buildFilter(subject, year) {
  const filters = {};

  if (subject && subject !== 'all') {
    filters.subject = subject;
  }

  if (year && year !== 'all') {
    filters.year = year;
  }

  return Object.keys(filters).length > 0 ? filters : undefined;
}

/**
 * 返回 JSON 響應
 */
function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    }
  });
}

/**
 * 處理 CORS 預檢請求
 */
function handleCORS() {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    }
  });
}
