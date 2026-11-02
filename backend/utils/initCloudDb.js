const mysql = require("mysql2/promise");
const fs = require("fs");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });

async function initCloudDb() {
  console.log("Connecting to Database at:", process.env.DB_HOST, "Port:", process.env.DB_PORT);

  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    ssl: { rejectUnauthorized: false },
    multipleStatements: true,
  });

  console.log("Connected successfully to Cloud MySQL!");
  const schemaPath = path.join(__dirname, "../database/schema.sql");
  const sql = fs.readFileSync(schemaPath, "utf8");

  console.log("Executing schema.sql to create all tables and seed data...");
  await connection.query(sql);
  console.log("All tables, foreign keys, and seed data created successfully!");

  await connection.end();
}

initCloudDb().catch((err) => {
  console.error("Database setup failed:", err.message);
  process.exit(1);
});
