/**
 * 为 DSE 考题生成嵌入向量
 * 使用 Google Gemini API
 */

const fs = require('fs');
const path = require('path');

// Gemini API 配置
const GEMINI_API_KEY = 'AIzaSyCwagWVu6Lu6IhshnRF83x8-6XD3duwJ_8';
const GEMINI_EMBEDDING_MODEL = 'models/text-embedding-004';
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/${GEMINI_EMBEDDING_MODEL}:embedContent`;

/**
 * 使用 Gemini API 生成文本嵌入向量
 */
async function generateEmbedding(text) {
    try {
        const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: GEMINI_EMBEDDING_MODEL,
                content: {
                    parts: [{
                        text: text
                    }]
                }
            })
        });

        if (!response.ok) {
            const error = await response.text();
            throw new Error(`Gemini API error: ${response.status} - ${error}`);
        }

        const data = await response.json();
        return data.embedding.values;
    } catch (error) {
        console.error('生成嵌入向量失败:', error);
        throw error;
    }
}

/**
 * 延迟函数（避免 API 限流）
 */
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * 主函数：为所有考题生成嵌入向量
 */
async function generateAllEmbeddings() {
    console.log('🚀 开始生成 DSE 考题嵌入向量...\n');

    // 1. 读取考题数据
    const questionsPath = path.join(__dirname, '../data/questions/all-questions.json');
    const questions = JSON.parse(fs.readFileSync(questionsPath, 'utf8'));

    console.log(`📚 已加载 ${questions.length} 道考题\n`);

    // 2. 为每道题目生成嵌入向量
    const questionsWithEmbeddings = [];
    let successCount = 0;
    let errorCount = 0;

    for (let i = 0; i < questions.length; i++) {
        const question = questions[i];

        try {
            console.log(`[${i + 1}/${questions.length}] 处理: ${question.year} ${question.subject} Q${question.number}`);

            // 组合题目信息生成嵌入
            const textForEmbedding = `${question.subject} ${question.content} ${question.keywords.join(' ')}`;

            // 生成嵌入向量
            const embedding = await generateEmbedding(textForEmbedding);

            // 保存结果
            questionsWithEmbeddings.push({
                question: question,
                embedding: embedding,
                embeddingDimension: embedding.length
            });

            successCount++;
            console.log(`  ✅ 成功 (维度: ${embedding.length})\n`);

            // 延迟避免 API 限流（每秒最多 60 个请求）
            if (i < questions.length - 1) {
                await delay(1000); // 等待 1 秒
            }

        } catch (error) {
            console.error(`  ❌ 失败: ${error.message}\n`);
            errorCount++;
        }
    }

    // 3. 保存到文件
    const outputPath = path.join(__dirname, '../data/questions/questions-with-embeddings.json');
    fs.writeFileSync(outputPath, JSON.stringify(questionsWithEmbeddings, null, 2), 'utf8');

    console.log('\n✅ 嵌入向量生成完成！');
    console.log(`成功: ${successCount} 道题目`);
    console.log(`失败: ${errorCount} 道题目`);
    console.log(`保存位置: ${outputPath}`);

    // 4. 生成统计信息
    if (questionsWithEmbeddings.length > 0) {
        const sampleDimension = questionsWithEmbeddings[0].embeddingDimension;
        console.log(`\n📊 嵌入向量维度: ${sampleDimension}`);
        console.log(`总文件大小: ${(JSON.stringify(questionsWithEmbeddings).length / 1024 / 1024).toFixed(2)} MB`);
    }
}

// 运行脚本
if (require.main === module) {
    generateAllEmbeddings()
        .then(() => {
            console.log('\n🎉 所有操作完成！');
            process.exit(0);
        })
        .catch(error => {
            console.error('\n❌ 错误:', error);
            process.exit(1);
        });
}

module.exports = { generateEmbedding, generateAllEmbeddings };
