import mysql from "mysql2/promise";

const globalForDb = globalThis as unknown as {
  mysqlPool?: mysql.Pool;
  mysqlSchema?: Promise<void>;
};

export function isDatabaseConfigured() {
  return Boolean(
    process.env.DATABASE_HOST?.trim() &&
      process.env.DATABASE_USER?.trim() &&
      process.env.DATABASE_PASSWORD?.trim() &&
      process.env.DATABASE_NAME?.trim(),
  );
}

function required(name: string) {
  const value = process.env[name]?.trim();
  if (!value) {
    throw new Error(`Missing ${name}. Add it to .env.local`);
  }
  return value;
}

export function getPool() {
  if (!globalForDb.mysqlPool) {
    globalForDb.mysqlPool = mysql.createPool({
      host: required("DATABASE_HOST"),
      port: Number(process.env.DATABASE_PORT || 3306),
      user: required("DATABASE_USER"),
      password: required("DATABASE_PASSWORD"),
      database: required("DATABASE_NAME"),
      waitForConnections: true,
      connectionLimit: 4,
      connectTimeout: 8000,
      enableKeepAlive: true,
      charset: "utf8mb4",
    });
  }
  return globalForDb.mysqlPool;
}

export async function ensureSchema() {
  if (!globalForDb.mysqlSchema) {
    globalForDb.mysqlSchema = (async () => {
      const pool = getPool();
      await pool.query(
        `CREATE TABLE IF NOT EXISTS users (
          id CHAR(36) NOT NULL,
          email VARCHAR(255) NOT NULL,
          name VARCHAR(255) NULL,
          password_hash VARCHAR(255) NULL,
          image VARCHAR(1024) NULL,
          google_id VARCHAR(255) NULL,
          provider VARCHAR(32) NOT NULL DEFAULT 'credentials',
          last_login_at DATETIME NULL,
          created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          PRIMARY KEY (id),
          UNIQUE KEY uk_users_email (email),
          UNIQUE KEY uk_users_google_id (google_id)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,
      );
      await pool.query(
        `CREATE TABLE IF NOT EXISTS contacts (
          id CHAR(36) NOT NULL,
          name VARCHAR(255) NOT NULL,
          email VARCHAR(255) NOT NULL,
          topic VARCHAR(32) NOT NULL,
          message TEXT NOT NULL,
          created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
          PRIMARY KEY (id),
          KEY idx_contacts_created (created_at)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,
      );
    })();
  }
  await globalForDb.mysqlSchema;
}
