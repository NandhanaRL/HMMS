const db = require("../config/db");

// ================= GET STUDENT FEES =================

const getStudentFees = async (req, res) => {
  try {
    let studentId;

    // Student can only view own fees
    if (req.user.role === "STUDENT") {
      const [student] = await db.query(
        `SELECT student_id
         FROM STUDENT
         WHERE user_id=?`,
        [req.user.user_id]
      );

      if (student.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Student not found.",
        });
      }

      studentId = student[0].student_id;
    } else {
      // Warden & Mess Manager can view any student
      studentId = req.params.id;

      if (!studentId) {
        return res.status(400).json({
          success: false,
          message: "Student ID is required.",
        });
      }
    }

    const [rows] = await db.query(
      `SELECT
          fee_id,
          fee_type,
          amount,
          due_date,
          status
       FROM fee
       WHERE student_id=?
       ORDER BY due_date`,
      [studentId]
    );

    res.json({
      success: true,
      fees: rows,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: "Server error.",
    });
  }
};

// ================= PAY FEE =================

const payFee = async (req, res) => {
  try {
    const { fee_id } = req.body;

    if (!fee_id) {
      return res.status(400).json({
        success: false,
        message: "fee_id is required.",
      });
    }

    await db.query(
      `UPDATE fee
       SET status='PAID'
       WHERE fee_id=?`,
      [fee_id]
    );

    res.json({
      success: true,
      message: "Fee marked as paid.",
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: "Server error.",
    });
  }
};

// ================= UPDATE FEE STATUS =================

const updateFeeStatus = async (req, res) => {
  try {
    const { status } = req.body;

    await db.query(
      `UPDATE fee
       SET status=?
       WHERE fee_id=?`,
      [status, req.params.id]
    );

    res.json({
      success: true,
      message: "Fee updated successfully.",
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: "Server error.",
    });
  }
};

// ================= FEE REPORT =================

const getFeeReport = async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT
          s.student_id,
          s.roll_no,
          u.username,
          SUM(f.amount) AS total_amount,
          SUM(CASE WHEN f.status='PAID' THEN f.amount ELSE 0 END) AS paid_amount,
          SUM(CASE WHEN f.status!='PAID' THEN f.amount ELSE 0 END) AS pending_amount
       FROM fee f
       JOIN STUDENT s
         ON f.student_id=s.student_id
       JOIN USER u
         ON s.user_id=u.user_id
       GROUP BY s.student_id,s.roll_no,u.username
       ORDER BY s.roll_no`
    );

    res.json({
      success: true,
      report: rows,
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
  getStudentFees,
  payFee,
  updateFeeStatus,
  getFeeReport,
};