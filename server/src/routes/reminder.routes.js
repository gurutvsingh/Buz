const express = require("express");

const router = express.Router();

const authMiddleware =
require("../middlewares/auth.middleware");

const reminderController =
require("../controllers/reminder.controller");


const {
 verifyBusinessOwnership
} = require(
 "../middlewares/business.middleware"
);
router.post(
 "/",
 authMiddleware,
 verifyBusinessOwnership,
 reminderController.createReminder
);
router.get(
  "/:businessId",
  authMiddleware,
   verifyBusinessOwnership,
  reminderController.getReminders
);

router.put(
  "/:id",
  authMiddleware,
  verifyBusinessOwnership,
  reminderController.updateReminder
);

router.patch(
  "/:id/status",
  authMiddleware,
  verifyBusinessOwnership,
  reminderController.updateReminderStatus
);

router.delete(
  "/:id",
  authMiddleware,
  verifyBusinessOwnership,
  reminderController.deleteReminder
);

module.exports = router;
