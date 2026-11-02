const express = require("express");

const router = express.Router();

const auth = require("../middleware/authMiddleware");

const {
  getStudents,
  addStudent,
  updateStudent,
  deleteStudent,
} = require("../controllers/adminStudentController");

router.get("/", auth(["ADMIN"]), getStudents);

router.post("/", auth(["ADMIN"]), addStudent);

router.put("/:id", auth(["ADMIN"]), updateStudent);

router.delete("/:id", auth(["ADMIN"]), deleteStudent);

module.exports = router;