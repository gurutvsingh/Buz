const express = require("express");
const cors = require("cors");
const pool = require("./config/db");
const errorHandler =
require(
 "./middlewares/error.middleware"
);
const authRoutes = require("./routes/auth.routes");
const businessRoutes = require(
  "./routes/business.routes"
);
const expenseRoutes = require(
  "./routes/expense.routes"
);
const billRoutes =
require("./routes/bill.routes");
const incomeRoutes =
require("./routes/income.routes");
const employeeRoutes =
require("./routes/employee.routes");
const checklistRoutes =
require("./routes/checklist.routes");
const dashboardRoutes =
require("./routes/dashboard.routes");
const customerRoutes =
require("./routes/customer.routes");
const reminderRoutes =
require("./routes/reminder.routes");
const notificationRoutes =
require(
 "./routes/notification.routes"
);
const billItemRoutes =
require(
 "./routes/billItem.routes"
);
const taskRoutes =
require("./routes/task.routes");
const analyticsRoutes =
require("./routes/analytics.routes");
const khataRoutes =
require("./routes/khata.routes");
const inventoryRoutes =
require("./routes/inventory.routes");
const invoiceRoutes =
require("./routes/invoice.routes");
const aiAssistantRoutes =
require("./routes/aiAssistant.routes");
const app = express();
app.use(cors());
app.use(express.json());
app.use(
 "/api/analytics",
 analyticsRoutes
);
app.use(
 "/api/khata",
 khataRoutes
);
app.use(
 "/api/inventory",
 inventoryRoutes
);
app.use(
 "/api/invoices",
 invoiceRoutes
);
app.use(
 "/api/ai-assistant",
 aiAssistantRoutes
);
app.use(
 "/api/bill-items",
 billItemRoutes
);
app.use(
 "/api/tasks",
 taskRoutes
);
app.use(
 "/api/notifications",
 notificationRoutes
);
app.use(
 "/api/checklists",
 checklistRoutes
);
app.use("/api/auth", authRoutes);
app.use(
  "/api/businesses",
  businessRoutes
);
app.use(
  "/api/expenses",
  expenseRoutes
);
app.use(
  "/api/dashboard",
  dashboardRoutes
);
app.use(
 "/api/bills",
 billRoutes
);
app.use(
 "/api/income",
 incomeRoutes
);
app.use(
  "/api/reminders",
  reminderRoutes
);
app.use(
 "/api/customers",
 customerRoutes
);
app.use(
 "/api/employees",
 employeeRoutes
);

app.get("/api/health", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT 1 as status");

    res.status(200).json({
      success: true,
      message: "BUZ API running",
      database: rows[0],
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});
app.use(errorHandler);
module.exports = app;
