const db = require("../config/db");
const bcrypt = require("bcrypt");

// ================= STUDENTS =================

const getStudents = async (req, res) => {
  try {
    const [students] = await db.execute(`
      SELECT
        s.student_id,
        s.roll_no,
        u.username,
        u.email,
        u.phone,
        s.department,
        s.year_of_study
      FROM STUDENT s
      JOIN USER u ON s.user_id=u.user_id
      ORDER BY u.username
    `);

    res.json({
      success: true,
      students,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: "Server error.",
    });
  }
};

// ================= GET WARDENS =================

const getWardens = async (req, res) => {
  try {
    const [wardens] = await db.execute(`
      SELECT
        w.warden_id,
        u.user_id,
        u.username,
        u.email,
        u.phone
      FROM WARDEN w
      JOIN USER u ON w.user_id=u.user_id
      ORDER BY u.username
    `);

    res.json({
      success: true,
      wardens,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: "Server error.",
    });
  }
};

// ================= CREATE WARDEN =================

const createWarden = async (req, res) => {
  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    const { username, email, phone, password } = req.body;

    const [exists] = await connection.execute(
      "SELECT user_id FROM USER WHERE email=?",
      [email]
    );

    if (exists.length > 0) {
      await connection.rollback();

      return res.status(400).json({
        success: false,
        message: "Email already exists.",
      });
    }

    const hash = await bcrypt.hash(password, 10);

    const [user] = await connection.execute(
      `
      INSERT INTO USER
      (username,email,password_hash,phone,role)
      VALUES (?,?,?,?, 'WARDEN')
      `,
      [username, email, hash, phone]
    );

    await connection.execute(
      `
      INSERT INTO WARDEN (user_id)
      VALUES (?)
      `,
      [user.insertId]
    );

    await connection.commit();

    res.status(201).json({
      success: true,
      message: "Warden created successfully.",
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

// ================= DELETE WARDEN =================

const deleteWarden = async (req, res) => {
  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    const { id } = req.params;

    const [warden] = await connection.execute(
      "SELECT user_id FROM WARDEN WHERE warden_id=?",
      [id]
    );

    if (warden.length === 0) {
      await connection.rollback();

      return res.status(404).json({
        success: false,
        message: "Warden not found.",
      });
    }

    const userId = warden[0].user_id;

    await connection.execute(
      "DELETE FROM WARDEN WHERE warden_id=?",
      [id]
    );

    await connection.execute(
      "DELETE FROM USER WHERE user_id=?",
      [userId]
    );

    await connection.commit();

    res.json({
      success: true,
      message: "Warden deleted successfully.",
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

// ================= GET MESS MANAGERS =================

const getMessManagers = async (req, res) => {
  try {
    const [managers] = await db.execute(`
      SELECT
        mm.manager_id,
        u.user_id,
        u.username,
        u.email,
        u.phone
      FROM MESS_MANAGER mm
      JOIN USER u ON mm.user_id=u.user_id
      ORDER BY u.username
    `);

    res.json({
      success: true,
      managers,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: "Server error.",
    });
  }
};

// ================= CREATE MESS MANAGER =================

const createMessManager = async (req, res) => {
  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    const { username, email, phone, password } = req.body;

    const [exists] = await connection.execute(
      "SELECT user_id FROM USER WHERE email=?",
      [email]
    );

    if (exists.length > 0) {
      await connection.rollback();

      return res.status(400).json({
        success: false,
        message: "Email already exists.",
      });
    }

    const hash = await bcrypt.hash(password, 10);

    const [user] = await connection.execute(
      `
      INSERT INTO USER
      (username,email,password_hash,phone,role)
      VALUES (?,?,?,?, 'MESS_MANAGER')
      `,
      [username, email, hash, phone]
    );

    await connection.execute(
      `
      INSERT INTO MESS_MANAGER (user_id)
      VALUES (?)
      `,
      [user.insertId]
    );

    await connection.commit();

    res.status(201).json({
      success: true,
      message: "Mess Manager created successfully.",
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

// ================= DELETE MESS MANAGER =================

const deleteMessManager = async (req, res) => {
  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    const { id } = req.params;

    const [manager] = await connection.execute(
      "SELECT user_id FROM MESS_MANAGER WHERE manager_id=?",
      [id]
    );

    if (manager.length === 0) {
      await connection.rollback();

      return res.status(404).json({
        success: false,
        message: "Mess Manager not found.",
      });
    }

    const userId = manager[0].user_id;

    await connection.execute(
      "DELETE FROM MESS_MANAGER WHERE manager_id=?",
      [id]
    );

    await connection.execute(
      "DELETE FROM USER WHERE user_id=?",
      [userId]
    );

    await connection.commit();

    res.json({
      success: true,
      message: "Mess Manager deleted successfully.",
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

// ================= UPDATE WARDEN =================

const updateWarden = async (req, res) => {
  try {
    const { id } = req.params;
    const { username, email, phone } = req.body;

    const [warden] = await db.execute(
      "SELECT user_id FROM WARDEN WHERE warden_id=?",
      [id]
    );

    if (warden.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Warden not found.",
      });
    }

    await db.execute(
      "UPDATE USER SET username=?, email=?, phone=? WHERE user_id=?",
      [username, email, phone, warden[0].user_id]
    );

    res.json({
      success: true,
      message: "Warden updated successfully.",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Server error.",
    });
  }
};

// ================= UPDATE MESS MANAGER =================

const updateMessManager = async (req, res) => {
  try {
    const { id } = req.params;
    const { username, email, phone } = req.body;

    const [manager] = await db.execute(
      "SELECT user_id FROM MESS_MANAGER WHERE manager_id=?",
      [id]
    );

    if (manager.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Mess Manager not found.",
      });
    }

    await db.execute(
      "UPDATE USER SET username=?, email=?, phone=? WHERE user_id=?",
      [username, email, phone, manager[0].user_id]
    );

    res.json({
      success: true,
      message: "Mess Manager updated successfully.",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Server error.",
    });
  }
};

module.exports = {
  getStudents,
  getWardens,
  createWarden,
  updateWarden,
  deleteWarden,
  getMessManagers,
  createMessManager,
  updateMessManager,
  deleteMessManager,
};