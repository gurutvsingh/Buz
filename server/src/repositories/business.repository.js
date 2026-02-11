const db = require("../config/db");

const createBusiness = async ({
  owner_id,
  name,
  business_type,
  description,
}) => {
  const [result] = await db.execute(
    `
    INSERT INTO businesses
    (
      owner_id,
      name,
      business_type,
      description
    )
    VALUES (?, ?, ?, ?)
    `,
    [
      owner_id,
      name,
      business_type,
      description,
    ]
  );

  return result;
};
const getBusinessesByOwner = async (ownerId) => {
  const [rows] = await db.execute(
    `
    SELECT *
    FROM businesses
    WHERE owner_id = ?
    ORDER BY created_at DESC
    `,
    [ownerId]
  );

  return rows;
};
const getBusinessById = async (id, ownerId) => {
  const [rows] = await db.execute(
    `
    SELECT *
    FROM businesses
    WHERE id = ?
    AND owner_id = ?
    `,
    [id, ownerId]
  );

  return rows[0];
};

const updateBusiness = async (
  id,
  ownerId,
  name,
  business_type,
  description
) => {
  const [result] = await db.execute(
    `
    UPDATE businesses
    SET
      name = ?,
      business_type = ?,
      description = ?
    WHERE id = ?
    AND owner_id = ?
    `,
    [
      name,
      business_type,
      description,
      id,
      ownerId,
    ]
  );

  return result;
};

const deleteBusiness = async (
  id,
  ownerId
) => {
  const [result] = await db.execute(
    `
    DELETE FROM businesses
    WHERE id = ?
    AND owner_id = ?
    `,
    [id, ownerId]
  );

  return result;
};

module.exports = {
  createBusiness,
  getBusinessesByOwner,
  getBusinessById,
  updateBusiness,
  deleteBusiness,
};