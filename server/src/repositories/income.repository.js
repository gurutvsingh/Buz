const db = require("../config/db");

const createIncome = async (
  business_id,
  amount,
  category,
  description,
  income_date
) => {
  const [result] = await db.execute(
    `
    INSERT INTO income
    (
      business_id,
      amount,
      category,
      description,
      income_date
    )
    VALUES (?, ?, ?, ?, ?)
    `,
    [
      business_id,
      amount,
      category,
      description,
      income_date,
    ]
  );

  return result;
};

const getIncomeByBusiness = async (
  businessId
) => {
  const [rows] = await db.execute(
    `
    SELECT *
    FROM income
    WHERE business_id = ?
    ORDER BY income_date DESC
    `,
    [businessId]
  );

  return rows;
};

module.exports = {
  createIncome,
  getIncomeByBusiness,
};