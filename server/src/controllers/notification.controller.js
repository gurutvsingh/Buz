const notificationService =
require(
 "../services/notification.service"
);

const createNotification =
async (req,res) => {

 try {

  const result =
  await notificationService
    .createNotification(
      req.body
    );

  res.status(201).json({
    success:true,
    notificationId:
      result.insertId,
  });

 } catch(error){

  res.status(500).json({
    success:false,
    message:error.message,
  });

 }
};

const getNotifications =
async (req,res) => {

 try {

  const data =
  await notificationService
    .getNotifications(
      req.params.userId
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

const getMyNotifications =
async (req,res) => {

 try {

  const data =
  await notificationService
    .getNotifications(
      req.user.id
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

const markNotificationRead =
async (req,res) => {

 try {

  const result =
  await notificationService
    .markNotificationRead(
      req.params.id,
      req.user.id
    );

  res.json({
    success:true,
    affectedRows:
      result.affectedRows,
  });

 } catch(error){

  res.status(500).json({
    success:false,
    message:error.message,
  });

 }
};

const markAllNotificationsRead =
async (req,res) => {

 try {

  const result =
  await notificationService
    .markAllNotificationsRead(
      req.user.id
    );

  res.json({
    success:true,
    affectedRows:
      result.affectedRows,
  });

 } catch(error){

  res.status(500).json({
    success:false,
    message:error.message,
  });

 }
};

const deleteNotification =
async (req,res) => {

 try {

  const result =
  await notificationService
    .deleteNotification(
      req.params.id,
      req.user.id
    );

  res.json({
    success:true,
    affectedRows:
      result.affectedRows,
  });

 } catch(error){

  res.status(500).json({
    success:false,
    message:error.message,
  });

 }
};

module.exports = {
 createNotification,
 getNotifications,
 getMyNotifications,
 markNotificationRead,
 markAllNotificationsRead,
 deleteNotification,
};
