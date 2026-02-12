const db = require("../config/db");

const createItem = async (
businessId,
name,
sku,
quantity,
lowStockLimit,
unit,
sellingPrice,
purchasePrice
) => {
const [result] = await db.execute(
`     INSERT INTO inventory_items
    (
      business_id,
      name,
      sku,
      quantity,
      low_stock_limit,
      unit,
      selling_price,
      purchase_price
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `,
[
businessId,
name,
sku || null,
quantity || 0,
lowStockLimit || 0,
unit || "pcs",
sellingPrice || 0,
purchasePrice || 0,
]
);

return result;
};

const getItems = async (businessId) => {
const [rows] = await db.execute(
`     SELECT *
    FROM inventory_items
    WHERE business_id = ?
    ORDER BY name ASC
    `,
[businessId]
);

return rows;
};

const getItemById = async (itemId) => {
const [rows] = await db.execute(
`     SELECT *
    FROM inventory_items
    WHERE id = ?
    `,
[itemId]
);

return rows[0] || null;
};

const deductStock = async (
itemId,
quantity
) => {
const [result] = await db.execute(
`     UPDATE inventory_items
    SET quantity = quantity - ?
    WHERE id = ?
    `,
[quantity, itemId]
);

return result;
};

const updateItem = async (
id,
businessId,
name,
sku,
quantity,
lowStockLimit,
unit,
sellingPrice,
purchasePrice
) => {
const [result] = await db.execute(
`     UPDATE inventory_items
    SET
      name = ?,
      sku = ?,
      quantity = ?,
      low_stock_limit = ?,
      unit = ?,
      selling_price = ?,
      purchase_price = ?
    WHERE id = ?
    AND business_id = ?
    `,
[
name,
sku || null,
quantity || 0,
lowStockLimit || 0,
unit || "pcs",
sellingPrice || 0,
purchasePrice || 0,
id,
businessId
]
);

return result;
};

const deleteItem = async (
id,
businessId
) => {
const [result] = await db.execute(
`     DELETE FROM inventory_items
    WHERE id = ?
    AND business_id = ?
    `,
[id, businessId]
);

return result;
};

module.exports = {
createItem,
getItems,
getItemById,
deductStock,
updateItem,
deleteItem,
};
