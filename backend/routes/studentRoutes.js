const express = require("express");

const router = express.Router();

const verifyToken = require("../middleware/authMiddleware");

const {
  getStudentProfile,
  getStudentRoom,
  getAttendance,
  applyLeave,
  getLeaveHistory,
  getFeeDetails,
  getNotifications,
  submitComplaint,
  getComplaintHistory,
  getAllStudents,
} = require("../controllers/studentController");
const roomController = require("../controllers/roomController");
const attendanceController = require("../controllers/attendanceController");

// ================= STUDENT ROUTES =================

// Profile
router.get("/profile", verifyToken(["STUDENT"]), getStudentProfile);

// Room
router.get("/room", verifyToken(["STUDENT"]), getStudentRoom);
router.get("/my-room", verifyToken(["STUDENT"]), roomController.getMyRoom);

// Attendance
router.get("/attendance", verifyToken(["STUDENT"]), getAttendance);
router.get("/my-attendance", verifyToken(["STUDENT"]), attendanceController.getMyAttendance);

// Leave
router.post("/leave", verifyToken(["STUDENT"]), applyLeave);
router.get("/leave", verifyToken(["STUDENT"]), getLeaveHistory);

// Fee
router.get("/fee", verifyToken(["STUDENT"]), getFeeDetails);

// Notifications
router.get("/notifications", verifyToken(["STUDENT"]), getNotifications);

// Complaint
router.post("/complaint", verifyToken(["STUDENT"]), submitComplaint);
router.get("/complaint", verifyToken(["STUDENT"]), getComplaintHistory);

// ================= WARDEN ROUTE =================

// Get all students (used for room allocation)
router.get("/all", verifyToken(["WARDEN"]), getAllStudents);

module.exports = router;