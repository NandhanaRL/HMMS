const db = require("../config/db");

// ================= GET TODAY'S MENU =================
const getTodayMenu = async (req, res) => {
    try {
        const [menu] = await db.execute(`
            SELECT
                item_id,
                meal_type,
                name,
                day
            FROM menu_item
            WHERE day = DAYNAME(CURDATE())
            ORDER BY FIELD(meal_type,'BREAKFAST','LUNCH','SNACKS','DINNER')
        `);

        res.json({
            success: true,
            menu
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Server error."
        });
    }
};

// ================= ADD MENU ITEM =================
const addMenuItem = async (req, res) => {
    try {
        const { mess_id, name, meal_type, day } = req.body;

        if (!mess_id || !name || !meal_type || !day) {
            return res.status(400).json({
                success: false,
                message: "All fields are required."
            });
        }

        const [result] = await db.execute(
            `INSERT INTO menu_item
            (mess_id, name, meal_type, day)
            VALUES (?, ?, ?, ?)`,
            [mess_id, name, meal_type, day]
        );

        res.status(201).json({
            success: true,
            message: "Menu item added successfully.",
            item_id: result.insertId
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
    getTodayMenu,
    addMenuItem
};
