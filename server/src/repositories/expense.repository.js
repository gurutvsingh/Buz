const db = require("../config/db");

const createExpense = async (
  business_id,
  amount,
  category,
  description,
  expense_date
) => {
  const [result] = await db.execute(
    `
    INSERT INTO expenses
    (
      business_id,
      amount,
      category,
      description,
      expense_date
    )
    VALUES (?, ?, ?, ?, ?)
    `,
    [
      business_id,
      amount,
      category,
      description,
      expense_date,
    ]
  );

  return result;
};

const getExpenseByBusiness = async (
  businessId
) => {
  const [rows] = await db.execute(
    `
    SELECT *
    FROM expenses
    WHERE business_id = ?
    ORDER BY expense_date DESC
    `,
    [businessId]
  );

  return rows;
};

module.exports = {
  createExpense,
  getExpenseByBusiness,
};