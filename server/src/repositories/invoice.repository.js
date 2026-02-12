const db = require("../config/db");

const getInvoicePdfData = async (billId, userId) => {
  const [billRows] = await db.execute(
    `
    SELECT
      b.*,
      bus.name AS business_name,
      bus.business_type,
      c.name AS customer_name,
      c.phone AS customer_phone,
      c.address AS customer_address
    FROM bills b
    JOIN businesses bus ON bus.id = b.business_id
    LEFT JOIN customers c ON c.id = b.customer_id
    WHERE b.id = ?
    AND bus.owner_id = ?
    `,
    [billId, userId]
  );

  const [items] = await db.execute(
    `
    SELECT *
    FROM bill_items
    WHERE bill_id = ?
    ORDER BY id ASC
    `,
    [billId]
  );

  return {
    bill: billRows[0] || null,
    items,
  };
};

module.exports = {
  getInvoicePdfData,
};
