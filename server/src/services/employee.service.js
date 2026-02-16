const bcrypt =
require("bcryptjs");

const employeeRepository =
require(
 "../repositories/employee.repository"
);

const createEmployee =
async (data) => {

  const hashedPassword =
  await bcrypt.hash(
    data.password,
    10
  );

  const employee =
  await employeeRepository
    .createEmployee(
      data.name,
      data.email,
      hashedPassword
    );

  await employeeRepository
    .mapEmployeeToBusiness(
      employee.insertId,
      data.business_id
    );

  return employee;
};

const getEmployees = async (businessId) => {
  return await employeeRepository.getEmployees(businessId);
};

const updateEmployee = async (employeeId, data) => {
  return await employeeRepository.updateEmployee(
    employeeId,
    data.business_id,
    data.name,
    data.email
  );
};

const deleteEmployee = async (employeeId, businessId) => {
  return await employeeRepository.deleteEmployee(
    employeeId,
    businessId
  );
};

module.exports = {
 createEmployee,
 getEmployees,
 updateEmployee,
 deleteEmployee,
};
