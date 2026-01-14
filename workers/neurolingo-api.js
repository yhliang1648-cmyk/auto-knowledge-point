/**
 * NeuroLingo API Worker
 * 
 * 功能：
 * 1. 代理通义千问 API（解决 CORS 问题）
 * 2. 生成单词例句和图片
 * 3. 存储到 KV 缓存
 * 
 * 部署步骤：
 * 1. 登录 Cloudflare Dashboard
 * 2. 创建 Worker: neurolingo-api
 * 3. 创建 KV 命名空间: NEUROLINGO_WORDS
 * 4. 绑定 KV 到 Worker
 * 5. 设置环境变量: QWEN_API_KEY
 */

// 通义千问 API 配置
const QWEN_CHAT_URL = 'https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions';
const QWEN_IMAGE_URL = 'https://dashscope.aliyuncs.com/api/v1/services/aigc/text2image/image-synthesis';
const QWEN_TASK_URL = 'https://dashscope.aliyuncs.com/api/v1/tasks';

export default {
  async fetch(request, env, ctx) {
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    const url = new URL(request.url);
    const path = url.pathname;

    // 从环境变量或请求头获取 API Key
    const apiKey = env.QWEN_API_KEY || request.headers.get('X-API-Key') || 'sk-5848f54f1c3f4771b869f73e220715ca';

    try {
      // ============================================
      // GET /word/:word - 获取单词数据（优先缓存）
      // ============================================
      if (request.method === 'GET' && path.startsWith('/word/')) {
        const word = decodeURIComponent(path.replace('/word/', '')).toLowerCase();
        
        // 1. 检查缓存
        const cached = await env.NEUROLINGO_WORDS.get(word, { type: 'json' });
        if (cached && cached.imageUrls && cached.imageUrls.length > 0) {
          return jsonResponse({ ...cached, fromCache: true }, corsHeaders);
        }

        // 2. 生成新数据
        const wordData = await generateWordData(word, apiKey);
        
        // 3. 保存到缓存
        await env.NEUROLINGO_WORDS.put(word, JSON.stringify({
          ...wordData,
          cachedAt: new Date().toISOString()
        }));

        return jsonResponse({ ...wordData, fromCache: false }, corsHeaders);
      }

      // ============================================
      // POST /generate - 批量生成单词数据
      // ============================================
      if (request.method === 'POST' && path === '/generate') {
        const body = await request.json();
        const words = body.words || [];
        const results = [];

        for (const word of words) {
          const wordLower = word.toLowerCase();
          
          // 检查是否已缓存
          const cached = await env.NEUROLINGO_WORDS.get(wordLower, { type: 'json' });
          if (cached && cached.imageUrls && cached.imageUrls.length > 0) {
            results.push({ word: wordLower, status: 'cached' });
            continue;
          }

          try {
            const wordData = await generateWordData(wordLower, apiKey);
            await env.NEUROLINGO_WORDS.put(wordLower, JSON.stringify({
              ...wordData,
              cachedAt: new Date().toISOString()
            }));
            results.push({ word: wordLower, status: 'generated' });
          } catch (error) {
            results.push({ word: wordLower, status: 'error', error: error.message });
          }

          // 避免速率限制
          await sleep(2000);
        }

        return jsonResponse({ results }, corsHeaders);
      }

      // ============================================
      // GET /cache/:word - 仅获取缓存数据
      // ============================================
      if (request.method === 'GET' && path.startsWith('/cache/')) {
        const word = decodeURIComponent(path.replace('/cache/', '')).toLowerCase();
        const cached = await env.NEUROLINGO_WORDS.get(word, { type: 'json' });
        
        if (cached) {
          return jsonResponse(cached, corsHeaders);
        }
        return jsonResponse({ error: 'Not found' }, corsHeaders, 404);
      }

      // ============================================
      // POST /cache/:word - 直接保存到缓存
      // ============================================
      if (request.method === 'POST' && path.startsWith('/cache/')) {
        const word = decodeURIComponent(path.replace('/cache/', '')).toLowerCase();
        const body = await request.json();
        
        await env.NEUROLINGO_WORDS.put(word, JSON.stringify({
          ...body,
          word: word,
          cachedAt: new Date().toISOString()
        }));

        return jsonResponse({ success: true, word }, corsHeaders);
      }

      // ============================================
      // GET /list - 列出所有缓存的单词
      // ============================================
      if (request.method === 'GET' && path === '/list') {
        const list = await env.NEUROLINGO_WORDS.list();
        return jsonResponse({
          count: list.keys.length,
          words: list.keys.map(k => k.name)
        }, corsHeaders);
      }

      // ============================================
      // GET /stats - 缓存统计
      // ============================================
      if (request.method === 'GET' && path === '/stats') {
        const list = await env.NEUROLINGO_WORDS.list();
        return jsonResponse({
          totalWords: list.keys.length,
          apiEndpoint: 'neurolingo-api.workers.dev'
        }, corsHeaders);
      }

      // 默认响应
      return jsonResponse({
        name: 'NeuroLingo API Worker',
        version: '2.0.0',
        endpoints: {
          'GET /word/:word': '获取单词数据（缓存优先，按需生成）',
          'POST /generate': '批量生成单词数据 { words: ["apple", "book"] }',
          'GET /cache/:word': '仅获取缓存数据',
          'POST /cache/:word': '保存数据到缓存',
          'GET /list': '列出所有缓存的单词',
          'GET /stats': '缓存统计'
        }
      }, corsHeaders);

    } catch (error) {
      return jsonResponse({ 
        error: error.message,
        stack: error.stack 
      }, corsHeaders, 500);
    }
  },
};

// ============================================
// 生成单词数据
// ============================================
async function generateWordData(word, apiKey) {
  // 步骤1：生成简单例句
  const step1Prompt = `请为英文单词 "${word}" 生成学习资料，以JSON格式返回：
{
  "word": "${word}",
  "phonetic": "音标",
  "definition": "中文释义（3-8字）",
  "example": "简单英文例句（中文翻译）",
  "context": "使用场景",
  "visualDescription": "记忆技巧"
}

【重要】例句要求：
1. 非常简单，5-10个英文单词
2. 描述具体、可视化的场景
3. 适合绘图的画面感`;

  const response1 = await fetch(QWEN_CHAT_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: 'qwen-plus',
      messages: [{ role: 'user', content: step1Prompt }],
      temperature: 0.7,
      response_format: { type: 'json_object' }
    })
  });

  if (!response1.ok) {
    const errorText = await response1.text();
    throw new Error(`步骤1失败: ${response1.status} - ${errorText}`);
  }

  const data1 = await response1.json();
  const wordInfo = JSON.parse(data1.choices[0].message.content);

  // 提取例句
  const exampleSentence = wordInfo.example || '';
  const englishPart = exampleSentence.split(/[（(]/)[0].trim();

  // 步骤2：生成图片
  const imagePrompt = `A simple, clear illustration for learning English: ${englishPart}. Educational style, bright colors, easy to understand.`;
  
  try {
    const imageUrl = await generateImage(imagePrompt, apiKey);
    wordInfo.imageUrls = [imageUrl];
    wordInfo.aiGeneratedImage = true;
  } catch (error) {
    console.error('图片生成失败:', error.message);
    // 降级：使用 Unsplash
    wordInfo.imageUrls = [`https://source.unsplash.com/400x300/?${encodeURIComponent(word)}`];
    wordInfo.aiGeneratedImage = false;
  }

  // 添加音频链接
  wordInfo.audioUrls = [
    `https://dict.youdao.com/dictvoice?audio=${encodeURIComponent(word)}&type=1`,
    `https://dict.youdao.com/dictvoice?audio=${encodeURIComponent(word)}&type=2`
  ];

  return wordInfo;
}

// ============================================
// 生成图片（通义千问 wanx）
// ============================================
async function generateImage(prompt, apiKey) {
  // 发起异步图片生成请求
  const response = await fetch(QWEN_IMAGE_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
      'X-DashScope-Async': 'enable'
    },
    body: JSON.stringify({
      model: 'wanx-v1',
      input: {
        prompt: prompt,
        negative_prompt: 'blurry, low quality, text, watermark'
      },
      parameters: {
        style: '<auto>',
        size: '512*512',
        n: 1
      }
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`图片API失败: ${response.status} - ${errorText}`);
  }

  const result = await response.json();
  
  // 获取任务ID并轮询
  if (result.output && result.output.task_id) {
    return await pollImageTask(result.output.task_id, apiKey);
  }

  throw new Error('无法获取图片任务ID');
}

// ============================================
// 轮询图片生成任务
// ============================================
async function pollImageTask(taskId, apiKey, maxAttempts = 20) {
  for (let i = 0; i < maxAttempts; i++) {
    await sleep(3000); // 等待3秒

    const response = await fetch(`${QWEN_TASK_URL}/${taskId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${apiKey}`
      }
    });

    if (!response.ok) continue;

    const result = await response.json();
    
    if (result.output?.task_status === 'SUCCEEDED') {
      if (result.output.results?.[0]?.url) {
        return result.output.results[0].url;
      }
    } else if (result.output?.task_status === 'FAILED') {
      throw new Error(`图片任务失败: ${result.output.message || '未知错误'}`);
    }
  }

  throw new Error('图片生成超时');
}

// ============================================
// 工具函数
// ============================================
function jsonResponse(data, corsHeaders, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', ...corsHeaders }
  });
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

