const customerRepository =
require("../repositories/customer.repository");

const createCustomer =
async (customerData) => {

  return await customerRepository.createCustomer(
    customerData
  );

};

const getCustomers =
async (businessId) => {

  return await customerRepository.getCustomers(
    businessId
  );

};
const getCustomer =
async (id) => {

  return await customerRepository.getCustomerById(
    id
  );

};

const updateCustomer =
async (id, data) => {

  return await customerRepository.updateCustomer(
    id,
    data
  );

};

const deleteCustomer =
async (id) => {

  return await customerRepository.deleteCustomer(
    id
  );

};
module.exports = {
  createCustomer,
  getCustomers,
   getCustomer,
  deleteCustomer,
  updateCustomer,
  
};