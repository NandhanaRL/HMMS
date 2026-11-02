const pool = require("../config/db");

async function testConnection() {
    try {
        const connection = await pool.getConnection();

        console.log("✅ MySQL connected successfully!");
        console.log("📂 Database:", connection.config.database);

        connection.release();
    } catch (error) {
        console.error("❌ MySQL connection failed.");
        console.error(error.message);
    }
}

module.exports = testConnection;