const express =
require("express");

const router =
express.Router();

const authMiddleware =
require(
 "../middlewares/auth.middleware"
);

const billItemController =
require(
 "../controllers/billItem.controller"
);

router.post(
 "/",
 authMiddleware,
 billItemController
  .createBillItem
);

router.get(
 "/:billId",
 authMiddleware,
 billItemController
  .getBillItems
);

module.exports = router;