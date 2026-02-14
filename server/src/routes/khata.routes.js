const express = require("express");

const router = express.Router();

const authMiddleware = require("../middlewares/auth.middleware");
const khataController = require("../controllers/khata.controller");

const {
  verifyBusinessOwnership,
} = require("../middlewares/business.middleware");

router.post(
  "/",
  authMiddleware,
  verifyBusinessOwnership,
  khataController.createLedgerEntry
);

router.get(
  "/business/:businessId",
  authMiddleware,
  verifyBusinessOwnership,
  khataController.getBusinessKhataSummary
);

router.get(
  "/customer/:customerId",
  authMiddleware,
  khataController.getCustomerLedger
);

router.put(
  "/:id",
  authMiddleware,
  verifyBusinessOwnership,
  khataController.updateLedgerEntry
);

router.delete(
  "/:id",
  authMiddleware,
  verifyBusinessOwnership,
  khataController.deleteLedgerEntry
);

module.exports = router;
