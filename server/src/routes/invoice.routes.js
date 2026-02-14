const express = require("express");

const router = express.Router();

const authMiddleware = require("../middlewares/auth.middleware");
const invoiceController = require("../controllers/invoice.controller");

router.get(
  "/:billId/pdf-data",
  authMiddleware,
  invoiceController.getInvoicePdfData
);

module.exports = router;
