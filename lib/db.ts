/**
 * MySQL Database Connection Utility
 * Provides connection and query functions for MySQL database
 */

import mysql from "mysql2/promise";

// Database configuration from environment variables
const dbConfig = {
  host: process.env.DATABASE_HOST || "localhost",
  port: parseInt(process.env.DATABASE_PORT || "3306", 10),
  user: process.env.DATABASE_USER || "root",
  password: process.env.DATABASE_PASSWORD || "",
  database: process.env.DATABASE_NAME || "mind_mirror",
};

/**
 * Create a database connection
 * @returns MySQL connection object
 */
export async function createConnection() {
  try {
    const connection = await mysql.createConnection({
      host: dbConfig.host,
      port: dbConfig.port,
      user: dbConfig.user,
      password: dbConfig.password,
      database: dbConfig.database,
      charset: "utf8mb4",
    });
    return connection;
  } catch (error) {
    console.error("Database connection error:", error);
    throw new Error("Failed to connect to database");
  }
}

/**
 * Execute a SQL query with parameters
 * @param sql SQL query string
 * @param params Query parameters
 * @returns Query results
 */
export async function query<T = unknown>(sql: string, params?: unknown[]): Promise<T[]> {
  const connection = await createConnection();
  try {
    const [rows] = await connection.execute(sql, params);
    return rows as T[];
  } finally {
    await connection.end();
  }
}

/**
 * Execute a single row query
 * @param sql SQL query string
 * @param params Query parameters
 * @returns Single row result or null
 */
export async function queryOne<T = unknown>(sql: string, params?: unknown[]): Promise<T | null> {
  const results = await query<T>(sql, params);
  return results.length > 0 ? results[0] : null;
}

/**
 * Insert data and return the inserted ID
 * @param sql SQL insert statement
 * @param params Query parameters
 * @returns Insert ID
 */
export async function insert(sql: string, params?: unknown[]): Promise<number> {
  const connection = await createConnection();
  try {
    const [result] = await connection.execute(sql, params);
    return (result as mysql.OkPacket).insertId;
  } finally {
    await connection.end();
  }
}

/**
 * Execute update/delete and return affected rows
 * @param sql SQL statement
 * @param params Query parameters
 * @returns Number of affected rows
 */
export async function execute(sql: string, params?: unknown[]): Promise<number> {
  const connection = await createConnection();
  try {
    const [result] = await connection.execute(sql, params);
    return (result as mysql.OkPacket).affectedRows;
  } finally {
    await connection.end();
  }
}
