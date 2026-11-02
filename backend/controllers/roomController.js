const db = require("../config/db");

// ================= GET ALL ROOMS =================

const getAllRooms = async (req, res) => {
  try {
    const [rooms] = await db.query(`
      SELECT
        room_id,
        room_number,
        capacity,
        occupied_count,
        room_type,
        status
      FROM ROOM
      ORDER BY room_number
    `);

    res.json({
      success: true,
      rooms,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Server error.",
    });
  }
};

// ================= ADD ROOM (ADMIN) =================

const addRoom = async (req, res) => {
  try {
    const { room_number, room_type, capacity } = req.body;

    if (!room_number || !room_type || !capacity) {
      return res.status(400).json({
        success: false,
        message: "All fields are required.",
      });
    }

    const [exists] = await db.query(
      "SELECT room_id FROM ROOM WHERE room_number=?",
      [room_number]
    );

    if (exists.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Room already exists.",
      });
    }

    await db.query(
      `
      INSERT INTO ROOM
      (room_number, room_type, capacity, occupied_count, status)
      VALUES (?, ?, ?, 0, 'AVAILABLE')
      `,
      [room_number, room_type, capacity]
    );

    res.status(201).json({
      success: true,
      message: "Room added successfully.",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Server error.",
    });
  }
};

// ================= DELETE ROOM (ADMIN) =================

const deleteRoom = async (req, res) => {
  try {
    const { id } = req.params;

    const [room] = await db.query(
      `
      SELECT occupied_count
      FROM ROOM
      WHERE room_id=?
      `,
      [id]
    );

    if (room.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Room not found.",
      });
    }

    if (room[0].occupied_count > 0) {
      return res.status(400).json({
        success: false,
        message: "Cannot delete an occupied room.",
      });
    }

    await db.query(
      "DELETE FROM ROOM WHERE room_id=?",
      [id]
    );

    res.json({
      success: true,
      message: "Room deleted successfully.",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Server error.",
    });
  }
};

// ================= AVAILABLE ROOMS =================

const getAvailableRooms = async (req, res) => {
  try {
    const [rooms] = await db.query(`
      SELECT
        room_id,
        room_number,
        capacity,
        occupied_count,
        room_type
      FROM ROOM
      WHERE occupied_count < capacity
      ORDER BY room_number
    `);

    res.json({
      success: true,
      rooms,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Server error.",
    });
  }
};

// ================= STUDENT'S ROOM =================

const getMyRoom = async (req, res) => {
  try {
    const [rows] = await db.query(
      `
      SELECT
        r.room_number,
        r.room_type,
        r.capacity,
        r.occupied_count,
        r.status,
        ra.allocation_date
      FROM STUDENT s
      JOIN ROOM_ALLOCATION ra
        ON s.student_id=ra.student_id
      JOIN ROOM r
        ON ra.room_id=r.room_id
      WHERE s.user_id=?
        AND ra.status='APPROVED'
      ORDER BY ra.allocation_date DESC
      LIMIT 1
      `,
      [req.user.user_id]
    );

    res.json({
      success: true,
      room: rows[0] || null,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Server error.",
    });
  }
};

// ================= ALLOCATE ROOM =================

const allocateRoom = async (req, res) => {
  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    const { student_id, room_id } = req.body;

    if (!student_id || !room_id) {
      await connection.rollback();

      return res.status(400).json({
        success: false,
        message: "student_id and room_id are required.",
      });
    }

    const [wardenRows] = await connection.query(
      `
      SELECT warden_id
      FROM WARDEN
      WHERE user_id=?
      `,
      [req.user.user_id]
    );

    if (wardenRows.length === 0) {
      await connection.rollback();

      return res.status(404).json({
        success: false,
        message: "Warden not found.",
      });
    }

    const wardenId = wardenRows[0].warden_id;

    const [existing] = await connection.query(
      `
      SELECT allocation_id
      FROM ROOM_ALLOCATION
      WHERE student_id=?
        AND status='APPROVED'
      `,
      [student_id]
    );

    if (existing.length > 0) {
      await connection.rollback();

      return res.status(400).json({
        success: false,
        message: "Student already has a room.",
      });
    }

    const [room] = await connection.query(
      `
      SELECT capacity, occupied_count
      FROM ROOM
      WHERE room_id=?
      FOR UPDATE
      `,
      [room_id]
    );

    if (room.length === 0) {
      await connection.rollback();

      return res.status(404).json({
        success: false,
        message: "Room not found.",
      });
    }

    if (room[0].occupied_count >= room[0].capacity) {
      await connection.rollback();

      return res.status(400).json({
        success: false,
        message: "Room is already full.",
      });
    }

    await connection.query(
      `
      INSERT INTO ROOM_ALLOCATION
      (student_id, room_id, approved_by, status)
      VALUES (?, ?, ?, 'APPROVED')
      `,
      [student_id, room_id, wardenId]
    );

    const occupied = room[0].occupied_count + 1;
    const status = occupied >= room[0].capacity ? "FULL" : "AVAILABLE";

    await connection.query(
      `
      UPDATE ROOM
      SET occupied_count=?, status=?
      WHERE room_id=?
      `,
      [occupied, status, room_id]
    );

    await connection.commit();

    res.json({
      success: true,
      message: "Room allocated successfully.",
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

// ================= UPDATE ROOM STATUS =================

const updateRoom = async (req, res) => {
  try {
    const { status } = req.body;

    await db.query(
      `
      UPDATE ROOM
      SET status=?
      WHERE room_id=?
      `,
      [status, req.params.id]
    );

    res.json({
      success: true,
      message: "Room updated successfully.",
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: "Server error.",
    });
  }
};

// ================= STUDENT ROOM BY ID =================

const getStudentRoom = async (req, res) => {
  try {
    const [rows] = await db.query(
      `
      SELECT
        r.room_number,
        r.room_type,
        ra.allocation_date,
        ra.status
      FROM ROOM_ALLOCATION ra
      JOIN ROOM r
        ON ra.room_id=r.room_id
      WHERE ra.student_id=?
      ORDER BY ra.allocation_date DESC
      LIMIT 1
      `,
      [req.params.id]
    );

    res.json({
      success: true,
      room: rows[0] || null,
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
  getAllRooms,
  addRoom,
  deleteRoom,
  getAvailableRooms,
  getMyRoom,
  allocateRoom,
  updateRoom,
  getStudentRoom,
};