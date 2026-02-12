const db = require("../config/db");

const createTask = async (
  checklist_id,
  task_name
) => {

  const [result] =
  await db.execute(
    `
    INSERT INTO checklist_tasks
    (
      checklist_id,
      task_name
    )
    VALUES (?, ?)
    `,
    [
      checklist_id,
      task_name
    ]
  );

  return result;
};

const getTasks = async (
  checklistId
) => {

  const [rows] =
  await db.execute(
    `
    SELECT *
    FROM checklist_tasks
    WHERE checklist_id = ?
    `,
    [checklistId]
  );

  return rows;
};

const completeTask = async (
  taskId,
  userId
) => {

  const [result] =
  await db.execute(
    `
    INSERT INTO task_logs
    (
      task_id,
      completed_by,
      completed_at,
      status
    )
    VALUES
    (
      ?,
      ?,
      NOW(),
      'COMPLETED'
    )
    `,
    [
      taskId,
      userId
    ]
  );

  return result;
};

module.exports = {
  createTask,
  getTasks,
  completeTask,
};