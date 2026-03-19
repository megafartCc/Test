import mysql from 'mysql2/promise'

const {
  MYSQL_URL,
  MYSQL_HOST = 'localhost',
  MYSQL_PORT = '3306',
  MYSQL_DATABASE,
  MYSQL_USER,
  MYSQL_PASSWORD,
} = process.env

if (!MYSQL_URL && (!MYSQL_DATABASE || !MYSQL_USER)) {
  throw new Error(
    'Missing MySQL configuration. Set MYSQL_URL or provide MYSQL_DATABASE, MYSQL_USER, MYSQL_PASSWORD, MYSQL_HOST, and MYSQL_PORT.',
  )
}

const pool = mysql.createPool(
  MYSQL_URL
    ? {
        uri: MYSQL_URL,
        connectionLimit: 10,
      }
    : {
        host: MYSQL_HOST,
        port: Number(MYSQL_PORT),
        database: MYSQL_DATABASE,
        user: MYSQL_USER,
        password: MYSQL_PASSWORD,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0,
      },
)

export async function ensureDatabase() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
      email VARCHAR(255) NOT NULL,
      password_hash VARCHAR(255) NOT NULL,
      full_name VARCHAR(120) NOT NULL,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      PRIMARY KEY (id),
      UNIQUE KEY uq_users_email (email)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `)
}

export default pool
