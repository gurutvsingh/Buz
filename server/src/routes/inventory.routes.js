const express = require("express");

const router = express.Router();

const authMiddleware = require("../middlewares/auth.middleware");
const inventoryController = require("../controllers/inventory.controller");

const {
  verifyBusinessOwnership,
} = require("../middlewares/business.middleware");

router.post(
  "/",
  authMiddleware,
  verifyBusinessOwnership,
  inventoryController.createItem
);

router.get(
  "/:businessId",
  authMiddleware,
  verifyBusinessOwnership,
  inventoryController.getItems
);

router.put(
  "/:id",
  authMiddleware,
  verifyBusinessOwnership,
  inventoryController.updateItem
);

router.delete(
  "/:id",
  authMiddleware,
  verifyBusinessOwnership,
  inventoryController.deleteItem
);

module.exports = router;
