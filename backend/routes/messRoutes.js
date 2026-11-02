const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
    getTodayMenu,
    addMenuItem
} = require("../controllers/messController");

// Everyone can view menu
router.get("/menu", getTodayMenu);

// Admin adds menu
router.post(
    "/menu",
    authMiddleware(["ADMIN"]),
    addMenuItem
);

module.exports = router;