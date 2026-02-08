const checklistService =
require(
 "../services/checklist.service"
);

const createChecklist =
async (req,res) => {

 try {

  const result =
  await checklistService
    .createChecklist(
      req.body
    );

  res.status(201).json({
    success:true,
    checklistId:
      result.insertId,
  });

 } catch(error){

  res.status(500).json({
    success:false,
    message:error.message,
  });

 }
};

const getChecklists =
async (req,res) => {

 try {

  const data =
  await checklistService
    .getChecklists(
      req.params.businessId
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

module.exports = {
 createChecklist,
 getChecklists,
};