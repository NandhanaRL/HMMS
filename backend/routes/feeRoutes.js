const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const feeController = require("../controllers/feeController");

// ================= STUDENT =================

// Logged-in student's own fees
router.get(
  "/student",
  authMiddleware(["STUDENT"]),
  feeController.getStudentFees
);

// ================= WARDEN & MESS MANAGER =================

// View any student's fees
router.get(
  "/student/:id",
  authMiddleware(["WARDEN", "MESS_MANAGER"]),
  feeController.getStudentFees
);

// ================= PAY FEE =================

router.post(
  "/pay",
  authMiddleware(["WARDEN", "MESS_MANAGER"]),
  feeController.payFee
);

// ================= UPDATE FEE STATUS =================

router.put(
  "/:id",
  authMiddleware(["WARDEN", "MESS_MANAGER"]),
  feeController.updateFeeStatus
);

// ================= FEE REPORT =================

router.get(
  "/report",
  authMiddleware(["WARDEN", "MESS_MANAGER"]),
  feeController.getFeeReport
);

module.exports = router;