-- Mind Mirror Database Initialization Script
-- Run this script to create database, tables, and seed initial data

-- Create database
CREATE DATABASE IF NOT EXISTS mind_mirror
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE mind_mirror;

-- Tests table: stores test project metadata
CREATE TABLE IF NOT EXISTS tests (
  id INT AUTO_INCREMENT PRIMARY KEY,
  test_id VARCHAR(50) NOT NULL UNIQUE,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  icon_name VARCHAR(50),
  duration VARCHAR(20),
  featured BOOLEAN DEFAULT FALSE,
  href VARCHAR(100),
  color_from VARCHAR(20),
  color_to VARCHAR(20),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Test history table: stores user test results
CREATE TABLE IF NOT EXISTS test_history (
  id INT AUTO_INCREMENT PRIMARY KEY,
  test_id VARCHAR(50) NOT NULL,
  result JSON,
  result_summary VARCHAR(200),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (test_id) REFERENCES tests(test_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert initial test data
INSERT INTO tests (test_id, title, description, icon_name, duration, featured, href, color_from, color_to)
VALUES
  ('mbti', 'MBTI 人格测试', '探索你的性格类型，了解自己的行为模式和独特优势', 'Brain', '5分钟', TRUE, '/mbti', 'from-blue-500', 'to-purple-600'),
  ('city-match', '性格匹配城市测试', '发现最适合你性格的理想居住城市，开启全新生活篇章', 'Building2', '5分钟', FALSE, '/city-match', 'from-emerald-500', 'to-teal-600')
ON DUPLICATE KEY UPDATE
  title = VALUES(title),
  description = VALUES(description),
  icon_name = VALUES(icon_name),
  duration = VALUES(duration),
  featured = VALUES(featured),
  href = VALUES(href),
  color_from = VALUES(color_from),
  color_to = VALUES(color_to);
