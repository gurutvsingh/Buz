const express =
require("express");

const router =
express.Router();

const authMiddleware =
require(
 "../middlewares/auth.middleware"
);

const billController =
require(
 "../controllers/bill.controller"
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
 billController.createBill
);
router.get(
 "/inventory/:businessId",
 authMiddleware,
 verifyBusinessOwnership,
 billController.getInventoryForBilling
);
router.get(
 "/:businessId",
 authMiddleware,
 verifyBusinessOwnership,
 billController.getBills
);

router.get(
 "/:businessId/:id",
 authMiddleware,
 verifyBusinessOwnership,
 billController.getBillById
);

router.put(
 "/:id",
 authMiddleware,
 verifyBusinessOwnership,
 billController.updateBill
);

router.delete(
 "/:id",
 authMiddleware,
 verifyBusinessOwnership,
 billController.deleteBill
);

module.exports = router;
