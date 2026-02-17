const { body } = require("express-validator");

const incomeValidation = [
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

  body("income_date")
    .notEmpty()
    .withMessage(
      "Income date required"
    ),
];

module.exports = {
  incomeValidation,
};