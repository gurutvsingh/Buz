const reminderService = require(
  "../services/reminder.service"
);

const createReminder = async (
  req,
  res
) => {

  const result =
  await reminderService
    .createReminder(
      req.body
    );

  res.status(201).json({
    success: true,
    reminderId:
      result.insertId,
  });
};

const getReminders = async (
  req,
  res
) => {

  const data =
  await reminderService
    .getReminders(
      req.params.businessId
    );

  res.json({
    success: true,
    data,
  });
};

const updateReminder = async (
  req,
  res
) => {

  const result =
  await reminderService
    .updateReminder(
      req.params.id,
      req.body
    );

  res.json({
    success: true,
    affectedRows:
      result.affectedRows,
  });
};

const updateReminderStatus = async (
  req,
  res
) => {

  const result =
  await reminderService
    .updateReminderStatus(
      req.params.id,
      req.body
    );

  res.json({
    success: true,
    affectedRows:
      result.affectedRows,
  });
};

const deleteReminder = async (
  req,
  res
) => {

  const result =
  await reminderService
    .deleteReminder(
      req.params.id,
      req.body.business_id
    );

  res.json({
    success: true,
    affectedRows:
      result.affectedRows,
  });
};

module.exports = {
  createReminder,
  getReminders,
  updateReminder,
  updateReminderStatus,
  deleteReminder,
};
