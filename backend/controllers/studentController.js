const db = require("../config/db");

// ================= STUDENT PROFILE =================
const getStudentProfile = async (req, res) => {
    try {
        const userId = req.user.user_id;

        const [student] = await db.execute(
            `SELECT
                u.user_id,
                u.username,
                u.email,
                u.phone,
                u.role,
                s.student_id,
                s.roll_no,
                s.department,
                s.year_of_study,
                s.guardian_contact
             FROM USER u
             JOIN STUDENT s ON u.user_id = s.user_id
             WHERE u.user_id = ?`,
            [userId]
        );

        if (student.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Student not found."
            });
        }

        res.json({
            success: true,
            student: student[0]
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Server error."
        });
    }
};

// ================= ROOM DETAILS =================
const getStudentRoom = async (req, res) => {
    try {
        const userId = req.user.user_id;

        const [room] = await db.execute(
            `SELECT
                r.room_number,
                r.room_type,
                r.capacity,
                r.status AS room_status,
                ra.allocation_date,
                ra.status AS allocation_status
             FROM ROOM_ALLOCATION ra
             JOIN STUDENT s ON ra.student_id = s.student_id
             JOIN ROOM r ON ra.room_id = r.room_id
             WHERE s.user_id = ?
             ORDER BY ra.allocation_date DESC
             LIMIT 1`,
            [userId]
        );

        if (room.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Room allocation not found."
            });
        }

        res.json({
            success: true,
            room: room[0]
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Server error."
        });
    }
};

// ================= ATTENDANCE =================
const getAttendance = async (req, res) => {
    try {
        const userId = req.user.user_id;

        const [student] = await db.execute(
            "SELECT student_id FROM STUDENT WHERE user_id=?",
            [userId]
        );

        if (student.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Student not found."
            });
        }

        const [attendance] = await db.execute(
            `SELECT date, meal_type, present
             FROM ATTENDANCE
             WHERE student_id=?
             ORDER BY date DESC`,
            [student[0].student_id]
        );

        res.json({
            success: true,
            attendance
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Server error."
        });
    }
};

// ================= APPLY LEAVE =================
const applyLeave = async (req, res) => {
    try {
        const userId = req.user.user_id;
        const { reason, from_date, to_date } = req.body;

        const [student] = await db.execute(
            "SELECT student_id FROM STUDENT WHERE user_id=?",
            [userId]
        );

        if (student.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Student not found."
            });
        }

        await db.execute(
            `INSERT INTO LEAVE_APPLICATION
            (student_id, reason, from_date, to_date, status)
            VALUES (?, ?, ?, ?, 'PENDING')`,
            [student[0].student_id, reason, from_date, to_date]
        );

        res.status(201).json({
            success: true,
            message: "Leave applied successfully."
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Server error."
        });
    }
};

// ================= LEAVE HISTORY =================
const getLeaveHistory = async (req, res) => {
    try {
        const userId = req.user.user_id;

        const [student] = await db.execute(
            "SELECT student_id FROM STUDENT WHERE user_id=?",
            [userId]
        );

        const [leaves] = await db.execute(
            `SELECT leave_id, reason, from_date, to_date,
                    applied_date, status
             FROM LEAVE_APPLICATION
             WHERE student_id=?
             ORDER BY applied_date DESC`,
            [student[0].student_id]
        );

        res.json({
            success: true,
            leaves
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Server error."
        });
    }
};

// ================= FEE DETAILS =================
const getFeeDetails = async (req, res) => {
    try {
        const userId = req.user.user_id;

        const [student] = await db.execute(
            "SELECT student_id FROM STUDENT WHERE user_id=?",
            [userId]
        );

        const [fees] = await db.execute(
            `SELECT fee_id, fee_type, amount, due_date, status
             FROM FEE
             WHERE student_id=?
             ORDER BY due_date ASC`,
            [student[0].student_id]
        );

        res.json({
            success: true,
            fees
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Server error."
        });
    }
};

// ================= NOTIFICATIONS =================
const getNotifications = async (req, res) => {
    try {
        const userId = req.user.user_id;

        const [notifications] = await db.execute(
            `SELECT notification_id, title, message, is_read, created_at
             FROM NOTIFICATIONS
             WHERE user_id=?
             ORDER BY created_at DESC`,
            [userId]
        );

        res.json({
            success: true,
            notifications
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Server error."
        });
    }
};

// ================= SUBMIT COMPLAINT =================
const submitComplaint = async (req, res) => {
    try {
        const userId = req.user.user_id;
        const { category, description } = req.body;

        const [student] = await db.execute(
            "SELECT student_id FROM STUDENT WHERE user_id=?",
            [userId]
        );

        if (student.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Student not found."
            });
        }

        let cleanCategory = "OTHER";
        if (category) {
            const catUpper = String(category).toUpperCase();
            if (catUpper === "ROOM" || catUpper.includes("ROOM")) {
                cleanCategory = "ROOM";
            } else if (catUpper === "MESS" || catUpper.includes("MESS") || catUpper.includes("FOOD")) {
                cleanCategory = "MESS";
            } else if (catUpper === "MAINTENANCE" || catUpper.includes("MAINT") || catUpper.includes("ELECT") || catUpper.includes("PLUMB") || catUpper.includes("CLEAN")) {
                cleanCategory = "MAINTENANCE";
            } else if (["ROOM", "MESS", "MAINTENANCE", "OTHER"].includes(catUpper)) {
                cleanCategory = catUpper;
            }
        }

        await db.execute(
            `INSERT INTO COMPLAINT
            (student_id, category, description, status)
            VALUES (?, ?, ?, 'OPEN')`,
            [student[0].student_id, cleanCategory, description]
        );

        res.status(201).json({
            success: true,
            message: "Complaint submitted successfully."
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Server error."
        });
    }
};

// ================= COMPLAINT HISTORY =================
const getComplaintHistory = async (req, res) => {
    try {
        const userId = req.user.user_id;

        const [student] = await db.execute(
            "SELECT student_id FROM STUDENT WHERE user_id=?",
            [userId]
        );

        if (student.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Student not found."
            });
        }

        const [complaints] = await db.execute(
            `SELECT complaint_id,
                    category,
                    description,
                    status,
                    submitted_date,
                    resolved_date,
                    resolution_notes
             FROM COMPLAINT
             WHERE student_id=?
             ORDER BY submitted_date DESC`,
            [student[0].student_id]
        );

        res.json({
            success: true,
            complaints
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Server error."
        });
    }
};

// ================= GET ALL STUDENTS (WARDEN) =================
const getAllStudents = async (req, res) => {
    try {
        const [students] = await db.execute(`
            SELECT
                s.student_id,
                s.roll_no,
                u.username
            FROM STUDENT s
            JOIN USER u ON s.user_id = u.user_id
            ORDER BY u.username
        `);

        res.json({
            success: true,
            students
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Server error."
        });
    }
};

module.exports = {
    getStudentProfile,
    getStudentRoom,
    getAttendance,
    applyLeave,
    getLeaveHistory,
    getFeeDetails,
    getNotifications,
    submitComplaint,
    getComplaintHistory,
    getAllStudents
};