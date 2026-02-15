const bcrypt = require("bcryptjs");
const authRepository = require("../repositories/auth.repository");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const registerUser = async ({
  name,
  email,
  password,
  role = "OWNER",
}) => {
  const existingUser =
    await authRepository.findUserByEmail(email);

  if (existingUser) {
    throw new Error("Email already registered");
  }

  const passwordHash =
    await bcrypt.hash(password, 10);

  

  const userId =
    await authRepository.createUser({
      name,
      email,
      passwordHash,
      role,
    });

  return {
    id: userId,
    name,
    email,
    role,
  };
};
const loginUser = async ({
  email,
  password,
}) => {

  const user =
    await authRepository.findUserByEmail(email);

  if (!user) {
    throw new Error("Invalid credentials");
  }

  const isMatch =
    await bcrypt.compare(
      password,
      user.password_hash
    );

  if (!isMatch) {
    throw new Error("Invalid credentials");
  }

  const token = jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    }
  );

  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  };
};
const getProfile = async (userId) => {
  const user =
    await authRepository.findUserById(userId);

  if (!user) {
    throw new Error("User not found");
  }

  return user;
};
module.exports = {
  registerUser,
  loginUser,
  getProfile,
};