const { body } = require("express-validator");

const businessValidation = [
  body("name")
    .notEmpty()
    .withMessage(
      "Business name is required"
    ),
];

module.exports = {
  businessValidation,
};