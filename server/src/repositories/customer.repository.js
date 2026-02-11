const db = require("../config/db");

const createCustomer =
async (customerData) => {

  const {
    business_id,
    name,
    phone,
    address,
  } = customerData;

  const [result] =
    await db.execute(
      `
      INSERT INTO customers
      (
        business_id,
        name,
        phone,
        address
      )
      VALUES (?, ?, ?, ?)
      `,
      [
        business_id,
        name,
        phone,
        address,
      ]
    );

  return result;
};

const getCustomers =
async (businessId) => {

  const [rows] =
    await db.execute(
      `
      SELECT *
      FROM customers
      WHERE business_id = ?
      ORDER BY id DESC
      `,
      [businessId]
    );

  return rows;
};
const getCustomerById = async (id) => {

  const [rows] =
    await db.execute(
      `
      SELECT *
      FROM customers
      WHERE id = ?
      `,
      [id]
    );

  return rows[0];

};

const updateCustomer =
async (id, data) => {

  const {
    name,
    phone,
    address,
  } = data;

  const [result] =
    await db.execute(
      `
      UPDATE customers
      SET
      name = ?,
      phone = ?,
      address = ?
      WHERE id = ?
      `,
      [
        name,
        phone,
        address,
        id,
      ]
    );

  return result;

};

const deleteCustomer =
async (id) => {

  const [result] =
    await db.execute(
      `
      DELETE FROM customers
      WHERE id = ?
      `,
      [id]
    );

  return result;

};
module.exports = {
  createCustomer,
  getCustomers,
  deleteCustomer,
  updateCustomer,
  getCustomerById,
};