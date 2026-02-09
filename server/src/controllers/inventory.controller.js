const inventoryService = require("../services/inventory.service");

const createItem = async (req, res) => {
  try {
    const result = await inventoryService.createItem(req.body);

    res.status(201).json({
      success: true,
      itemId: result.insertId,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getItems = async (req, res) => {
  try {
    const data = await inventoryService.getItems(req.params.businessId);

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

const updateItem = async (req, res) => {
  try {
    const result = await inventoryService.updateItem(req.params.id, req.body);

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

const deleteItem = async (req, res) => {
  try {
    const result = await inventoryService.deleteItem(
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
  createItem,
  getItems,
  updateItem,
  deleteItem,
};
