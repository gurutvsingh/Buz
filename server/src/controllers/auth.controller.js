const authService = require("../services/auth.service");

const register = async (req, res) => {
  try {
    const { name, email, password, role } =
      req.body;

    const user =
      await authService.registerUser({
        name,
        email,
        password,
        role,
      });

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: user,
    });

  } catch (error) {

    return res.status(400).json({
      success: false,
      message: error.message,
    });

  }
};
const login = async (req, res) => {
  try {

    const { email, password } =
      req.body;

    const result =
      await authService.loginUser({
        email,
        password,
      });

    return res.status(200).json({
      success: true,
      message: "Login successful",
      data: result,
    });

  } catch (error) {

    return res.status(401).json({
      success: false,
      message: error.message,
    });

  }
};
const getProfile = async (req, res) => {
  try {

    const user =
      await authService.getProfile(
        req.user.id
      );

    return res.status(200).json({
      success: true,
      data: user,
    });

  } catch (error) {

    return res.status(400).json({
      success: false,
      message: error.message,
    });

  }
};
module.exports = {
  register,
  login,
  getProfile,
};