const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
  getDashboardStats,
} = require("../controllers/messManagerController");

router.get(
  "/dashboard",
  authMiddleware(["MESS_MANAGER"]),
  getDashboardStats
);

module.exports = router;