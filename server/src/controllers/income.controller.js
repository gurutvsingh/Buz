const incomeService = require(
  "../services/income.service"
);

const createIncome = async (
  req,
  res
) => {
  try {
    const result =
      await incomeService.createIncome(
        req.body
      );

    res.status(201).json({
      success: true,
      incomeId: result.insertId,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const getIncome = async (
  req,
  res
) => {
  try {
    const data =
      await incomeService.getIncome(
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
  createIncome,
  getIncome,
};