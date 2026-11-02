const db = require("../config/db");
const bcrypt = require("bcrypt");

// GET ALL STUDENTS
const getStudents = async (req, res) => {
  try {
    const [students] = await db.query(`
      SELECT
        s.student_id,
        u.user_id,
        u.username,
        u.email,
        u.phone,
        s.roll_no,
        s.department,
        s.year_of_study,
        s.guardian_contact
      FROM STUDENT s
      JOIN USER u ON s.user_id=u.user_id
      ORDER BY s.roll_no
    `);

    res.json({ success: true, students });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error." });
  }
};

// ADD STUDENT
const addStudent = async (req, res) => {
  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    const {
      username,
      email,
      password,
      phone,
      roll_no,
      department,
      year_of_study,
      guardian_contact,
    } = req.body;

    const [existing] = await connection.query(
      "SELECT user_id FROM USER WHERE email=?",
      [email]
    );

    if (existing.length > 0) {
      await connection.rollback();
      return res.status(400).json({
        success: false,
        message: "Email already exists.",
      });
    }

    const hashed = await bcrypt.hash(password || "123456", 10);

    const [user] = await connection.query(
      `INSERT INTO USER
      (username,email,password_hash,phone,role)
      VALUES(?,?,?,?, 'STUDENT')`,
      [username, email, hashed, phone]
    );

    await connection.query(
      `INSERT INTO STUDENT
      (user_id,roll_no,department,year_of_study,guardian_contact)
      VALUES(?,?,?,?,?)`,
      [
        user.insertId,
        roll_no,
        department,
        year_of_study,
        guardian_contact,
      ]
    );

    await connection.commit();

    res.json({
      success: true,
      message: "Student added successfully.",
    });

  } catch (err) {
    await connection.rollback();
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Server error.",
    });
  } finally {
    connection.release();
  }
};

// UPDATE STUDENT
const updateStudent = async (req, res) => {
  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    const { id } = req.params;

    const {
      username,
      email,
      phone,
      roll_no,
      department,
      year_of_study,
      guardian_contact,
    } = req.body;

    const [student] = await connection.query(
      "SELECT user_id FROM STUDENT WHERE student_id=?",
      [id]
    );

    if (student.length === 0) {
      await connection.rollback();
      return res.status(404).json({
        success: false,
        message: "Student not found.",
      });
    }

    const userId = student[0].user_id;

    await connection.query(
      `UPDATE USER
       SET username=?,email=?,phone=?
       WHERE user_id=?`,
      [username, email, phone, userId]
    );

    await connection.query(
      `UPDATE STUDENT
       SET roll_no=?,department=?,year_of_study=?,guardian_contact=?
       WHERE student_id=?`,
      [roll_no, department, year_of_study, guardian_contact, id]
    );

    await connection.commit();

    res.json({
      success: true,
      message: "Student updated successfully.",
    });

  } catch (err) {
    await connection.rollback();
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Server error.",
    });
  } finally {
    connection.release();
  }
};

// DELETE STUDENT
const deleteStudent = async (req, res) => {
  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    const { id } = req.params;

    const [student] = await connection.query(
      "SELECT user_id FROM STUDENT WHERE student_id=?",
      [id]
    );

    if (student.length === 0) {
      await connection.rollback();
      return res.status(404).json({
        success: false,
        message: "Student not found.",
      });
    }

    const userId = student[0].user_id;

    await connection.query(
      "DELETE FROM STUDENT WHERE student_id=?",
      [id]
    );

    await connection.query(
      "DELETE FROM USER WHERE user_id=?",
      [userId]
    );

    await connection.commit();

    res.json({
      success: true,
      message: "Student deleted successfully.",
    });

  } catch (err) {
    await connection.rollback();
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Server error.",
    });
  } finally {
    connection.release();
  }
};

module.exports = {
  getStudents,
  addStudent,
  updateStudent,
  deleteStudent,
};