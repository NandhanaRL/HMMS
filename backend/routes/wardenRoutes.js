const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
  getDashboardStats,
  getAllStudents,
  getAllLeaves,
  updateLeaveStatus,
  getAllComplaints,
  updateComplaint,
} = require("../controllers/wardenController");

// Dashboard
router.get(
  "/dashboard",
  authMiddleware(["WARDEN"]),
  getDashboardStats
);

// Student Management
router.get(
  "/students",
  authMiddleware(["WARDEN"]),
  getAllStudents
);

// Leave Management
router.get(
  "/leaves",
  authMiddleware(["WARDEN"]),
  getAllLeaves
);

router.put(
  "/leaves/:id",
  authMiddleware(["WARDEN"]),
  updateLeaveStatus
);

// Complaint Management
router.get(
  "/complaints",
  authMiddleware(["WARDEN"]),
  getAllComplaints
);

router.put(
  "/complaints/:id",
  authMiddleware(["WARDEN"]),
  updateComplaint
);

module.exports = router;