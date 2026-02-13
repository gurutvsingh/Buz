const express = require("express");

const router = express.Router();

const authMiddleware =
require("../middlewares/auth.middleware");

const customerController =
require("../controllers/customer.controller");

const {
 verifyBusinessOwnership
} = require(
 "../middlewares/business.middleware"
);

router.post(
 "/",
 authMiddleware,
 verifyBusinessOwnership,
 customerController.createCustomer
);

router.get(
 "/:businessId",
 authMiddleware,
 verifyBusinessOwnership,
 customerController.getCustomers
);
router.get(
 "/single/:id",
 authMiddleware,
 customerController.getCustomer
);

router.put(
 "/:id",
 authMiddleware,
 customerController.updateCustomer
);

router.delete(
 "/:id",
 authMiddleware,
 customerController.deleteCustomer
);
module.exports = router;