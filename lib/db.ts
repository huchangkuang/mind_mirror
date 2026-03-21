/**
 * MySQL Database Connection Utility
 * Provides connection and query functions for MySQL database
 * Includes automatic database initialization on first connect
 */

import mysql from "mysql2/promise";

// Type for MySQL execute values
type ExecuteValues = string | number | boolean | Date | Buffer | null;

// Database configuration from environment variables
const dbConfig = {
  host: process.env.DATABASE_HOST || "localhost",
  port: parseInt(process.env.DATABASE_PORT || "3306", 10),
  user: process.env.DATABASE_USER || "root",
  password: process.env.DATABASE_PASSWORD || "",
  // MariaDB/MySQL 认证插件兼容
  authPlugins: {
    mysql_native_password: () => () => Buffer.from(process.env.DATABASE_PASSWORD || ""),
  },
  database: process.env.DATABASE_NAME || "mind_mirror",
  charset: "utf8mb4",
  // 连接超时配置
  connectTimeout: 10000,        // 10秒连接超时
  acquireTimeout: 10000,        // 获取连接超时
  timeout: 10000,                 // 查询超时
  // 连接池配置
  connectionLimit: 5,
  queueLimit: 0,
};

// Track if database has been initialized
let isDatabaseInitialized = false;

// 连接池实例
let pool: mysql.Pool | null = null;

/**
 * Create a database connection pool
 * @returns MySQL pool object
 */
function getPool() {
  if (!pool) {
    pool = mysql.createPool(dbConfig);
  }
  return pool;
}

/**
 * Create a database connection
 * @returns MySQL connection object
 */
export async function createConnection() {
  try {
    // Ensure database is initialized before creating connection
    if (!isDatabaseInitialized) {
      await initializeDatabase();
      isDatabaseInitialized = true;
    }

    // 从连接池获取连接
    return await getPool().getConnection();
  } catch (error) {
    console.error("Database connection error:", error);
    throw new Error("Failed to connect to database");
  }
}

/**
 * Initialize database, tables, and seed data
 * This runs automatically on first connection
 */
async function initializeDatabase() {
  let connection: mysql.Connection | null = null;

  try {
    // Step 1: Connect to MySQL server without database
    connection = await mysql.createConnection({
      host: dbConfig.host,
      port: dbConfig.port,
      user: dbConfig.user,
      password: dbConfig.password,
      charset: "utf8mb4",
      connectTimeout: 10000,
    });

    // Step 2: Create database if not exists
    await connection.execute(
      `CREATE DATABASE IF NOT EXISTS ${dbConfig.database} ` +
        `CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`
    );
    console.log(`[DB] Database '${dbConfig.database}' ensured`);

    // Step 3: Use the database (use query() instead of execute() for USE command)
    await connection.query(`USE ${dbConfig.database}`);

    // Step 4: Create users table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(100) NOT NULL UNIQUE,
        password_hash VARCHAR(255) NOT NULL,
        nickname VARCHAR(100) NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    console.log("[DB] Table 'users' ensured");
    await tryAlter(
      connection,
      "ALTER TABLE users ADD COLUMN nickname VARCHAR(100) NULL AFTER password_hash"
    );

    // Step 5: Create user_sessions table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS user_sessions (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        token VARCHAR(128) NOT NULL UNIQUE,
        expires_at TIMESTAMP NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        INDEX idx_user_sessions_user_id (user_id),
        INDEX idx_user_sessions_expires_at (expires_at)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    console.log("[DB] Table 'user_sessions' ensured");

    // Step 6: Create tests table
    await connection.execute(`
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
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    console.log("[DB] Table 'tests' ensured");

    // Step 7: Create test_history table
    await connection.execute(`
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
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    console.log("[DB] Table 'test_history' ensured");

    // Backward-compatible migration for already existing test_history tables.
    await tryAlter(connection, "ALTER TABLE test_history ADD COLUMN user_id INT NULL AFTER test_id");
    await tryAlter(connection, "ALTER TABLE test_history ADD INDEX idx_test_history_user_id (user_id)");
    await tryAlter(
      connection,
      "ALTER TABLE test_history ADD CONSTRAINT fk_test_history_user_id FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL"
    );

    // Feedback & suggestions (comments, likes, moderation audit)
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS feedback_comments (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        body TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        INDEX idx_feedback_comments_created_at (created_at)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    console.log("[DB] Table 'feedback_comments' ensured");

    await connection.execute(`
      CREATE TABLE IF NOT EXISTS feedback_likes (
        id INT AUTO_INCREMENT PRIMARY KEY,
        comment_id INT NOT NULL,
        user_id INT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE KEY uq_feedback_like (comment_id, user_id),
        FOREIGN KEY (comment_id) REFERENCES feedback_comments(id) ON DELETE CASCADE,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        INDEX idx_feedback_likes_comment_id (comment_id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    console.log("[DB] Table 'feedback_likes' ensured");

    await connection.execute(`
      CREATE TABLE IF NOT EXISTS feedback_moderation_log (
        id INT AUTO_INCREMENT PRIMARY KEY,
        actor_user_id INT NOT NULL,
        comment_id INT NOT NULL,
        action VARCHAR(32) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_feedback_modlog_created_at (created_at)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    console.log("[DB] Table 'feedback_moderation_log' ensured");

    // Step 8: Seed initial data
    await seedInitialData(connection);

    await connection.end();
    console.log("[DB] Database initialization complete");
  } catch (error) {
    console.error("[DB] Database initialization error:", error);
    if (connection) {
      try {
        await connection.end();
      } catch {
        // ignore
      }
    }
    throw error;
  }
}

async function tryAlter(connection: mysql.Connection, sql: string) {
  try {
    await connection.execute(sql);
  } catch {
    // Ignore migration errors (e.g. duplicate column/index/constraint)
  }
}

/**
 * Seed initial test data
 */
async function seedInitialData(connection: mysql.Connection) {
  // Check if tests table has data
  const [rows] = await connection.execute("SELECT COUNT(*) as count FROM tests");
  const count = (rows as { count: number }[])[0].count;

  if (count === 0) {
    // Insert MBTI test
    await connection.execute(
      `INSERT INTO tests (test_id, title, description, icon_name, duration, featured, href, color_from, color_to) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        "mbti",
        "MBTI 人格测试",
        "探索你的性格类型，了解自己的行为模式和独特优势",
        "Brain",
        "5分钟",
        true,
        "/mbti",
        "from-blue-500",
        "to-purple-600",
      ]
    );
    console.log("[DB] Seeded MBTI test data");

    // Insert City Match test
    await connection.execute(
      `INSERT INTO tests (test_id, title, description, icon_name, duration, featured, href, color_from, color_to) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        "city-match",
        "性格匹配城市测试",
        "发现最适合你性格的理想居住城市，开启全新生活篇章",
        "Building2",
        "5分钟",
        false,
        "/city-match",
        "from-emerald-500",
        "to-teal-600",
      ]
    );
    console.log("[DB] Seeded City Match test data");
  } else {
    console.log("[DB] Test data already exists, skipping seed");
  }
}

/**
 * Execute a SQL query with parameters
 * @param sql SQL query string
 * @param params Query parameters
 * @returns Query results
 */
export async function query<T = unknown>(sql: string, params?: ExecuteValues[]): Promise<T[]> {
  const connection = await createConnection();
  try {
    const [rows] = await connection.execute(sql, params);
    return rows as T[];
  } finally {
    connection.release();
  }
}

/**
 * Execute a single row query
 * @param sql SQL query string
 * @param params Query parameters
 * @returns Single row result or null
 */
export async function queryOne<T = unknown>(sql: string, params?: ExecuteValues[]): Promise<T | null> {
  const results = await query<T>(sql, params);
  return results.length > 0 ? results[0] : null;
}

/**
 * Insert data and return the inserted ID
 * @param sql SQL insert statement
 * @param params Query parameters
 * @returns Insert ID
 */
export async function insert(sql: string, params?: ExecuteValues[]): Promise<number> {
  const connection = await createConnection();
  try {
    const [result] = await connection.execute(sql, params);
    return (result as mysql.OkPacket).insertId;
  } finally {
    connection.release();
  }
}

/**
 * Execute update/delete and return affected rows
 * @param sql SQL statement
 * @param params Query parameters
 * @returns Number of affected rows
 */
export async function execute(sql: string, params?: ExecuteValues[]): Promise<number> {
  const connection = await createConnection();
  try {
    const [result] = await connection.execute(sql, params);
    return (result as mysql.OkPacket).affectedRows;
  } finally {
    connection.release();
  }
}
