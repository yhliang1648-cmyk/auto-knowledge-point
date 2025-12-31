-- DSE考题数据库Schema
-- 用于Cloudflare D1数据库

CREATE TABLE IF NOT EXISTS questions (
  id TEXT PRIMARY KEY,
  year INTEGER NOT NULL,
  subject TEXT NOT NULL,
  subject_code TEXT NOT NULL,
  paper TEXT NOT NULL,
  number TEXT NOT NULL,
  content TEXT NOT NULL,
  keywords TEXT,  -- JSON数组存储关键词
  difficulty TEXT,  -- easy, medium, hard
  topic TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 创建索引以优化查询
CREATE INDEX IF NOT EXISTS idx_year ON questions(year);
CREATE INDEX IF NOT EXISTS idx_subject ON questions(subject_code);
CREATE INDEX IF NOT EXISTS idx_difficulty ON questions(difficulty);
CREATE INDEX IF NOT EXISTS idx_year_subject ON questions(year, subject_code);

-- PDF文件元数据表
CREATE TABLE IF NOT EXISTS pdf_files (
  id TEXT PRIMARY KEY,
  file_name TEXT NOT NULL,
  original_name TEXT NOT NULL,
  file_size INTEGER NOT NULL,
  upload_date DATETIME DEFAULT CURRENT_TIMESTAMP,
  ocr_completed BOOLEAN DEFAULT FALSE,
  ocr_text TEXT,
  page_count INTEGER,
  r2_key TEXT NOT NULL
);

-- OCR结果表
CREATE TABLE IF NOT EXISTS ocr_results (
  id TEXT PRIMARY KEY,
  pdf_id TEXT,
  page_number INTEGER,
  text_content TEXT,
  bounding_boxes TEXT,  -- JSON存储边界框信息
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (pdf_id) REFERENCES pdf_files(id)
);

CREATE INDEX IF NOT EXISTS idx_pdf_id ON ocr_results(pdf_id);

-- 向量索引元数据表（实际向量存储在Vectorize中）
CREATE TABLE IF NOT EXISTS vector_metadata (
  id TEXT PRIMARY KEY,
  question_id TEXT NOT NULL,
  vector_dimension INTEGER DEFAULT 1536,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (question_id) REFERENCES questions(id)
);

-- 用户查询历史表
CREATE TABLE IF NOT EXISTS search_history (
  id TEXT PRIMARY KEY,
  query TEXT NOT NULL,
  results_count INTEGER,
  search_time REAL,  -- 搜索耗时（秒）
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_created_at ON search_history(created_at);

-- 教材和试卷表（用于教师上传的教材评估系统）
CREATE TABLE IF NOT EXISTS textbooks (
  id TEXT PRIMARY KEY,
  file_name TEXT NOT NULL,
  file_type TEXT NOT NULL,  -- textbook, exam, practice, syllabus
  grade TEXT,  -- 初一、初二、初三、高一、高二、高三
  subject TEXT,  -- 数学、物理、化学等
  content TEXT NOT NULL,  -- 教材文本内容
  knowledge_points TEXT,  -- JSON数组存储知识点
  pages INTEGER,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_textbook_type ON textbooks(file_type);
CREATE INDEX IF NOT EXISTS idx_textbook_grade ON textbooks(grade);
CREATE INDEX IF NOT EXISTS idx_textbook_subject ON textbooks(subject);

-- 示例数据插入
INSERT INTO questions (id, year, subject, subject_code, paper, number, content, keywords, difficulty, topic) VALUES
('2024-chi-1-1', 2024, '中國語文', 'chi', '試卷一', '1', '閱讀理解：分析文章主旨及作者寫作手法', '["閱讀理解", "主旨分析", "寫作手法"]', 'medium', '閱讀能力'),
('2024-eng-1-2', 2024, '英國語文', 'eng', 'Paper 1', '2', 'Reading comprehension: Identify the author''s tone and purpose', '["reading comprehension", "tone", "purpose"]', 'medium', 'Reading Skills'),
('2024-math-cp-5', 2024, '數學', 'math', '卷二（必修部分）', '5', '已知函數 f(x) = 2x² - 3x + 1，求 f(x) 的最小值', '["二次函數", "最值", "配方法"]', 'easy', '代數'),
('2024-ls-1-3', 2024, '通識教育', 'ls', '試卷一', '3', '分析氣候變化對香港的影響，並提出應對措施', '["氣候變化", "環境", "可持續發展"]', 'hard', '環境與可持續發展'),
('2023-bio-1-4', 2023, '生物', 'bio', 'Paper 1A', '4', 'Describe the process of photosynthesis and explain its importance', '["photosynthesis", "biology", "plant"]', 'medium', 'Cell Biology');
