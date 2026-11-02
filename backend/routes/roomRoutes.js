const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const roomController = require("../controllers/roomController");

// ================= STUDENT =================

router.get(
  "/my-room",
  authMiddleware(["STUDENT"]),
  roomController.getMyRoom
);

// ================= WARDEN =================

router.get(
  "/",
  authMiddleware(["WARDEN", "ADMIN"]),
  roomController.getAllRooms
);

router.get(
  "/available",
  authMiddleware(["WARDEN"]),
  roomController.getAvailableRooms
);

router.post(
  "/allocate",
  authMiddleware(["WARDEN"]),
  roomController.allocateRoom
);

router.put(
  "/:id",
  authMiddleware(["WARDEN"]),
  roomController.updateRoom
);

router.get(
  "/student/:id",
  authMiddleware(["WARDEN"]),
  roomController.getStudentRoom
);

// ================= ADMIN =================

router.post(
  "/",
  authMiddleware(["ADMIN"]),
  roomController.addRoom
);

router.delete(
  "/:id",
  authMiddleware(["ADMIN"]),
  roomController.deleteRoom
);

module.exports = router;