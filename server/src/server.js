require("dotenv").config();

const app = require("./app");
const pool = require("./config/db");

const PORT = process.env.PORT || 5000;

// Root Route
app.get("/", (req, res) => {
  res.json({
    success: true,
    app: "BUZ API",
    version: "1.0.0",
    status: "running",
  });
});

// Health Check Route
app.get("/health", async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT NOW() AS server_time"
    );

    res.json({
      success: true,
      database: "connected",
      serverTime: rows[0].server_time,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      database: "disconnected",
      error: error.message,
    });
  }
});

app.listen(PORT, () => {
  console.log(
    `🚀 BUZ Server running on port ${PORT}`
  );
});
