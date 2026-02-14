const express = require("express");

const router = express.Router();

const authMiddleware =
require("../middlewares/auth.middleware");

const dashboardController =
require("../controllers/dashboard.controller");
const {
 verifyBusinessOwnership
} = require(
 "../middlewares/business.middleware"
);
router.get(
  "/:businessId",
  authMiddleware,
  verifyBusinessOwnership,
  dashboardController.getDashboard
);

module.exports = router;