const customerService =
require("../services/customer.service");

const createCustomer =
async (req, res) => {

  try {

    const result =
      await customerService.createCustomer(
        req.body
      );

    res.status(201).json({
      success: true,
      data: result,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message:
        error.message,
    });

  }

};

const getCustomers =
async (req, res) => {

  try {

    const customers =
      await customerService.getCustomers(
        req.params.businessId
      );

    res.status(200).json({
      success: true,
      data: customers,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message:
        error.message,
    });

  }

};
const getCustomer =
async (req, res) => {

  const customer =
    await customerService.getCustomer(
      req.params.id
    );

  res.json({
    success: true,
    data: customer,
  });

};

const updateCustomer =
async (req, res) => {

  const result =
    await customerService.updateCustomer(
      req.params.id,
      req.body
    );

  res.json({
    success: true,
    data: result,
  });

};

const deleteCustomer =
async (req, res) => {

  const result =
    await customerService.deleteCustomer(
      req.params.id
    );

  res.json({
    success: true,
    data: result,
  });

};
module.exports = {
  createCustomer,
  getCustomers,
   getCustomer,
  deleteCustomer,
  updateCustomer,
};