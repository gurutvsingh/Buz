const aiAssistantService = require("../services/aiAssistant.service");

const getSuggestions = async (req, res) => {
  try {
    const data = await aiAssistantService.getSuggestions(
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

const askAssistant = async (req, res) => {
  try {
    const data = await aiAssistantService.askAssistant(
      req.params.businessId,
      req.body.question
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
  getSuggestions,
  askAssistant,
};
