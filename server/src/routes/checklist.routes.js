const express =
require("express");

const router =
express.Router();

const authMiddleware =
require(
 "../middlewares/auth.middleware"
);

const checklistController =
require(
 "../controllers/checklist.controller"
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
 checklistController.createChecklist
);
router.get(
 "/:businessId",
 authMiddleware,
 verifyBusinessOwnership,
 checklistController.getChecklists
);

module.exports = router;