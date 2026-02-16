const dashboardRepository =
require("../repositories/dashboard.repository");

const getDashboard = async (
  businessId
) => {

  const stats =
    await dashboardRepository
      .getDashboardStats(
        businessId
      );

  return {
    ...stats,
    netProfit:
      Number(stats.totalIncome) -
      Number(stats.totalExpense),
  };
};

module.exports = {
  getDashboard,
};