const employeeService =
require(
 "../services/employee.service"
);

const createEmployee =
async (req,res) => {

 try {

  const result =
  await employeeService
    .createEmployee(
      req.body
    );

  res.status(201).json({
    success:true,
    employeeId:
      result.insertId,
  });

 } catch(error){

  res.status(500).json({
    success:false,
    message:error.message
  });

 }
};

const getEmployees =
async (req,res) => {

 try {

  const data =
  await employeeService
    .getEmployees(
      req.params.businessId
    );

  res.json({
    success:true,
    data,
  });

 } catch(error){

  res.status(500).json({
    success:false,
    message:error.message
  });

 }
};

const updateEmployee =
async (req,res) => {

 try {

  const result =
  await employeeService
    .updateEmployee(
      req.params.id,
      req.body
    );

  res.json({
    success:true,
    affectedRows:
      result.affectedRows,
  });

 } catch(error){

  res.status(500).json({
    success:false,
    message:error.message
  });

 }
};

const deleteEmployee =
async (req,res) => {

 try {

  const result =
  await employeeService
    .deleteEmployee(
      req.params.id,
      req.body.business_id
    );

  res.json({
    success:true,
    affectedRows:
      result.affectedRows,
  });

 } catch(error){

  res.status(500).json({
    success:false,
    message:error.message
  });

 }
};

module.exports = {
 createEmployee,
 getEmployees,
 updateEmployee,
 deleteEmployee,
};
