const express = require("express");

const router = express.Router();

const {
  registerStudent,
  login,
  adminLogin,
  wardenLogin,
  messManagerLogin,
} = require("../controllers/authController");

const {
  registerStudentValidation,
  loginValidation,
} = require("../middleware/validators/authValidator");

// Student
router.post("/register", registerStudentValidation, registerStudent);
router.post("/login", loginValidation, login);

// Admin
router.post("/admin/login", loginValidation, adminLogin);

// Warden
router.post("/warden/login", loginValidation, wardenLogin);

// Mess Manager
router.post("/mess-manager/login", loginValidation, messManagerLogin);

module.exports = router;