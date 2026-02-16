const invoiceRepository = require("../repositories/invoice.repository");

const getInvoicePdfData = async (billId, userId) => {
  const data = await invoiceRepository.getInvoicePdfData(billId, userId);

  if (!data.bill) {
    throw new Error("Bill not found");
  }

  return data;
};

module.exports = {
  getInvoicePdfData,
};
