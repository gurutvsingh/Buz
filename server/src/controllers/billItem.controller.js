const billItemService =
require(
 "../services/billItem.service"
);

const createBillItem =
async (req,res) => {

 try {

  const result =
  await billItemService
    .createBillItem(
      req.body
    );

  res.status(201).json({
    success:true,
    itemId:
      result.insertId,
  });

 } catch(error){

  res.status(500).json({
    success:false,
    message:error.message,
  });

 }
};

const getBillItems =
async (req,res) => {

 try {

  const data =
  await billItemService
    .getBillItems(
      req.params.billId
    );

  res.json({
    success:true,
    data,
  });

 } catch(error){

  res.status(500).json({
    success:false,
    message:error.message,
  });

 }
};

module.exports = {
 createBillItem,
 getBillItems,
};