const analyticsRepository = require("../repositories/analytics.repository");

const getRealAnalytics = async (businessId) => {
  const summary = await analyticsRepository.getSummary(businessId);
  const monthly = await analyticsRepository.getMonthlyMovement(businessId);
  const expenseCategories =
    await analyticsRepository.getExpenseCategories(businessId);

  return {
    summary: {
      ...summary,
      netProfit: summary.totalIncome - summary.totalExpense,
    },
    monthly,
    expenseCategories,
  };
};

module.exports = {
  getRealAnalytics,
};
