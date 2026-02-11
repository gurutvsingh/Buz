const db = require("../config/db");

const createChecklist = async (
  business_id,
  title,
  description,
  frequency
) => {

  const [result] =
  await db.execute(
    `
    INSERT INTO checklists
    (
      business_id,
      title,
      description,
      frequency
    )
    VALUES (?, ?, ?, ?)
    `,
    [
      business_id,
      title,
      description,
      frequency
    ]
  );

  return result;
};

const getChecklists = async (
  businessId
) => {

  const [rows] =
  await db.execute(
    `
    SELECT *
    FROM checklists
    WHERE business_id = ?
    ORDER BY created_at DESC
    `,
    [businessId]
  );

  return rows;
};

module.exports = {
  createChecklist,
  getChecklists,
};