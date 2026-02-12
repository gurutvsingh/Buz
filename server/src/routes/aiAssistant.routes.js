const express = require("express");

const router = express.Router();

const authMiddleware = require("../middlewares/auth.middleware");
const aiAssistantController = require("../controllers/aiAssistant.controller");

const {
  verifyBusinessOwnership,
} = require("../middlewares/business.middleware");

router.get(
  "/:businessId/suggestions",
  authMiddleware,
  verifyBusinessOwnership,
  aiAssistantController.getSuggestions
);

router.post(
  "/:businessId/ask",
  authMiddleware,
  verifyBusinessOwnership,
  aiAssistantController.askAssistant
);

module.exports = router;
