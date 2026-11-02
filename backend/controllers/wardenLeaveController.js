const db = require("../config/db");

// =======================================
// GET ALL LEAVE APPLICATIONS (Warden)
// =======================================
const getAllLeaves = async (req, res) => {
    try {
        const { status } = req.query;

        let query = `
            SELECT
                l.leave_id,
                s.roll_no,
                u.username,
                l.reason,
                l.from_date,
                l.to_date,
                l.applied_date,
                l.status
            FROM leave_application l
            JOIN student s ON l.student_id = s.student_id
            JOIN user u ON s.user_id = u.user_id
        `;

        const values = [];

        if (status) {
            query += " WHERE l.status = ?";
            values.push(status);
        }

        query += " ORDER BY l.applied_date DESC";

        const [leaves] = await db.execute(query, values);

        res.status(200).json({
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

// =======================================
// APPROVE / REJECT LEAVE
// =======================================
const updateLeaveStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!["APPROVED", "REJECTED"].includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Status must be APPROVED or REJECTED."
            });
        }

        const [warden] = await db.execute(
            "SELECT warden_id FROM warden WHERE user_id = ?",
            [req.user.user_id]
        );

        if (warden.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Warden record not found."
            });
        }

        const wardenId = warden[0].warden_id;

        const [result] = await db.execute(
            `UPDATE leave_application
             SET status = ?, approved_by = ?
             WHERE leave_id = ?`,
            [status, wardenId, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: "Leave application not found."
            });
        }

        res.json({
            success: true,
            message: `Leave ${status.toLowerCase()} successfully.`
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
    getAllLeaves,
    updateLeaveStatus
};