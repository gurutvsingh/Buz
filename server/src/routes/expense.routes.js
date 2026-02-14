const express = require("express");

const router = express.Router();

const authMiddleware = require(
  "../middlewares/auth.middleware"
);

const expenseController = require(
  "../controllers/expense.controller"
);
const {
  expenseValidation,
} = require(
  "../validators/expense.validator"
);

const validate = require(
  "../middlewares/validate.middleware"
);

const {
 verifyBusinessOwnership
} = require(
 "../middlewares/business.middleware"
);
router.post(
  "/",
  authMiddleware,
  verifyBusinessOwnership,
  expenseValidation,
  validate,
  expenseController.createExpense
);
router.get(
  "/:businessId",
  authMiddleware,
  verifyBusinessOwnership,
  expenseController.getExpense
);

module.exports = router;