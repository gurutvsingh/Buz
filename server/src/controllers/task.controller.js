const taskService =
require(
 "../services/task.service"
);

const createTask =
async (req,res) => {

 try {

  const result =
  await taskService
    .createTask(
      req.body
    );

  res.status(201).json({
    success:true,
    taskId:
      result.insertId,
  });

 } catch(error){

  res.status(500).json({
    success:false,
    message:error.message,
  });

 }
};

const getTasks =
async (req,res) => {

 try {

  const data =
  await taskService
    .getTasks(
      req.params.checklistId
    );

  res.json({
    success:true,
    data,
  });

 } catch(error){

  res.status(500).json({
    success:false,
    message:error.message,
  });

 }
};

const completeTask =
async (req,res) => {

 try {

  await taskService
    .completeTask(
      req.params.taskId,
      req.user.id
    );

  res.json({
    success:true,
    message:
    "Task completed",
  });

 } catch(error){

  res.status(500).json({
    success:false,
    message:error.message,
  });

 }
};

module.exports = {
 createTask,
 getTasks,
 completeTask,
};