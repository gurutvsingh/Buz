const db = require("../config/db");

const createBill = async (
  business_id,
  customer_id,
  bill_number,
  total_amount,
  bill_date,
  items = []
) => {

  const connection =
    await db.getConnection();

  try {

    await connection.beginTransaction();

    const finalTotal =
      items.reduce(
        (sum, item) =>
          sum +
          Number(item.quantity || 0) *
          Number(item.price || 0),
        0
      );

    const [result] =
      await connection.execute(
        `
        INSERT INTO bills
        (
          business_id,
          customer_id,
          bill_number,
          total_amount,
          bill_date
        )
        VALUES (?, ?, ?, ?, ?)
        `,
        [
          business_id,
          customer_id || null,
          bill_number,
          finalTotal,
          bill_date
        ]
      );

    for (const item of items) {

      const quantity =
        Number(item.quantity || 0);

      const price =
        Number(item.price || 0);

      const subtotal =
        quantity * price;

      await connection.execute(
        `
        INSERT INTO bill_items
        (
          bill_id,
          item_name,
          quantity,
          price,
          subtotal,
          unit,
          item_source,
          inventory_item_id
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `,
        [
          result.insertId,
          item.item_name,
          quantity,
          price,
          subtotal,
          item.unit || "pcs",
          item.item_source || "CUSTOM",
          item.inventory_item_id || null
        ]
      );

      if (
        item.item_source ===
        "INVENTORY" &&
        item.inventory_item_id
      ) {

        const [stockRows] =
          await connection.execute(
            `
            SELECT quantity
            FROM inventory_items
            WHERE id = ?
            `,
            [item.inventory_item_id]
          );

        if (
          stockRows.length === 0
        ) {
          throw new Error(
            "Inventory item not found"
          );
        }

        const currentStock =
          Number(
            stockRows[0].quantity
          );

        if (
          currentStock < quantity
        ) {
          throw new Error(
            `${item.item_name} stock not available`
          );
        }

        await connection.execute(
          `
          UPDATE inventory_items
          SET quantity =
          quantity - ?
          WHERE id = ?
          `,
          [
            quantity,
            item.inventory_item_id
          ]
        );
      }
    }

    await connection.commit();

    return result;

  } catch (error) {

    await connection.rollback();

    throw error;

  } finally {

    connection.release();

  }
};

const getBills = async (
  businessId
) => {

  const [rows] =
    await db.execute(
      `
      SELECT
      b.*,
      c.name AS customer_name
      FROM bills b
      LEFT JOIN customers c
      ON c.id = b.customer_id
      WHERE b.business_id = ?
      ORDER BY b.bill_date DESC
      `,
      [businessId]
    );

  return rows;
};
const getInventoryForBilling =
async (businessId) => {

  const [rows] =
    await db.execute(
      `
      SELECT
      id,
      name,
      quantity,
      unit,
      selling_price
      FROM inventory_items
      WHERE business_id = ?
      ORDER BY name ASC
      `,
      [businessId]
    );

  return rows;
};
const getBillById = async (
  id,
  businessId
) => {

  const [rows] =
  await db.execute(
    `
    SELECT *
    FROM bills
    WHERE id = ?
    AND business_id = ?
    `,
    [
      id,
      businessId
    ]
  );

  return rows[0] || null;
};

const updateBill = async (
  id,
  businessId,
  customerId,
  billNumber,
  totalAmount,
  billDate
) => {

  const [result] =
  await db.execute(
    `
    UPDATE bills
    SET customer_id = ?,
        bill_number = ?,
        total_amount = ?,
        bill_date = ?
    WHERE id = ?
    AND business_id = ?
    `,
    [
      customerId || null,
      billNumber,
      totalAmount,
      billDate,
      id,
      businessId
    ]
  );

  return result;
};

const deleteBill = async (
  id,
  businessId
) => {

  const [result] =
  await db.execute(
    `
    DELETE FROM bills
    WHERE id = ?
    AND business_id = ?
    `,
    [
      id,
      businessId
    ]
  );

  return result;
};
module.exports = {
  createBill,
  getBills,
  getInventoryForBilling,
  getBillById,
  updateBill,
  deleteBill,
};
