const dashboardService =
require("../services/dashboard.service");

const getDashboard = async (
  req,
  res
) => {

  const data =
    await dashboardService
      .getDashboard(
        req.params.businessId
      );

  res.json({
    success:true,
    data,
  });
};

module.exports = {
  getDashboard,
};