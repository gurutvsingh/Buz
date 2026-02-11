const pool = require("../config/db");

const findUserByEmail = async (email) => {
  const [rows] = await pool.query(
    "SELECT * FROM users WHERE email = ?",
    [email]
  );

  return rows[0];
};
const findUserById = async (id) => {
  const [rows] = await pool.query(
    "SELECT id,name,email,role FROM users WHERE id = ?",
    [id]
  );

  return rows[0];
};
const createUser = async ({
  name,
  email,
  passwordHash,
  role,
}) => {
  const [result] = await pool.query(
    `
      INSERT INTO users
      (name,email,password_hash,role)
      VALUES (?,?,?,?)
    `,
    [name, email, passwordHash, role]
  );

  return result.insertId;
};

module.exports = {
  findUserByEmail,
  createUser,
  findUserById,
};