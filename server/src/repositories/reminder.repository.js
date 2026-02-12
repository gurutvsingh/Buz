const db = require("../config/db");

const createReminder = async (
  business_id,
  title,
  description,
  due_date,
  priority,
  amount
) => {

  const [result] =
  await db.execute(
    `
    INSERT INTO reminders
    (
      business_id,
      title,
      description,
      due_date,
      priority,
      amount
    )
    VALUES (?, ?, ?, ?, ?, ?)
    `,
    [
      business_id,
      title,
      description,
      due_date,
      priority,
      amount,
    ]
  );

  return result;
};

const getReminders = async (
  businessId
) => {

  const [rows] =
  await db.execute(
    `
    SELECT *
    FROM reminders
    WHERE business_id = ?
    ORDER BY due_date ASC
    `,
    [businessId]
  );

  return rows;
};

const updateReminder = async (
  id,
  businessId,
  title,
  description,
  dueDate,
  priority,
  amount,
  status
) => {
  const [result] = await db.execute(
    `
    UPDATE reminders
    SET title = ?,
        description = ?,
        due_date = ?,
        priority = ?,
        amount = ?,
        status = ?
    WHERE id = ?
    AND business_id = ?
    `,
    [
      title,
      description || null,
      dueDate,
      priority || "MEDIUM",
      amount || null,
      status || "PENDING",
      id,
      businessId
    ]
  );

  return result;
};

const updateReminderStatus = async (
  id,
  businessId,
  status
) => {
  const [result] = await db.execute(
    `
    UPDATE reminders
    SET status = ?
    WHERE id = ?
    AND business_id = ?
    `,
    [status, id, businessId]
  );

  return result;
};

const deleteReminder = async (
  id,
  businessId
) => {
  const [result] = await db.execute(
    `
    DELETE FROM reminders
    WHERE id = ?
    AND business_id = ?
    `,
    [id, businessId]
  );

  return result;
};

module.exports = {
  createReminder,
  getReminders,
  updateReminder,
  updateReminderStatus,
  deleteReminder,
};
