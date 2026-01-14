/**
 * DSE 考題數據導入腳本
 * 將考題數據轉換為向量並上傳到 Cloudflare Vectorize
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * 主導入函數
 */
async function importQuestions() {
  console.log('🚀 開始導入 DSE 考題數據...\n');

  try {
    // 1. 讀取考題數據
    const questionsPath = path.join(__dirname, '../data/questions/all-questions.json');

    if (!fs.existsSync(questionsPath)) {
      console.error('❌ 找不到考題數據文件:', questionsPath);
      console.log('請先將考題數據放入 data/questions/all-questions.json');
      process.exit(1);
    }

    const rawData = fs.readFileSync(questionsPath, 'utf8');
    const questions = JSON.parse(rawData);

    console.log(`📚 已加載 ${questions.length} 道考題\n`);

    // 2. 生成向量並上傳
    let successCount = 0;
    let errorCount = 0;

    for (let i = 0; i < questions.length; i++) {
      const question = questions[i];

      try {
        // 使用 Wrangler 的 vectorize 命令上傳
        // 實際使用時需要先生成 embedding
        console.log(`[${i + 1}/${questions.length}] 處理: ${question.year} ${question.subject} Q${question.number}`);

        // 這裡需要調用 Cloudflare API 來生成 embedding 並上傳
        // 暫時記錄進度
        successCount++;

      } catch (error) {
        console.error(`❌ 錯誤:`, error.message);
        errorCount++;
      }

      // 每 10 條顯示進度
      if ((i + 1) % 10 === 0) {
        console.log(`進度: ${i + 1}/${questions.length} (${Math.round((i + 1) / questions.length * 100)}%)\n`);
      }
    }

    console.log('\n✅ 導入完成！');
    console.log(`成功: ${successCount} 道題目`);
    console.log(`失敗: ${errorCount} 道題目`);

  } catch (error) {
    console.error('❌ 導入失敗:', error);
    process.exit(1);
  }
}

/**
 * 導出函數用於手動調用
 */
export function generateSampleData() {
  console.log('📝 生成示例數據...\n');

  const sampleQuestions = [
    {
      id: 'dse-2024-liberal-p1-q1',
      year: '2024',
      subject: '通識教育',
      paper: 'Paper 1',
      number: '1',
      content: '氣候變化對香港的影響及應對措施。試從環境、經濟和社會三個角度分析香港面對氣候變化的挑戰，並建議政府和市民可以採取的行動。',
      keywords: ['氣候變化', '環境', '經濟', '社會', '可持續發展'],
      difficulty: 'medium'
    },
    {
      id: 'dse-2024-math-p1-q15',
      year: '2024',
      subject: '數學',
      paper: 'Paper 1',
      number: '15',
      content: '已知函數 f(x) = 2x² - 4x + 3。求 f(x) 的最小值及其對應的 x 值。',
      keywords: ['二次函數', '最小值', '配方法'],
      difficulty: 'easy'
    },
    {
      id: 'dse-2023-english-p3-q1',
      year: '2023',
      subject: '英國語文',
      paper: 'Paper 3',
      number: '1',
      content: 'Write an article for your school magazine discussing the impact of social media on teenagers. Include both positive and negative aspects.',
      keywords: ['social media', 'teenagers', 'impact', 'article writing'],
      difficulty: 'medium'
    },
    {
      id: 'dse-2023-chemistry-p1-q8',
      year: '2023',
      subject: '化學',
      paper: 'Paper 1',
      number: '8',
      content: '比較離子鍵和共價鍵的特性，並舉例說明各自的化合物類型。',
      keywords: ['離子鍵', '共價鍵', '化學鍵', '化合物'],
      difficulty: 'medium'
    },
    {
      id: 'dse-2022-geography-p2-q3',
      year: '2022',
      subject: '地理',
      paper: 'Paper 2',
      number: '3',
      content: '討論全球化對發展中國家經濟發展的影響。分析全球化帶來的機遇和挑戰。',
      keywords: ['全球化', '發展中國家', '經濟發展', '機遇', '挑戰'],
      difficulty: 'hard'
    }
  ];

  const outputPath = path.join(__dirname, '../data/questions/all-questions.json');

  // 確保目錄存在
  const dir = path.dirname(outputPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  fs.writeFileSync(outputPath, JSON.stringify(sampleQuestions, null, 2), 'utf8');

  console.log(`✅ 已生成 ${sampleQuestions.length} 道示例考題`);
  console.log(`保存位置: ${outputPath}\n`);

  return sampleQuestions;
}

// 如果直接運行此腳本
if (import.meta.url === `file://${process.argv[1]}`) {
  // 先生成示例數據
  generateSampleData();

  // 然後導入
  // importQuestions();

  console.log('提示：實際導入功能需要配置 Cloudflare API 憑證');
  console.log('請參考 README.md 中的部署說明');
}
