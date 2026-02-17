const khataRepository = require("../repositories/khata.repository");

const createLedgerEntry = async (data) => {
  const isValidCustomer =
    await khataRepository.verifyCustomerInBusiness(
      data.customer_id,
      data.business_id
    );

  if (!isValidCustomer) {
    throw new Error("Customer does not belong to this business");
  }

  return await khataRepository.createLedgerEntry(
    data.customer_id,
    data.entry_type,
    data.amount,
    data.description || null,
    data.entry_date
  );
};

const getCustomerLedger = async (customerId, userId) => {
  return await khataRepository.getCustomerLedger(customerId, userId);
};

const getBusinessKhataSummary = async (businessId) => {
  return await khataRepository.getBusinessKhataSummary(businessId);
};

const updateLedgerEntry = async (ledgerEntryId, data) => {
  const isValidCustomer =
    await khataRepository.verifyCustomerInBusiness(
      data.customer_id,
      data.business_id
    );

  if (!isValidCustomer) {
    throw new Error("Customer does not belong to this business");
  }

  return await khataRepository.updateLedgerEntry(
    ledgerEntryId,
    data.business_id,
    data.customer_id,
    data.entry_type,
    data.amount,
    data.description || null,
    data.entry_date
  );
};

const deleteLedgerEntry = async (ledgerEntryId, businessId) => {
  return await khataRepository.deleteLedgerEntry(
    ledgerEntryId,
    businessId
  );
};

module.exports = {
  createLedgerEntry,
  getCustomerLedger,
  getBusinessKhataSummary,
  updateLedgerEntry,
  deleteLedgerEntry,
};
