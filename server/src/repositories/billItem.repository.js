const db = require("../config/db");

const createBillItem = async (
  bill_id,
  item_name,
  quantity,
  price,
  subtotal
) => {

  const [result] =
  await db.execute(
    `
    INSERT INTO bill_items
    (
      bill_id,
      item_name,
      quantity,
      price,
      subtotal
    )
    VALUES (?, ?, ?, ?, ?)
    `,
    [
      bill_id,
      item_name,
      quantity,
      price,
      subtotal
    ]
  );

  return result;
};

const getBillItems = async (
  billId
) => {

  const [rows] =
  await db.execute(
    `
    SELECT *
    FROM bill_items
    WHERE bill_id = ?
    `,
    [billId]
  );

  return rows;
};

module.exports = {
  createBillItem,
  getBillItems,
};