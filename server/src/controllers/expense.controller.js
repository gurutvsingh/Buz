const expenseService = require(
  "../services/expense.service"
);

const createExpense = async (
  req,
  res
) => {
  try {
    const result =
      await expenseService.createExpense(
        req.body
      );

    res.status(201).json({
      success: true,
      expenseId: result.insertId,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const getExpense = async (
  req,
  res
) => {
  try {
    const data =
      await expenseService.getExpense(
        req.params.businessId
      );

    res.json({
      success: true,
      data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createExpense,
  getExpense,
};