const db = require("../config/db");

const createEmployee = async (
  name,
  email,
  passwordHash
) => {

  const [result] =
  await db.execute(
    `
    INSERT INTO users
    (
      name,
      email,
      password_hash,
      role
    )
    VALUES (?, ?, ?, 'EMPLOYEE')
    `,
    [
      name,
      email,
      passwordHash
    ]
  );

  return result;
};

const mapEmployeeToBusiness =
async (
  employeeId,
  businessId
) => {

  const [result] =
  await db.execute(
    `
    INSERT INTO employee_business
    (
      employee_id,
      business_id
    )
    VALUES (?, ?)
    `,
    [
      employeeId,
      businessId
    ]
  );

  return result;
};

const getEmployees = async (businessId) => {
  const [rows] = await db.execute(
    `
    SELECT
      u.id,
      u.name,
      u.email,
      u.role,
      u.created_at
    FROM employee_business eb
    JOIN users u ON u.id = eb.employee_id
    WHERE eb.business_id = ?
    ORDER BY u.created_at DESC
    `,
    [businessId]
  );

  return rows;
};

const updateEmployee = async (
  employeeId,
  businessId,
  name,
  email
) => {
  const [result] = await db.execute(
    `
    UPDATE users u
    JOIN employee_business eb ON eb.employee_id = u.id
    SET u.name = ?,
        u.email = ?
    WHERE u.id = ?
    AND eb.business_id = ?
    AND u.role = 'EMPLOYEE'
    `,
    [name, email, employeeId, businessId]
  );

  return result;
};

const deleteEmployee = async (
  employeeId,
  businessId
) => {
  const [mapping] = await db.execute(
    `
    DELETE FROM employee_business
    WHERE employee_id = ?
    AND business_id = ?
    `,
    [employeeId, businessId]
  );

  if (mapping.affectedRows > 0) {
    await db.execute(
      `
      DELETE FROM users
      WHERE id = ?
      AND role = 'EMPLOYEE'
      `,
      [employeeId]
    );
  }

  return mapping;
};

module.exports = {
  createEmployee,
  mapEmployeeToBusiness,
  getEmployees,
  updateEmployee,
  deleteEmployee,
};
