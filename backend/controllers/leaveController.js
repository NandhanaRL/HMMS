const pool = require("../config/db");

// ================= APPLY LEAVE =================
const applyLeave = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const { reason, from_date, to_date } = req.body;

    if (!reason || !from_date || !to_date) {
      return res.status(400).json({
        success: false,
        message: "Reason, from date and to date are required.",
      });
    }

    // Get student ID from logged-in user
    const [student] = await pool.query(
      "SELECT student_id FROM STUDENT WHERE user_id = ?",
      [userId]
    );

    if (student.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Student not found.",
      });
    }

    // Insert leave application
    await pool.query(
      `INSERT INTO LEAVE_APPLICATION
      (student_id, reason, from_date, to_date)
      VALUES (?, ?, ?, ?)`,
      [
        student[0].student_id,
        reason,
        from_date,
        to_date,
      ]
    );

    res.status(201).json({
      success: true,
      message: "Leave application submitted successfully.",
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server error.",
    });
  }
};

// ================= GET MY LEAVE HISTORY =================
const getLeaveHistory = async (req, res) => {
  try {
    const userId = req.user.user_id;

    // Get student ID
    const [student] = await pool.query(
      "SELECT student_id FROM STUDENT WHERE user_id = ?",
      [userId]
    );

    if (student.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Student not found.",
      });
    }

    // Fetch leave history
    const [rows] = await pool.query(
      `SELECT
          leave_id,
          reason,
          from_date,
          to_date,
          applied_date,
          status
       FROM LEAVE_APPLICATION
       WHERE student_id = ?
       ORDER BY applied_date DESC`,
      [student[0].student_id]
    );

    res.json({
      success: true,
      leaves: rows,
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server error.",
    });
  }
};

module.exports = {
  applyLeave,
  getLeaveHistory,
};