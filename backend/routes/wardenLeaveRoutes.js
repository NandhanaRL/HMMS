const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
    getAllLeaves,
    updateLeaveStatus
} = require("../controllers/wardenLeaveController");

// View all leave applications
router.get(
    "/leaves",
    authMiddleware(["WARDEN"]),
    getAllLeaves
);

// Approve or Reject leave
router.put(
    "/leaves/:id",
    authMiddleware(["WARDEN"]),
    updateLeaveStatus
);

module.exports = router;