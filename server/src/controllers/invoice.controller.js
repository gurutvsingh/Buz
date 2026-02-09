const invoiceService = require("../services/invoice.service");

const getInvoicePdfData = async (req, res) => {
  try {
    const data = await invoiceService.getInvoicePdfData(
      req.params.billId,
      req.user.id
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
  getInvoicePdfData,
};
