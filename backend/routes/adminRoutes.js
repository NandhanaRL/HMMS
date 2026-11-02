const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
  getStudents,
  getWardens,
  createWarden,
  updateWarden,
  deleteWarden,
  getMessManagers,
  createMessManager,
  updateMessManager,
  deleteMessManager,
} = require("../controllers/adminController");

const {
  addStudent,
  updateStudent,
  deleteStudent,
} = require("../controllers/adminStudentController");

// ================= STUDENTS =================

router.get(
  "/students",
  authMiddleware(["ADMIN"]),
  getStudents
);

router.post(
  "/students",
  authMiddleware(["ADMIN"]),
  addStudent
);

router.put(
  "/students/:id",
  authMiddleware(["ADMIN"]),
  updateStudent
);

router.delete(
  "/students/:id",
  authMiddleware(["ADMIN"]),
  deleteStudent
);

// ================= WARDENS =================

router.get(
  "/wardens",
  authMiddleware(["ADMIN"]),
  getWardens
);

router.post(
  "/wardens",
  authMiddleware(["ADMIN"]),
  createWarden
);

router.put(
  "/wardens/:id",
  authMiddleware(["ADMIN"]),
  updateWarden
);

router.delete(
  "/wardens/:id",
  authMiddleware(["ADMIN"]),
  deleteWarden
);

// ================= MESS MANAGERS =================

router.get(
  "/mess-managers",
  authMiddleware(["ADMIN"]),
  getMessManagers
);

router.post(
  "/mess-managers",
  authMiddleware(["ADMIN"]),
  createMessManager
);

router.put(
  "/mess-managers/:id",
  authMiddleware(["ADMIN"]),
  updateMessManager
);

router.delete(
  "/mess-managers/:id",
  authMiddleware(["ADMIN"]),
  deleteMessManager
);

module.exports = router;