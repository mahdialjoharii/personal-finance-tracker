const express = require("express");
const pool = require("./config/db");

const app = express();

const PORT = 5000;

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