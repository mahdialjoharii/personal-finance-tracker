const pool = require("../config/db");

const getTransactions = async (req, res) => {
    try {
        const userId = req.user.userId;

        const result = await pool.query(
            `
             SELECT *
             FROM transactions
             WHERE user_id = $1
             ORDER BY date DESC, created_at DESC
            `,
            [userId]
        );

        res.json(result.rows);
    } catch (error) {
        console.error("Get transactions error:", error.message);

        res.status(500).json({
            message: "Failed to fetch transactions",
        });
    }
};

const createTransaction = async (req, res) => {
    try {
        const userId = req.user.userId;

        const {
            amount,
            type,
            category,
            description,
            date,
        } = req.body;

        if (!amount || !type || !category || !date) {
            return res.status(400).json({
                message: "Amount, type, category, and date are required",
            });
        }

        if (type !== "INCOME" && type !== "EXPENSE") {
            return res.status(400).json({
                message: "Type must be INCOME or EXPENSE",
            });
        }

        const result = await pool.query(
            `
             INSERT INTO transactions
             (user_id, amount, type, category, description, date)
             VALUES
             ($1, $2, $3, $4, $5, $6)
             RETURNING *
            `,
            [userId, amount, type, category, description || null, date]
        );

        res.status(201).json({
            message: "Transaction created successfully",
            transaction: result.rows[0],
        });

    } catch (error) {
        console.error("Create transaction error:", error.message);

        res.status(500).json({
            message: "Failed to create transaction",
        });
    }
};


module.exports = {
    getTransactions,
    createTransaction,
};