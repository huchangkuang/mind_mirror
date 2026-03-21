-- Mind Mirror Database Initialization Script
-- Run this script to create database, tables, and seed initial data

-- Create database
CREATE DATABASE IF NOT EXISTS mind_mirror
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE mind_mirror;

-- Users table: stores account credentials
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(100) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  nickname VARCHAR(100) NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- User sessions table: stores active login sessions
CREATE TABLE IF NOT EXISTS user_sessions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  token VARCHAR(128) NOT NULL UNIQUE,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_sessions_user_id (user_id),
  INDEX idx_user_sessions_expires_at (expires_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

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
  user_id INT NULL,
  result JSON,
  result_summary VARCHAR(200),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (test_id) REFERENCES tests(test_id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_test_history_user_id (user_id)
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
