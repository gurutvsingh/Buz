const billItemRepository =
require(
 "../repositories/billItem.repository"
);

const createBillItem =
async (data) => {

  const subtotal =
    data.quantity *
    data.price;

  return await billItemRepository
    .createBillItem(
      data.bill_id,
      data.item_name,
      data.quantity,
      data.price,
      subtotal
    );
};

const getBillItems =
async (billId) => {

  return await billItemRepository
    .getBillItems(
      billId
    );
};

module.exports = {
 createBillItem,
 getBillItems,
};