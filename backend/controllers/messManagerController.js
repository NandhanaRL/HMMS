const db = require("../config/db");

// ================= DASHBOARD =================

const getDashboardStats = async (req, res) => {
  try {
    const [[students]] = await db.query(
      "SELECT COUNT(*) AS total_students FROM STUDENT"
    );

    const [[paid]] = await db.query(
      "SELECT COUNT(*) AS paid_fees FROM FEE WHERE status='PAID'"
    );

    const [[pending]] = await db.query(
      "SELECT COUNT(*) AS pending_fees FROM FEE WHERE status!='PAID'"
    );

    const [[attendance]] = await db.query(`
      SELECT COUNT(*) AS today_attendance
      FROM ATTENDANCE
      WHERE date=CURDATE() AND present=1
    `);

    res.json({
      success: true,
      stats: {
        total_students: students.total_students,
        paid_fees: paid.paid_fees,
        pending_fees: pending.pending_fees,
        today_attendance: attendance.today_attendance,
      },
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: "Server error.",
    });
  }
};

module.exports = {
  getDashboardStats,
};