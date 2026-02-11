const db = require("../config/db");

const getDashboardStats = async (
  businessId
) => {

  const [income] = await db.execute(
    `
    SELECT
    COALESCE(SUM(amount),0)
    AS totalIncome
    FROM income
    WHERE business_id = ?
    `,
    [businessId]
  );

  const [expense] = await db.execute(
    `
    SELECT
    COALESCE(SUM(amount),0)
    AS totalExpense
    FROM expenses
    WHERE business_id = ?
    `,
    [businessId]
  );

  return {
    totalIncome:
      income[0].totalIncome,

    totalExpense:
      expense[0].totalExpense,
  };
};

module.exports = {
  getDashboardStats,
};