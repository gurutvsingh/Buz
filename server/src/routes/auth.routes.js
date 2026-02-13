const express = require("express");

const router = express.Router();

const authController =
  require("../controllers/auth.controller");

const authMiddleware =
  require("../middlewares/auth.middleware");
const {
  registerValidation,
  loginValidation,
} = require(
  "../validators/auth.validator"
);

const validate = require(
  "../middlewares/validate.middleware"
);
router.post(
  "/register",
  registerValidation,
  validate,
  authController.register
);

router.post(
  "/login",
  loginValidation,
  validate,
  authController.login
);

router.get(
  "/profile",
  authMiddleware,
  authController.getProfile
);

module.exports = router;