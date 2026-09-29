const express = require("express");
const pool = require("./config/db");
const authRoutes = require("./routes/auth.routes");
const transactionRoutes = require("./routes/transaction.routes");

const app = express();

const PORT = 5000;

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/transactions", transactionRoutes);

app.get("/", (req, res) => {
  res.send("Personal Finance Tracker API is running");
});

app.listen(PORT, async () => {
  console.log(`Server is running on http://localhost:${PORT}`);

  try {
    const result = await pool.query("SELECT NOW()");
    console.log("Database connected successfully!");
    console.log("Database time:", result.rows[0].now);
  } catch (error) {
    console.error("Database connection failed:", error.message);
  }
});