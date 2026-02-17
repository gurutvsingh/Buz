const taskRepository =
require(
 "../repositories/task.repository"
);

const createTask =
async (data) => {

  return await taskRepository
    .createTask(
      data.checklist_id,
      data.task_name
    );
};

const getTasks =
async (checklistId) => {

  return await taskRepository
    .getTasks(
      checklistId
    );
};

const completeTask =
async (
 taskId,
 userId
) => {

 return await taskRepository
  .completeTask(
    taskId,
    userId
  );
};

module.exports = {
 createTask,
 getTasks,
 completeTask,
};