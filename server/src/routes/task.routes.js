const express =
require("express");

const router =
express.Router();

const authMiddleware =
require(
 "../middlewares/auth.middleware"
);

const taskController =
require(
 "../controllers/task.controller"
);

router.post(
 "/",
 authMiddleware,
 taskController.createTask
);

router.get(
 "/:checklistId",
 authMiddleware,
 taskController.getTasks
);

router.post(
 "/complete/:taskId",
 authMiddleware,
 taskController.completeTask
);

module.exports = router;