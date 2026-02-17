const { body } = require("express-validator");

const expenseValidation = [
  body("business_id")
    .notEmpty()
    .withMessage(
      "Business ID required"
    ),

  body("amount")
    .isFloat({ gt: 0 })
    .withMessage(
      "Amount must be greater than 0"
    ),

  body("expense_date")
    .notEmpty()
    .withMessage(
      "Expense date required"
    ),
];

module.exports = {
  expenseValidation,
};