const khataService = require("../services/khata.service");

const createLedgerEntry = async (req, res) => {
  try {
    const result = await khataService.createLedgerEntry(req.body);

    res.status(201).json({
      success: true,
      ledgerEntryId: result.insertId,
    });
  } catch (error) {
     console.error("KHATA ERROR =>", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getCustomerLedger = async (req, res) => {
  try {
    const data = await khataService.getCustomerLedger(
      req.params.customerId,
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

const getBusinessKhataSummary = async (req, res) => {
  try {
    const data = await khataService.getBusinessKhataSummary(
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

const updateLedgerEntry = async (req, res) => {
  try {
    const result = await khataService.updateLedgerEntry(
      req.params.id,
      req.body
    );

    res.json({
      success: true,
      affectedRows: result.affectedRows,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const deleteLedgerEntry = async (req, res) => {
  try {
    const result = await khataService.deleteLedgerEntry(
      req.params.id,
      req.body.business_id
    );

    res.json({
      success: true,
      affectedRows: result.affectedRows,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createLedgerEntry,
  getCustomerLedger,
  getBusinessKhataSummary,
  updateLedgerEntry,
  deleteLedgerEntry,
};
