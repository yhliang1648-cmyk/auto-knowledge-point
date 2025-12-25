// Google Gemini API 配置
const GEMINI_API_KEY = 'AIzaSyCwagWVu6Lu6IhshnRF83x8-6XD3duwJ_8';
const GEMINI_EMBEDDING_MODEL = 'models/text-embedding-004';
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/${GEMINI_EMBEDDING_MODEL}:embedContent`;

/**
 * 使用 Gemini API 生成文本嵌入向量
 * @param {string} text - 要生成嵌入的文本
 * @returns {Promise<number[]>} - 嵌入向量数组
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
            throw new Error(`Gemini API error: ${response.status}`);
        }

        const data = await response.json();
        return data.embedding.values;
    } catch (error) {
        console.error('生成嵌入向量失败:', error);
        throw error;
    }
}

/**
 * 计算余弦相似度
 * @param {number[]} vec1 - 向量1
 * @param {number[]} vec2 - 向量2
 * @returns {number} - 相似度分数 (0-1)
 */
function cosineSimilarity(vec1, vec2) {
    let dotProduct = 0;
    let norm1 = 0;
    let norm2 = 0;

    for (let i = 0; i < vec1.length; i++) {
        dotProduct += vec1[i] * vec2[i];
        norm1 += vec1[i] * vec1[i];
        norm2 += vec2[i] * vec2[i];
    }

    return dotProduct / (Math.sqrt(norm1) * Math.sqrt(norm2));
}

/**
 * 搜索相关考题
 * @param {string} query - 搜索查询
 * @param {Array} questionsWithEmbeddings - 包含嵌入向量的考题数组
 * @param {number} topK - 返回前 K 个最相关的结果
 * @returns {Promise<Array>} - 相关考题数组
 */
async function searchQuestions(query, questionsWithEmbeddings, topK = 5) {
    // 1. 生成查询的嵌入向量
    const queryEmbedding = await generateEmbedding(query);

    // 2. 计算与所有题目的相似度
    const results = questionsWithEmbeddings.map(item => ({
        ...item.question,
        similarity: cosineSimilarity(queryEmbedding, item.embedding)
    }));

    // 3. 按相似度排序
    results.sort((a, b) => b.similarity - a.similarity);

    // 4. 返回前 K 个结果
    return results.slice(0, topK);
}

// 导出函数供其他模块使用
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        generateEmbedding,
        cosineSimilarity,
        searchQuestions
    };
}
