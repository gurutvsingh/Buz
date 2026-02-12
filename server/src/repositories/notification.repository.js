const db = require("../config/db");

const createNotification = async (
  user_id,
  title,
  message
) => {

  const [result] =
  await db.execute(
    `
    INSERT INTO notifications
    (
      user_id,
      title,
      message
    )
    VALUES (?, ?, ?)
    `,
    [
      user_id,
      title,
      message
    ]
  );

  return result;
};

const getNotifications =
async (userId) => {

  const [rows] =
  await db.execute(
    `
    SELECT *
    FROM notifications
    WHERE user_id = ?
    ORDER BY created_at DESC
    `,
    [userId]
  );

  return rows;
};

const markNotificationRead =
async (id, userId) => {

  const [result] =
  await db.execute(
    `
    UPDATE notifications
    SET is_read = TRUE
    WHERE id = ?
    AND user_id = ?
    `,
    [id, userId]
  );

  return result;
};

const markAllNotificationsRead =
async (userId) => {

  const [result] =
  await db.execute(
    `
    UPDATE notifications
    SET is_read = TRUE
    WHERE user_id = ?
    `,
    [userId]
  );

  return result;
};

const deleteNotification =
async (id, userId) => {

  const [result] =
  await db.execute(
    `
    DELETE FROM notifications
    WHERE id = ?
    AND user_id = ?
    `,
    [id, userId]
  );

  return result;
};

module.exports = {
  createNotification,
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  deleteNotification,
};
