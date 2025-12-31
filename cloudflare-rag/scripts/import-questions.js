/**
 * 导入考题数据到D1数据库和Vectorize向量索引
 *
 * 使用方法:
 * node scripts/import-questions.js --file=../data/questions/all-questions.json
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 解析命令行参数
const args = process.argv.slice(2);
const fileArg = args.find(arg => arg.startsWith('--file='));
const questionsFile = fileArg ? fileArg.split('=')[1] : '../data/questions/all-questions.json';

// 通义千问API配置
const QWEN_API_KEY = 'sk-e79b72b1a216405c89206aefe865139e';
const QWEN_API_ENDPOINT = 'https://dashscope.aliyuncs.com';

// Cloudflare API配置（需要从环境变量获取）
const CLOUDFLARE_ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID;
const CLOUDFLARE_API_TOKEN = process.env.CLOUDFLARE_API_TOKEN;
const DATABASE_ID = process.env.DATABASE_ID;
const VECTORIZE_INDEX = 'dse-questions-index';

/**
 * 生成文本的embedding向量
 */
async function generateEmbedding(text) {
  const response = await fetch(`${QWEN_API_ENDPOINT}/api/v1/services/embeddings/text-embedding/text-embedding`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${QWEN_API_KEY}`
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
    throw new Error(`Embedding API错误: ${response.status} - ${error}`);
  }

  const data = await response.json();
  return data.output.embeddings[0].embedding;
}

/**
 * 插入题目到D1数据库
 */
async function insertQuestionToDB(question) {
  const sql = `
    INSERT INTO questions (id, year, subject, subject_code, paper, number, content, keywords, difficulty, topic)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const response = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${CLOUDFLARE_ACCOUNT_ID}/d1/database/${DATABASE_ID}/query`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${CLOUDFLARE_API_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        sql,
        params: [
          question.id,
          question.year,
          question.subject,
          question.subjectCode,
          question.paper,
          question.number,
          question.content,
          JSON.stringify(question.keywords || []),
          question.difficulty || 'medium',
          question.topic || ''
        ]
      })
    }
  );

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`D1插入错误: ${response.status} - ${error}`);
  }

  return await response.json();
}

/**
 * 插入向量到Vectorize
 */
async function insertVectorToVectorize(id, embedding, metadata) {
  const response = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${CLOUDFLARE_ACCOUNT_ID}/vectorize/indexes/${VECTORIZE_INDEX}/insert`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${CLOUDFLARE_API_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        vectors: [
          {
            id,
            values: embedding,
            metadata
          }
        ]
      })
    }
  );

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Vectorize插入错误: ${response.status} - ${error}`);
  }

  return await response.json();
}

/**
 * 主导入函数
 */
async function main() {
  console.log('🚀 开始导入考题数据...\n');

  // 检查环境变量
  if (!CLOUDFLARE_ACCOUNT_ID || !CLOUDFLARE_API_TOKEN || !DATABASE_ID) {
    console.error('❌ 错误: 请设置以下环境变量:');
    console.error('  - CLOUDFLARE_ACCOUNT_ID');
    console.error('  - CLOUDFLARE_API_TOKEN');
    console.error('  - DATABASE_ID');
    console.error('\n使用方法:');
    console.error('  export CLOUDFLARE_ACCOUNT_ID=your-account-id');
    console.error('  export CLOUDFLARE_API_TOKEN=your-api-token');
    console.error('  export DATABASE_ID=your-database-id');
    console.error('  node scripts/import-questions.js');
    process.exit(1);
  }

  // 读取题目文件
  const filePath = path.resolve(__dirname, questionsFile);
  console.log(`📖 读取文件: ${filePath}`);

  if (!fs.existsSync(filePath)) {
    console.error(`❌ 文件不存在: ${filePath}`);
    process.exit(1);
  }

  const questionsData = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  console.log(`✅ 找到 ${questionsData.length} 道题目\n`);

  // 逐个处理题目
  let successCount = 0;
  let errorCount = 0;

  for (let i = 0; i < questionsData.length; i++) {
    const question = questionsData[i];
    console.log(`[${i + 1}/${questionsData.length}] 处理题目: ${question.id}`);

    try {
      // 1. 生成题目的文本表示
      const questionText = `${question.subject} ${question.content} ${(question.keywords || []).join(' ')}`;

      // 2. 生成embedding向量
      console.log('  ↳ 生成向量...');
      const embedding = await generateEmbedding(questionText);

      // 3. 插入D1数据库
      console.log('  ↳ 插入数据库...');
      await insertQuestionToDB(question);

      // 4. 插入Vectorize
      console.log('  ↳ 插入向量索引...');
      await insertVectorToVectorize(question.id, embedding, {
        year: question.year,
        subject: question.subject,
        subjectCode: question.subjectCode
      });

      successCount++;
      console.log(`  ✅ 完成\n`);

      // 延迟以避免API限流
      await new Promise(resolve => setTimeout(resolve, 500));

    } catch (error) {
      errorCount++;
      console.error(`  ❌ 错误: ${error.message}\n`);
    }
  }

  // 打印汇总
  console.log('\n' + '='.repeat(60));
  console.log('📊 导入完成汇总:');
  console.log('='.repeat(60));
  console.log(`✅ 成功: ${successCount}`);
  console.log(`❌ 失败: ${errorCount}`);
  console.log(`📝 总计: ${questionsData.length}`);
  console.log('='.repeat(60));
}

// 执行导入
main().catch(error => {
  console.error('❌ 导入失败:', error);
  process.exit(1);
});
