const inventoryRepository = require("../repositories/inventory.repository");

const createItem = async (data) => {
return await inventoryRepository.createItem(
data.business_id,
data.name,
data.sku,
data.quantity,
data.low_stock_limit,
data.unit,
data.selling_price,
data.purchase_price
);
};

const getItems = async (businessId) => {
return await inventoryRepository.getItems(
businessId
);
};

const getItemById = async (itemId) => {
return await inventoryRepository.getItemById(
itemId
);
};

const deductStock = async (
itemId,
quantity
) => {
return await inventoryRepository.deductStock(
itemId,
quantity
);
};

const updateItem = async (
id,
data
) => {
return await inventoryRepository.updateItem(
id,
data.business_id,
data.name,
data.sku,
data.quantity,
data.low_stock_limit,
data.unit,
data.selling_price,
data.purchase_price
);
};

const deleteItem = async (
id,
businessId
) => {
return await inventoryRepository.deleteItem(
id,
businessId
);
};

module.exports = {
createItem,
getItems,
getItemById,
deductStock,
updateItem,
deleteItem,
};
