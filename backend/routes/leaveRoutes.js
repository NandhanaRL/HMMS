const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
  applyLeave,
  getLeaveHistory,
} = require("../controllers/leaveController");

// Student routes
router.post(
  "/",
  authMiddleware(["STUDENT"]),
  applyLeave
);

router.get(
  "/",
  authMiddleware(["STUDENT"]),
  getLeaveHistory
);

module.exports = router;