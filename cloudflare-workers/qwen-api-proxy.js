/**
 * Cloudflare Worker 代理脚本 - 通义千问 API
 *
 * 功能：
 * - 代理通义千问 API 请求，解决浏览器 CORS 跨域问题
 * - 支持文本生成 API (qwen-plus)
 * - 支持 OCR API (qwen-vl-ocr)
 * - 自动添加 CORS 头
 *
 * 部署方式：
 * 1. 登录 Cloudflare Dashboard
 * 2. 进入 Workers & Pages
 * 3. 创建新 Worker，粘贴此代码
 * 4. 部署并获取 Worker URL
 */

// 通义千问 API 基础地址
const QWEN_API_BASE = 'https://dashscope.aliyuncs.com';

// CORS 头配置
const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-DashScope-SSE',
  'Access-Control-Max-Age': '86400',
};

/**
 * 处理 OPTIONS 预检请求
 */
function handleOptions() {
  return new Response(null, {
    status: 204,
    headers: CORS_HEADERS,
  });
}

/**
 * 代理请求到通义千问 API
 */
async function proxyRequest(request) {
  try {
    // 获取请求路径
    const url = new URL(request.url);
    const path = url.searchParams.get('path') || '/api/v1/services/aigc/text-generation/generation';

    // 构建目标 URL
    const targetUrl = `${QWEN_API_BASE}${path}`;

    console.log('Proxying request to:', targetUrl);

    // 复制请求头
    const headers = new Headers(request.headers);
    headers.set('Host', new URL(QWEN_API_BASE).host);

    // 如果是 POST 请求，读取请求体
    let body = null;
    if (request.method === 'POST' || request.method === 'PUT') {
      body = await request.text();
    }

    // 发送请求到通义千问 API
    const apiResponse = await fetch(targetUrl, {
      method: request.method,
      headers: headers,
      body: body,
    });

    // 读取响应
    const responseBody = await apiResponse.text();
    const responseHeaders = new Headers(apiResponse.headers);

    // 添加 CORS 头
    Object.entries(CORS_HEADERS).forEach(([key, value]) => {
      responseHeaders.set(key, value);
    });

    // 返回响应
    return new Response(responseBody, {
      status: apiResponse.status,
      statusText: apiResponse.statusText,
      headers: responseHeaders,
    });

  } catch (error) {
    console.error('Proxy error:', error);

    return new Response(JSON.stringify({
      error: 'Proxy Error',
      message: error.message,
      stack: error.stack,
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        ...CORS_HEADERS,
      },
    });
  }
}

/**
 * 显示使用说明
 */
function showUsage() {
  const usage = `
<!DOCTYPE html>
<html>
<head>
  <title>通义千问 API 代理服务</title>
  <style>
    body { font-family: Arial, sans-serif; max-width: 800px; margin: 50px auto; padding: 20px; }
    code { background: #f4f4f4; padding: 2px 6px; border-radius: 3px; }
    pre { background: #f4f4f4; padding: 15px; border-radius: 5px; overflow-x: auto; }
    .status { color: #22c55e; font-weight: bold; }
  </style>
</head>
<body>
  <h1>🚀 通义千问 API 代理服务</h1>
  <p class="status">✅ 服务运行正常</p>

  <h2>📖 使用说明</h2>

  <h3>1️⃣ 文本生成 API</h3>
  <p>路径参数: <code>?path=/api/v1/services/aigc/text-generation/generation</code></p>
  <pre>
fetch('${new URL('https://YOUR-WORKER.workers.dev')}?path=/api/v1/services/aigc/text-generation/generation', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer YOUR_API_KEY',
    'X-DashScope-SSE': 'disable'
  },
  body: JSON.stringify({
    model: 'qwen-plus',
    input: {
      messages: [{ role: 'user', content: 'Hello' }]
    },
    parameters: {
      result_format: 'message'
    }
  })
})
  </pre>

  <h3>2️⃣ OCR 识别 API</h3>
  <p>路径参数: <code>?path=/api/v1/services/aigc/multimodal-generation/generation</code></p>
  <pre>
fetch('${new URL('https://YOUR-WORKER.workers.dev')}?path=/api/v1/services/aigc/multimodal-generation/generation', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer YOUR_API_KEY',
    'X-DashScope-SSE': 'disable'
  },
  body: JSON.stringify({
    model: 'qwen-vl-ocr',
    input: {
      messages: [{
        role: 'user',
        content: [
          { image: 'data:image/jpeg;base64,...' },
          { text: '请识别图片文字' }
        ]
      }]
    }
  })
})
  </pre>

  <h2>🔧 特性</h2>
  <ul>
    <li>✅ 自动处理 CORS 跨域</li>
    <li>✅ 支持所有通义千问 API</li>
    <li>✅ 完全免费（Cloudflare 免费套餐）</li>
    <li>✅ 全球 CDN 加速</li>
    <li>✅ 无请求次数限制（免费套餐 100,000 请求/天）</li>
  </ul>

  <h2>📊 部署状态</h2>
  <p>Worker URL: <code>${new URL('https://YOUR-WORKER.workers.dev')}</code></p>
  <p>时间: ${new Date().toISOString()}</p>
</body>
</html>
  `;

  return new Response(usage, {
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      ...CORS_HEADERS,
    },
  });
}

/**
 * 主处理函数
 */
export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // 处理 OPTIONS 预检请求
    if (request.method === 'OPTIONS') {
      return handleOptions();
    }

    // 显示使用说明（GET 请求根路径）
    if (request.method === 'GET' && url.pathname === '/') {
      return showUsage();
    }

    // 代理 API 请求
    if (request.method === 'POST' || request.method === 'GET') {
      return proxyRequest(request);
    }

    // 其他请求返回 404
    return new Response('Not Found', {
      status: 404,
      headers: CORS_HEADERS,
    });
  },
};
