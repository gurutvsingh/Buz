const billRepository =
require("../repositories/bill.repository");

const createBill =
async (data) => {

  if (
    !data.items ||
    data.items.length === 0
  ) {
    throw new Error(
      "At least one item required"
    );
  }

  return await billRepository.createBill(
    data.business_id,
    data.customer_id,
    data.bill_number,
    data.total_amount,
    data.bill_date,
    data.items
  );
};

const getBills =
async (businessId) => {

  return await billRepository
    .getBills(businessId);

};

const getInventoryForBilling =
async (businessId) => {

  return await billRepository
    .getInventoryForBilling(
      businessId
    );

};

const getBillById =
async (
  billId,
  businessId
) => {

  return await billRepository
    .getBillById(
      billId,
      businessId
    );

};

const updateBill =
async (
  billId,
  data
) => {

  return await billRepository
    .updateBill(
      billId,
      data.business_id,
      data.customer_id,
      data.bill_number,
      data.total_amount,
      data.bill_date
    );

};

const deleteBill =
async (
  billId,
  businessId
) => {

  return await billRepository
    .deleteBill(
      billId,
      businessId
    );

};

module.exports = {
  createBill,
  getBills,
  getInventoryForBilling,
  getBillById,
  updateBill,
  deleteBill,
};