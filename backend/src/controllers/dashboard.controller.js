const pool = require("../config/db");

const getDashboard = async (req, res) => {
    try {
        const userId = req.user.userId;

        const result = await pool.query(
            `
      SELECT
        COALESCE(SUM(CASE WHEN type = 'INCOME' THEN amount ELSE 0 END), 0) AS "totalIncome",
        COALESCE(SUM(CASE WHEN type = 'EXPENSE' THEN amount ELSE 0 END), 0) AS "totalExpenses"
      FROM transactions
      WHERE user_id = $1
      `,
            [userId]
        );

        const totalIncome = Number(result.rows[0].totalIncome);
        const totalExpenses = Number(result.rows[0].totalExpenses);

        const balance = totalIncome - totalExpenses;

        res.json({
            totalIncome,
            totalExpenses,
            balance,
        });
    } catch (error) {
        console.error("Get dashboard error:", error.message);

        res.status(500).json({
            message: "Failed to fetch dashboard data",
        });
    }
};

module.exports = {
    getDashboard,
};