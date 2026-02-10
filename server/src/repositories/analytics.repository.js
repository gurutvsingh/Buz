const db = require("../config/db");

const getSummary = async (businessId) => {
  const [income] = await db.execute(
    `
    SELECT COALESCE(SUM(amount), 0) AS totalIncome
    FROM income
    WHERE business_id = ?
    `,
    [businessId]
  );

  const [expense] = await db.execute(
    `
    SELECT COALESCE(SUM(amount), 0) AS totalExpense
    FROM expenses
    WHERE business_id = ?
    `,
    [businessId]
  );

  const [customers] = await db.execute(
    `
    SELECT COUNT(*) AS totalCustomers
    FROM customers
    WHERE business_id = ?
    `,
    [businessId]
  );

  return {
    totalIncome: Number(income[0].totalIncome),
    totalExpense: Number(expense[0].totalExpense),
    totalCustomers: Number(customers[0].totalCustomers),
  };
};

const getMonthlyMovement = async (businessId) => {
  const [rows] = await db.execute(
    `
    SELECT
      month_label AS month,
      SUM(income) AS income,
      SUM(expense) AS expense,
      SUM(income) - SUM(expense) AS profit
    FROM (
      SELECT
        DATE_FORMAT(income_date, '%Y-%m') AS month_key,
        DATE_FORMAT(income_date, '%b') AS month_label,
        amount AS income,
        0 AS expense
      FROM income
      WHERE business_id = ?
      UNION ALL
      SELECT
        DATE_FORMAT(expense_date, '%Y-%m') AS month_key,
        DATE_FORMAT(expense_date, '%b') AS month_label,
        0 AS income,
        amount AS expense
      FROM expenses
      WHERE business_id = ?
    ) movement
    GROUP BY month_key, month_label
    ORDER BY month_key ASC
    `,
    [businessId, businessId]
  );

  return rows.map((row) => ({
    month: row.month,
    income: Number(row.income),
    expense: Number(row.expense),
    profit: Number(row.profit),
  }));
};

const getExpenseCategories = async (businessId) => {
  const [rows] = await db.execute(
    `
    SELECT COALESCE(category, 'Uncategorized') AS category,
           COALESCE(SUM(amount), 0) AS total
    FROM expenses
    WHERE business_id = ?
    GROUP BY category
    ORDER BY total DESC
    LIMIT 6
    `,
    [businessId]
  );

  return rows;
};

module.exports = {
  getSummary,
  getMonthlyMovement,
  getExpenseCategories,
};
