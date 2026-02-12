const express = require("express");

const router = express.Router();

const authMiddleware = require("../middlewares/auth.middleware");
const analyticsController = require("../controllers/analytics.controller");

const {
  verifyBusinessOwnership,
} = require("../middlewares/business.middleware");

router.get(
  "/:businessId",
  authMiddleware,
  verifyBusinessOwnership,
  analyticsController.getRealAnalytics
);

module.exports = router;
