const billService =
require(
 "../services/bill.service"
);

const createBill =
async (req,res) => {

 try {

  const result =
  await billService
    .createBill(
      req.body
    );

  res.status(201).json({
    success:true,
    billId:
      result.insertId,
  });

 } catch(error){

  res.status(500).json({
    success:false,
    message:error.message,
  });

 }
};

const getBills =
async (req,res) => {

 try {

  const data =
  await billService
    .getBills(
      req.params.businessId
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

const getBillById =
async (req,res) => {

 try {

  const data =
  await billService
    .getBillById(
      req.params.id,
      req.params.businessId
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

const updateBill =
async (req,res) => {

 try {

  const result =
  await billService
    .updateBill(
      req.params.id,
      req.body
    );

  res.json({
    success:true,
    affectedRows:
      result.affectedRows,
  });

 } catch(error){

  res.status(500).json({
    success:false,
    message:error.message,
  });

 }
};

const deleteBill =
async (req,res) => {

 try {

  const result =
  await billService
    .deleteBill(
      req.params.id,
      req.body.business_id
    );

  res.json({
    success:true,
    affectedRows:
      result.affectedRows,
  });

 } catch(error){

  res.status(500).json({
    success:false,
    message:error.message,
  });

 }
};
const getInventoryForBilling =
async (req,res) => {

 try {

  const data =
  await billService
    .getInventoryForBilling(
      req.params.businessId
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
 createBill,
 getBills,
 getInventoryForBilling,
 getBillById,
 updateBill,
 deleteBill,
};
