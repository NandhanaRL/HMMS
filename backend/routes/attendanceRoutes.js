const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const attendanceController = require("../controllers/attendanceController");

// ================= STUDENT =================

// Logged-in student's attendance
router.get(
  "/my",
  authMiddleware(["STUDENT"]),
  attendanceController.getMyAttendance
);

router.get(
  "/my-attendance",
  authMiddleware(["STUDENT"]),
  attendanceController.getMyAttendance
);

// ================= WARDEN & MESS MANAGER =================

// Today's attendance
router.get(
  "/today",
  authMiddleware(["WARDEN", "MESS_MANAGER"]),
  attendanceController.getTodayAttendance
);

// Mark attendance (supports both / and /mark)
router.post(
  "/",
  authMiddleware(["WARDEN", "MESS_MANAGER"]),
  attendanceController.markAttendance
);

router.post(
  "/mark",
  authMiddleware(["WARDEN", "MESS_MANAGER"]),
  attendanceController.markAttendance
);

// Attendance report
router.get(
  "/report",
  authMiddleware(["WARDEN", "MESS_MANAGER"]),
  attendanceController.getAttendanceReport
);

// ================= WARDEN ONLY =================

// Student attendance by ID
router.get(
  "/student/:id",
  authMiddleware(["WARDEN"]),
  attendanceController.getStudentAttendance
);

module.exports = router;