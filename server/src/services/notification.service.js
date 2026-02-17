const notificationRepository =
require(
 "../repositories/notification.repository"
);

const createNotification =
async (data) => {

  return await notificationRepository
    .createNotification(
      data.user_id,
      data.title,
      data.message
    );
};

const getNotifications =
async (userId) => {

  return await notificationRepository
    .getNotifications(
      userId
    );
};

const markNotificationRead =
async (id, userId) => {

  return await notificationRepository
    .markNotificationRead(
      id,
      userId
    );
};

const markAllNotificationsRead =
async (userId) => {

  return await notificationRepository
    .markAllNotificationsRead(
      userId
    );
};

const deleteNotification =
async (id, userId) => {

  return await notificationRepository
    .deleteNotification(
      id,
      userId
    );
};

module.exports = {
 createNotification,
 getNotifications,
 markNotificationRead,
 markAllNotificationsRead,
 deleteNotification,
};
