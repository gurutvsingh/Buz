const analyticsService = require("../services/analytics.service");

const getRealAnalytics = async (req, res) => {
  try {
    const data = await analyticsService.getRealAnalytics(
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
  getRealAnalytics,
};
