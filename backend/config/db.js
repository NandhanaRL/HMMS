require("dotenv").config();
const mockDb = require("./mockDb");

let pool;

// Use external MySQL only if USE_REAL_DB is explicitly set to 'true' and DB_HOST is present
if (process.env.USE_REAL_DB === "true" && process.env.DB_HOST) {
  const mysql = require("mysql2/promise");
  pool = mysql.createPool({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    ssl:
      process.env.DB_SSL === "true" || process.env.NODE_ENV === "production"
        ? { rejectUnauthorized: false }
        : undefined,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  });
} else {
  console.log("⚡ [HMMS] Running in Standalone In-Memory Database Mode with default users.");
  pool = mockDb;
}

module.exports = pool;