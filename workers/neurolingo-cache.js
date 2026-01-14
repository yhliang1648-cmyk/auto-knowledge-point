/**
 * NeuroLingo 缓存 Worker
 * 
 * 这是一个 Cloudflare Worker 脚本，用于管理单词数据的 KV 存储
 * 
 * 部署步骤：
 * 1. 登录 Cloudflare Dashboard
 * 2. 进入 Workers & Pages
 * 3. 创建新 Worker，命名为 neurolingo-cache
 * 4. 粘贴此代码
 * 5. 创建 KV 命名空间 NEUROLINGO_WORDS
 * 6. 在 Worker 设置中绑定 KV
 */

export default {
  async fetch(request, env, ctx) {
    // CORS 头
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    };

    // 处理 OPTIONS 请求
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    const url = new URL(request.url);
    const path = url.pathname;

    try {
      // GET /get/:word - 获取单词数据
      if (request.method === 'GET' && path.startsWith('/get/')) {
        const word = path.replace('/get/', '').toLowerCase();
        
        if (!word) {
          return new Response(JSON.stringify({ error: 'Word is required' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json', ...corsHeaders }
          });
        }

        const data = await env.NEUROLINGO_WORDS.get(word, { type: 'json' });
        
        if (data) {
          return new Response(JSON.stringify(data), {
            status: 200,
            headers: { 'Content-Type': 'application/json', ...corsHeaders }
          });
        } else {
          return new Response(JSON.stringify({ error: 'Not found' }), {
            status: 404,
            headers: { 'Content-Type': 'application/json', ...corsHeaders }
          });
        }
      }

      // POST /set/:word - 保存单词数据
      if (request.method === 'POST' && path.startsWith('/set/')) {
        const word = path.replace('/set/', '').toLowerCase();
        
        if (!word) {
          return new Response(JSON.stringify({ error: 'Word is required' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json', ...corsHeaders }
          });
        }

        const body = await request.json();
        
        // 添加元数据
        const dataToStore = {
          ...body,
          word: word,
          storedAt: new Date().toISOString()
        };

        // 存储到 KV（永不过期）
        await env.NEUROLINGO_WORDS.put(word, JSON.stringify(dataToStore));

        return new Response(JSON.stringify({ success: true, word: word }), {
          status: 200,
          headers: { 'Content-Type': 'application/json', ...corsHeaders }
        });
      }

      // GET /list - 列出所有缓存的单词
      if (request.method === 'GET' && path === '/list') {
        const list = await env.NEUROLINGO_WORDS.list();
        const words = list.keys.map(k => k.name);

        return new Response(JSON.stringify({ 
          count: words.length, 
          words: words 
        }), {
          status: 200,
          headers: { 'Content-Type': 'application/json', ...corsHeaders }
        });
      }

      // GET /stats - 获取缓存统计
      if (request.method === 'GET' && path === '/stats') {
        const list = await env.NEUROLINGO_WORDS.list();
        
        return new Response(JSON.stringify({
          totalWords: list.keys.length,
          lastUpdated: new Date().toISOString()
        }), {
          status: 200,
          headers: { 'Content-Type': 'application/json', ...corsHeaders }
        });
      }

      // DELETE /delete/:word - 删除单词数据
      if (request.method === 'DELETE' && path.startsWith('/delete/')) {
        const word = path.replace('/delete/', '').toLowerCase();
        
        if (!word) {
          return new Response(JSON.stringify({ error: 'Word is required' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json', ...corsHeaders }
          });
        }

        await env.NEUROLINGO_WORDS.delete(word);

        return new Response(JSON.stringify({ success: true, deleted: word }), {
          status: 200,
          headers: { 'Content-Type': 'application/json', ...corsHeaders }
        });
      }

      // POST /batch - 批量获取单词数据
      if (request.method === 'POST' && path === '/batch') {
        const body = await request.json();
        const words = body.words || [];
        
        const results = {};
        for (const word of words) {
          const data = await env.NEUROLINGO_WORDS.get(word.toLowerCase(), { type: 'json' });
          results[word] = data || null;
        }

        return new Response(JSON.stringify(results), {
          status: 200,
          headers: { 'Content-Type': 'application/json', ...corsHeaders }
        });
      }

      // 默认响应
      return new Response(JSON.stringify({
        name: 'NeuroLingo Cache Worker',
        version: '1.0.0',
        endpoints: [
          'GET /get/:word - 获取单词数据',
          'POST /set/:word - 保存单词数据',
          'GET /list - 列出所有缓存的单词',
          'GET /stats - 获取缓存统计',
          'DELETE /delete/:word - 删除单词数据',
          'POST /batch - 批量获取单词数据'
        ]
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      });

    } catch (error) {
      return new Response(JSON.stringify({ 
        error: error.message,
        stack: error.stack
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      });
    }
  },
};

