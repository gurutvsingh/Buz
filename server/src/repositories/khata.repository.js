const db = require("../config/db");

const createLedgerEntry = async (
  customerId,
  entryType,
  amount,
  description,
  entryDate
) => {
  const [result] = await db.execute(
    `
    INSERT INTO ledger_entries
    (customer_id, entry_type, amount, description, entry_date)
    VALUES (?, ?, ?, ?, ?)
    `,
    [customerId, entryType, amount, description, entryDate]
  );

  return result;
};

const getCustomerLedger = async (customerId, userId) => {
  const [rows] = await db.execute(
    `
    SELECT le.*
    FROM ledger_entries le
    JOIN customers c ON c.id = le.customer_id
    JOIN businesses b ON b.id = c.business_id
    WHERE le.customer_id = ?
    AND b.owner_id = ?
    ORDER BY le.entry_date DESC, le.created_at DESC
    `,
    [customerId, userId]
  );

  return rows;
};

const updateLedgerEntry = async (
  id,
  businessId,
  customerId,
  entryType,
  amount,
  description,
  entryDate
) => {
  const [result] = await db.execute(
    `
    UPDATE ledger_entries le
    JOIN customers c ON c.id = le.customer_id
    SET le.customer_id = ?,
        le.entry_type = ?,
        le.amount = ?,
        le.description = ?,
        le.entry_date = ?
    WHERE le.id = ?
    AND c.business_id = ?
    `,
    [
      customerId,
      entryType,
      amount,
      description || null,
      entryDate,
      id,
      businessId
    ]
  );

  return result;
};

const deleteLedgerEntry = async (
  id,
  businessId
) => {
  const [result] = await db.execute(
    `
    DELETE le
    FROM ledger_entries le
    JOIN customers c ON c.id = le.customer_id
    WHERE le.id = ?
    AND c.business_id = ?
    `,
    [id, businessId]
  );

  return result;
};

const getBusinessKhataSummary = async (businessId) => {
  const [rows] = await db.execute(
    `
    SELECT
      c.id,
      c.name,
      c.phone,
      COALESCE(SUM(CASE WHEN le.entry_type = 'CREDIT' THEN le.amount ELSE 0 END), 0) AS credit,
      COALESCE(SUM(CASE WHEN le.entry_type = 'DEBIT' THEN le.amount ELSE 0 END), 0) AS debit,
      COALESCE(SUM(CASE WHEN le.entry_type = 'CREDIT' THEN le.amount ELSE -le.amount END), 0) AS balance
    FROM customers c
    LEFT JOIN ledger_entries le ON le.customer_id = c.id
    WHERE c.business_id = ?
    GROUP BY c.id, c.name, c.phone
    ORDER BY c.name ASC
    `,
    [businessId]
  );

  return rows;
};

const verifyCustomerInBusiness = async (customerId, businessId) => {
  const [rows] = await db.execute(
    `
    SELECT id
    FROM customers
    WHERE id = ?
    AND business_id = ?
    `,
    [customerId, businessId]
  );

  return rows.length > 0;
};

module.exports = {
  createLedgerEntry,
  getCustomerLedger,
  getBusinessKhataSummary,
  updateLedgerEntry,
  deleteLedgerEntry,
  verifyCustomerInBusiness,
};
