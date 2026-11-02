const db = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// ================= STUDENT REGISTER =================
const registerStudent = async (req, res) => {
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

    const [existing] = await connection.execute(
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

    const hashedPassword = await bcrypt.hash(password, 10);

    const [userResult] = await connection.execute(
      `INSERT INTO USER
      (username,email,password_hash,phone,role)
      VALUES (?,?,?,?, 'STUDENT')`,
      [username, email, hashedPassword, phone]
    );

    await connection.execute(
      `INSERT INTO STUDENT
      (user_id,roll_no,department,year_of_study,guardian_contact)
      VALUES (?,?,?,?,?)`,
      [
        userResult.insertId,
        roll_no,
        department,
        year_of_study,
        guardian_contact,
      ]
    );

    await connection.commit();

    res.status(201).json({
      success: true,
      message: "Student registered successfully.",
    });
  } catch (error) {
    await connection.rollback();
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server error.",
    });
  } finally {
    connection.release();
  }
};

// ================= STUDENT LOGIN =================
const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    const [users] = await db.execute(
      "SELECT * FROM USER WHERE username=?",
      [username]
    );

    if (users.length === 0 || users[0].role !== "STUDENT") {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials.",
      });
    }

    const user = users[0];

    const isMatch = await bcrypt.compare(password, user.password_hash);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials.",
      });
    }

    const token = jwt.sign(
      { user_id: user.user_id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "14d" }
    );

    res.json({
      success: true,
      message: "Login successful.",
      token,
      user: {
        user_id: user.user_id,
        username: user.username,
        role: user.role,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error.",
    });
  }
};

// ================= ADMIN LOGIN =================
const adminLogin = async (req, res) => {
  try {
    const { username, password } = req.body;

    const [users] = await db.execute(
      "SELECT * FROM USER WHERE username=?",
      [username]
    );

    if (users.length === 0 || users[0].role !== "ADMIN") {
      return res.status(401).json({
        success: false,
        message: "Invalid admin credentials.",
      });
    }

    const user = users[0];

    const isMatch = await bcrypt.compare(password, user.password_hash);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid admin credentials.",
      });
    }

    const token = jwt.sign(
      { user_id: user.user_id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "14d" }
    );

    res.json({
      success: true,
      message: "Admin login successful.",
      token,
      admin: {
        user_id: user.user_id,
        username: user.username,
        role: user.role,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error.",
    });
  }
};

// ================= WARDEN LOGIN =================
const wardenLogin = async (req, res) => {
  try {
    const { username, password } = req.body;

    const [users] = await db.execute(
      "SELECT * FROM USER WHERE username=?",
      [username]
    );

    if (users.length === 0 || users[0].role !== "WARDEN") {
      return res.status(401).json({
        success: false,
        message: "Invalid warden credentials.",
      });
    }

    const user = users[0];

    const isMatch = await bcrypt.compare(password, user.password_hash);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid warden credentials.",
      });
    }

    const token = jwt.sign(
      { user_id: user.user_id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "14d" }
    );

    res.json({
      success: true,
      message: "Warden login successful.",
      token,
      warden: {
        user_id: user.user_id,
        username: user.username,
        role: user.role,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error.",
    });
  }
};

// ================= MESS MANAGER LOGIN =================
const messManagerLogin = async (req, res) => {
  try {
    const { username, password } = req.body;

    const [users] = await db.execute(
      "SELECT * FROM USER WHERE username=?",
      [username]
    );

    if (users.length === 0 || users[0].role !== "MESS_MANAGER") {
      return res.status(401).json({
        success: false,
        message: "Invalid mess manager credentials.",
      });
    }

    const user = users[0];

    const isMatch = await bcrypt.compare(password, user.password_hash);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid mess manager credentials.",
      });
    }

    const token = jwt.sign(
      { user_id: user.user_id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "14d" }
    );

    res.json({
      success: true,
      message: "Mess Manager login successful.",
      token,
      manager: {
        user_id: user.user_id,
        username: user.username,
        role: user.role,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error.",
    });
  }
};

module.exports = {
  registerStudent,
  login,
  adminLogin,
  wardenLogin,
  messManagerLogin,
};