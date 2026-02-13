const express = require("express");

const router = express.Router();

const businessController = require(
  "../controllers/business.controller"
);
const {
  businessValidation,
} = require(
  "../validators/business.validator"
);

const validate = require(
  "../middlewares/validate.middleware"
);

const authMiddleware = require(
  "../middlewares/auth.middleware"
);
const authorize =
require(
 "../middlewares/role.middleware"
);
router.post(
  "/",
  authMiddleware,
  authorize("OWNER"),
  businessValidation,
  validate,
  businessController.createBusiness
);
router.get(
  "/",
  authMiddleware,
  businessController.getBusinesses
);
router.get(
  "/:id",
  authMiddleware,
  businessController.getBusiness
);

router.put(
  "/:id",
  authMiddleware,
  businessController.updateBusiness
);

router.delete(
  "/:id",
  authMiddleware,
  businessController.deleteBusiness
);

module.exports = router;