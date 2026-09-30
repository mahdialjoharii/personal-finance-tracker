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

        const monthlyResult = await pool.query(
            `
             SELECT
              TO_CHAR(date, 'YYYY-MM') AS month,
              COALESCE(
                SUM(CASE WHEN type = 'INCOME' THEN amount ELSE 0 END),
                0
              ) AS "totalIncome",
              COALESCE(
                SUM(CASE WHEN type = 'EXPENSE' THEN amount ELSE 0 END),
                0
              ) AS "totalExpenses"
             FROM transactions
             WHERE user_id = $1
             GROUP BY TO_CHAR(date, 'YYYY-MM')
             ORDER BY month ASC
            `,
            [userId]
        );

        const categoryResult = await pool.query(
            `
             SELECT
              categories.name AS category,
              COALESCE(SUM(transactions.amount), 0) AS total
             FROM transactions
             JOIN categories
              ON transactions.category_id = categories.id
             WHERE transactions.user_id = $1
              AND transactions.type = 'EXPENSE'
             GROUP BY categories.name
             ORDER BY total DESC
            `,
            [userId]
        );

        res.json({
            totalIncome,
            totalExpenses,
            balance,
            monthlySummary: monthlyResult.rows,
            expensesByCategory: categoryResult.rows,
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