const express =
require("express");

const router =
express.Router();

const authMiddleware =
require(
 "../middlewares/auth.middleware"
);

const notificationController =
require(
 "../controllers/notification.controller"
);

router.post(
 "/",
 authMiddleware,
 notificationController
   .createNotification
);

router.get(
 "/me",
 authMiddleware,
 notificationController
   .getMyNotifications
);

router.patch(
 "/read-all",
 authMiddleware,
 notificationController
   .markAllNotificationsRead
);

router.patch(
 "/:id/read",
 authMiddleware,
 notificationController
   .markNotificationRead
);

router.delete(
 "/:id",
 authMiddleware,
 notificationController
   .deleteNotification
);

router.get(
 "/:userId",
 authMiddleware,
 notificationController
   .getNotifications
);

module.exports = router;
