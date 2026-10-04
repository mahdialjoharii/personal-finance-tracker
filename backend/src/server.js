const express = require("express");
const cors = require("cors");
const pool = require("./config/db");
const authRoutes = require("./routes/auth.routes");
const transactionRoutes = require("./routes/transaction.routes");
const categoryRoutes = require("./routes/category.routes");
const incomeSourceRoutes = require("./routes/income-source.routes");
const dashboardRoutes = require("./routes/dashboard.routes");

const app = express();

app.use(cors());

const PORT = 5000;

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/income-sources", incomeSourceRoutes);
app.use("/api/dashboard", dashboardRoutes);

app.get("/", (req, res) => {
    res.send("Personal Finance Tracker API is running");
});

app.listen(PORT, async () => {
    console.log(`Server is running on http://localhost:${PORT}`);

    try {
        const result = await pool.query("SELECT NOW()");
        console.log("Database connected successfully!");
        
    } catch (error) {
        console.error("Database connection failed:", error.message);
    }
});