const express =
require("express");

const router =
express.Router();

const authMiddleware =
require(
 "../middlewares/auth.middleware"
);

const employeeController =
require(
 "../controllers/employee.controller"
);
const authorize =
require(
 "../middlewares/role.middleware"
);
const {
 verifyBusinessOwnership
} = require(
 "../middlewares/business.middleware"
);

router.get(
 "/:businessId",
 authMiddleware,
 verifyBusinessOwnership,
 employeeController.getEmployees
);

router.post(
 "/",
 authMiddleware,
  authorize("OWNER"),
 verifyBusinessOwnership,
 employeeController.createEmployee
);

router.put(
 "/:id",
 authMiddleware,
 authorize("OWNER"),
 verifyBusinessOwnership,
 employeeController.updateEmployee
);

router.delete(
 "/:id",
 authMiddleware,
 authorize("OWNER"),
 verifyBusinessOwnership,
 employeeController.deleteEmployee
);

module.exports = router;
