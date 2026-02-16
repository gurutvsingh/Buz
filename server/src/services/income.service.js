const incomeRepository = require(
  "../repositories/income.repository"
);

const createIncome = async (data) => {
  return await incomeRepository.createIncome(
    data.business_id,
    data.amount,
    data.category,
    data.description,
    data.income_date
  );
};

const getIncome = async (
  businessId
) => {
  return await incomeRepository.getIncomeByBusiness(
    businessId
  );
};

module.exports = {
  createIncome,
  getIncome,
};