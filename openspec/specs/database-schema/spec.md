## ADDED Requirements

### Requirement: Tests table structure
The system SHALL create a `tests` table to store test project metadata.

#### Scenario: Table creation
- **WHEN** the database schema is initialized
- **THEN** a `tests` table SHALL exist with the following columns:
  - `id` (INT, PRIMARY KEY, AUTO_INCREMENT)
  - `test_id` (VARCHAR(50), UNIQUE, NOT NULL) - unique identifier like 'mbti', 'city-match'
  - `title` (VARCHAR(200), NOT NULL) - display title
  - `description` (TEXT) - test description
  - `icon_name` (VARCHAR(50)) - Lucide icon name (e.g., 'Brain', 'Building2')
  - `duration` (VARCHAR(20)) - estimated time (e.g., '5分钟')
  - `featured` (BOOLEAN, DEFAULT FALSE) - whether to show as featured
  - `href` (VARCHAR(100)) - route path
  - `color_from` (VARCHAR(20)) - gradient start color (Tailwind class)
  - `color_to` (VARCHAR(20)) - gradient end color (Tailwind class)
  - `created_at` (TIMESTAMP, DEFAULT CURRENT_TIMESTAMP)
  - `updated_at` (TIMESTAMP, DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP)

### Requirement: Test history table structure
The system SHALL create a `test_history` table to store user test results.

#### Scenario: Table creation
- **WHEN** the database schema is initialized
- **THEN** a `test_history` table SHALL exist with the following columns:
  - `id` (INT, PRIMARY KEY, AUTO_INCREMENT)
  - `test_id` (VARCHAR(50), NOT NULL) - reference to tests.test_id
  - `result` (JSON) - test result data
  - `result_summary` (VARCHAR(200)) - brief result summary for display
  - `created_at` (TIMESTAMP, DEFAULT CURRENT_TIMESTAMP)
  - FOREIGN KEY (`test_id`) REFERENCES `tests`(`test_id`)

### Requirement: Initial data seeding
The system SHALL seed initial test data into the `tests` table.

#### Scenario: MBTI test data
- **WHEN** the database is initialized
- **THEN** the `tests` table SHALL contain the MBTI test with:
  - test_id: 'mbti'
  - title: 'MBTI 人格测试'
  - description: '探索你的性格类型，了解自己的行为模式和独特优势'
  - icon_name: 'Brain'
  - duration: '5分钟'
  - featured: true
  - href: '/mbti'
  - color_from: 'from-blue-500'
  - color_to: 'to-purple-600'

#### Scenario: City match test data
- **WHEN** the database is initialized
- **THEN** the `tests` table SHALL contain the city match test with:
  - test_id: 'city-match'
  - title: '性格匹配城市测试'
  - description: '发现最适合你性格的理想居住城市，开启全新生活篇章'
  - icon_name: 'Building2'
  - duration: '5分钟'
  - featured: false
  - href: '/city-match'
  - color_from: 'from-emerald-500'
  - color_to: 'to-teal-600'

### Requirement: Database engine and charset
The system SHALL use appropriate MySQL settings for the tables.

#### Scenario: Table configuration
- **WHEN** tables are created
- **THEN** they SHALL use InnoDB engine
- **AND** they SHALL use utf8mb4 charset
- **AND** they SHALL use utf8mb4_unicode_ci collation
