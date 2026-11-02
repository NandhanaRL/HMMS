const db = require("../config/db");

// ================= MARK ATTENDANCE (WARDEN) =================
const markAttendance = async (req, res) => {
    try {
        const { student_id, date, meal_type, present } = req.body;

        if (!student_id || !date || !meal_type) {
            return res.status(400).json({
                success: false,
                message: "student_id, date and meal_type are required."
            });
        }

        const [existing] = await db.query(
            `SELECT attendance_id
             FROM ATTENDANCE
             WHERE student_id=? AND date=? AND meal_type=?`,
            [student_id, date, meal_type]
        );

        if (existing.length > 0) {
            await db.query(
                `UPDATE ATTENDANCE
                 SET present=?
                 WHERE attendance_id=?`,
                [present ? 1 : 0, existing[0].attendance_id]
            );

            return res.json({
                success: true,
                message: "Attendance updated successfully."
            });
        }

        await db.query(
            `INSERT INTO ATTENDANCE
            (student_id, date, meal_type, present)
            VALUES (?, ?, ?, ?)`,
            [student_id, date, meal_type, present ? 1 : 0]
        );

        res.json({
            success: true,
            message: "Attendance marked successfully."
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: "Server error."
        });
    }
};

// ================= LOGGED-IN STUDENT ATTENDANCE =================
const getMyAttendance = async (req, res) => {
    try {
        const userId = req.user.user_id;

        const [student] = await db.query(
            `SELECT student_id
             FROM STUDENT
             WHERE user_id=?`,
            [userId]
        );

        if (student.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Student not found."
            });
        }

        const studentId = student[0].student_id;

        const [rows] = await db.query(
            `SELECT attendance_id,
                    date,
                    meal_type,
                    present
             FROM ATTENDANCE
             WHERE student_id=?
             ORDER BY date DESC,
             FIELD(meal_type,'BREAKFAST','LUNCH','DINNER')`,
            [studentId]
        );

        const total = rows.length;
        const presentCount = rows.filter(r => r.present === 1).length;
        const absentCount = total - presentCount;
        const percentage = total === 0
            ? 0
            : Number(((presentCount / total) * 100).toFixed(2));

        res.json({
            success: true,
            summary: {
                total,
                present: presentCount,
                absent: absentCount,
                percentage
            },
            attendance: rows
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: "Server error."
        });
    }
};

// ================= STUDENT BY ID =================
const getStudentAttendance = async (req, res) => {
    try {

        const [rows] = await db.query(
            `SELECT attendance_id,
                    date,
                    meal_type,
                    present
             FROM ATTENDANCE
             WHERE student_id=?
             ORDER BY date DESC,
             FIELD(meal_type,'BREAKFAST','LUNCH','DINNER')`,
            [req.params.id]
        );

        res.json({
            success: true,
            attendance: rows
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: "Server error."
        });
    }
};

// ================= TODAY'S ATTENDANCE (WARDEN) =================
const getTodayAttendance = async (req, res) => {
    try {

        const [rows] = await db.query(`
            SELECT
                s.student_id,
                s.roll_no,
                u.username,
                meal.meal_type,
                a.attendance_id,
                IFNULL(a.present,0) AS present
            FROM STUDENT s
            JOIN USER u
                ON s.user_id=u.user_id

            CROSS JOIN (
                SELECT 'BREAKFAST' AS meal_type
                UNION ALL
                SELECT 'LUNCH'
                UNION ALL
                SELECT 'DINNER'
            ) meal

            LEFT JOIN ATTENDANCE a
                ON a.student_id=s.student_id
                AND a.date=CURDATE()
                AND a.meal_type=meal.meal_type

            ORDER BY
                s.roll_no,
                FIELD(meal.meal_type,'BREAKFAST','LUNCH','DINNER')
        `);

        res.json({
            success: true,
            attendance: rows
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: "Server error."
        });
    }
};

// ================= ATTENDANCE REPORT =================
const getAttendanceReport = async (req, res) => {
    try {

        const [rows] = await db.query(
            `SELECT
                s.student_id,
                s.roll_no,
                u.username,
                COUNT(*) AS total_records,
                SUM(present) AS present_count,
                ROUND((SUM(present)/COUNT(*))*100,2) AS attendance_percentage
             FROM ATTENDANCE a
             JOIN STUDENT s ON a.student_id=s.student_id
             JOIN USER u ON s.user_id=u.user_id
             GROUP BY s.student_id,s.roll_no,u.username
             ORDER BY attendance_percentage DESC`
        );

        res.json({
            success: true,
            report: rows
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: "Server error."
        });
    }
};

module.exports = {
    markAttendance,
    getMyAttendance,
    getStudentAttendance,
    getTodayAttendance,
    getAttendanceReport
};