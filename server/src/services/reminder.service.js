const reminderRepository = require(
  "../repositories/reminder.repository"
);

const createReminder = async (
  data
) => {

  return await reminderRepository
    .createReminder(
      data.business_id,
      data.title,
      data.description,
      data.due_date,
      data.priority,
      data.amount
    );
};

const getReminders = async (
  businessId
) => {

  return await reminderRepository
    .getReminders(
      businessId
    );
};

const updateReminder = async (
  reminderId,
  data
) => {

  return await reminderRepository
    .updateReminder(
      reminderId,
      data.business_id,
      data.title,
      data.description,
      data.due_date,
      data.priority,
      data.amount,
      data.status
    );
};

const updateReminderStatus = async (
  reminderId,
  data
) => {

  return await reminderRepository
    .updateReminderStatus(
      reminderId,
      data.business_id,
      data.status
    );
};

const deleteReminder = async (
  reminderId,
  businessId
) => {

  return await reminderRepository
    .deleteReminder(
      reminderId,
      businessId
    );
};

module.exports = {
  createReminder,
  getReminders,
  updateReminder,
  updateReminderStatus,
  deleteReminder,
};
