const db = require("../config/db");

// ================= DASHBOARD =================

const getDashboardStats = async (req, res) => {
  try {
    const [[students]] = await db.execute(
      "SELECT COUNT(*) AS total_students FROM STUDENT"
    );

    const [[rooms]] = await db.execute(`
      SELECT
        COUNT(*) AS total_rooms,
        SUM(status='AVAILABLE') AS available_rooms,
        SUM(status='FULL') AS occupied_rooms
      FROM ROOM
    `);

    const [[leaves]] = await db.execute(`
      SELECT COUNT(*) AS pending_leaves
      FROM LEAVE_APPLICATION
      WHERE status='PENDING'
    `);

    const [[complaints]] = await db.execute(`
      SELECT
        COUNT(*) AS total_complaints,
        SUM(status='OPEN' OR status='IN_PROGRESS' OR status='PENDING') AS pending_complaints
      FROM COMPLAINT
    `);

    const [[attendance]] = await db.execute(`
      SELECT
        COUNT(*) AS total_records,
        SUM(present) AS present_records
      FROM ATTENDANCE
      WHERE date=CURDATE()
    `);

    const attendancePercentage =
      attendance.total_records === 0
        ? 0
        : Number(
            (
              (attendance.present_records / attendance.total_records) *
              100
            ).toFixed(2)
          );

    const [recentLeaves] = await db.execute(`
      SELECT
        u.username,
        l.reason,
        l.from_date,
        l.to_date,
        l.status
      FROM LEAVE_APPLICATION l
      JOIN STUDENT s ON l.student_id = s.student_id
      JOIN USER u ON s.user_id = u.user_id
      ORDER BY l.applied_date DESC
      LIMIT 5
    `);

    res.json({
      success: true,
      stats: {
        total_students: students.total_students,
        total_rooms: rooms.total_rooms,
        occupied_rooms: rooms.occupied_rooms || 0,
        available_rooms: rooms.available_rooms || 0,
        pending_leaves: leaves.pending_leaves,
        total_complaints: complaints.total_complaints,
        pending_complaints: complaints.pending_complaints || 0,
        today_attendance_percentage: attendancePercentage,
      },
      recentLeaves,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error.",
    });
  }
};

// ================= GET ALL STUDENTS =================
// FIXED: Returns each student only once by selecting the latest room allocation.

const getAllStudents = async (req, res) => {
  try {
    const { search = "" } = req.query;

    const [students] = await db.execute(
      `
      SELECT
        s.student_id,
        s.roll_no,
        u.username,
        u.email,
        u.phone,
        s.department,
        s.year_of_study,
        r.room_number
      FROM STUDENT s
      JOIN USER u
        ON s.user_id = u.user_id

      LEFT JOIN ROOM_ALLOCATION ra
        ON ra.allocation_id = (
          SELECT allocation_id
          FROM ROOM_ALLOCATION
          WHERE student_id = s.student_id
          ORDER BY allocation_date DESC
          LIMIT 1
        )

      LEFT JOIN ROOM r
        ON ra.room_id = r.room_id

      WHERE
        u.username LIKE ?
        OR s.roll_no LIKE ?

      ORDER BY u.username ASC
      `,
      [`%${search}%`, `%${search}%`]
    );

    res.json({
      success: true,
      students,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error.",
    });
  }
};

// ================= GET ALL LEAVES =================

const getAllLeaves = async (req, res) => {
  try {
    const [leaves] = await db.execute(`
      SELECT
        l.leave_id,
        u.username,
        s.roll_no,
        l.reason,
        l.from_date,
        l.to_date,
        l.status,
        l.applied_date
      FROM LEAVE_APPLICATION l
      JOIN STUDENT s ON l.student_id = s.student_id
      JOIN USER u ON s.user_id = u.user_id
      ORDER BY l.applied_date DESC
    `);

    res.json({
      success: true,
      leaves,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error.",
    });
  }
};

// ================= UPDATE LEAVE STATUS =================

const updateLeaveStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const [result] = await db.execute(
      `
      UPDATE LEAVE_APPLICATION
      SET status = ?
      WHERE leave_id = ?
      `,
      [status, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Leave not found.",
      });
    }

    res.json({
      success: true,
      message: "Leave updated successfully.",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error.",
    });
  }
};

// ================= GET ALL COMPLAINTS =================

const getAllComplaints = async (req, res) => {
  try {
    const { status, category } = req.query;

    let query = `
      SELECT
        c.complaint_id,
        s.roll_no,
        u.username,
        c.category,
        c.description,
        c.status,
        c.resolution_notes,
        c.resolved_date
      FROM COMPLAINT c
      JOIN STUDENT s ON c.student_id = s.student_id
      JOIN USER u ON s.user_id = u.user_id
    `;

    const conditions = [];
    const values = [];

    if (status && status !== "ALL") {
      if (status === "PENDING" || status === "OPEN") {
        conditions.push("(c.status = 'OPEN' OR c.status = 'IN_PROGRESS' OR c.status = 'PENDING')");
      } else {
        conditions.push("c.status = ?");
        values.push(status);
      }
    }

    if (category) {
      conditions.push("c.category = ?");
      values.push(category);
    }

    if (conditions.length > 0) {
      query += " WHERE " + conditions.join(" AND ");
    }

    query += " ORDER BY c.complaint_id DESC";

    const [complaints] = await db.execute(query, values);

    res.json({
      success: true,
      complaints,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error.",
    });
  }
};

// ================= UPDATE COMPLAINT =================

const updateComplaint = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, resolution_notes } = req.body;

    const [wardenRows] = await db.execute(
      "SELECT warden_id FROM WARDEN WHERE user_id = ?",
      [req.user.user_id]
    );

    if (wardenRows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Warden not found.",
      });
    }

    const wardenId = wardenRows[0].warden_id;

    const [result] = await db.execute(
      `
      UPDATE COMPLAINT
      SET
        status = ?,
        resolution_notes = ?,
        resolved_by = ?,
        resolved_date = CASE
          WHEN ? = 'RESOLVED' THEN NOW()
          ELSE resolved_date
        END
      WHERE complaint_id = ?
      `,
      [status, resolution_notes, wardenId, status, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Complaint not found.",
      });
    }

    res.json({
      success: true,
      message: "Complaint updated successfully.",
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
  getDashboardStats,
  getAllStudents,
  getAllLeaves,
  updateLeaveStatus,
  getAllComplaints,
  updateComplaint,
};