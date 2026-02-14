const express = require("express");

const router = express.Router();

const authMiddleware = require(
  "../middlewares/auth.middleware"
);

const incomeController = require(
  "../controllers/income.controller"
);
const {
  incomeValidation,
} = require(
  "../validators/income.validator"
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
incomeValidation,
validate,
  incomeController.createIncome
);


router.get(
 "/:businessId",
 authMiddleware,
 verifyBusinessOwnership,
 incomeController.getIncome
);

module.exports = router;