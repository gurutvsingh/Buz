const expenseRepository = require(
  "../repositories/expense.repository"
);

const createExpense = async (data) => {
  return await expenseRepository.createExpense(
    data.business_id,
    data.amount,
    data.category,
    data.description,
    data.expense_date
  );
};

const getExpense = async (
  businessId
) => {
  return await expenseRepository.getExpenseByBusiness(
    businessId
  );
};

module.exports = {
  createExpense,
  getExpense,
};