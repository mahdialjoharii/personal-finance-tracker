const pool = require("../config/db");

const getTransactions = async (req, res) => {
    try {
        const userId = req.user.userId;

        const result = await pool.query(
            `
              SELECT
                transactions.id,
                transactions.user_id,
                transactions.amount,
                transactions.type,
                transactions.category_id,
                transactions.income_source_id,
                transactions.description,
                TO_CHAR(transactions.date, 'YYYY-MM-DD') AS date,
                transactions.created_at,
                categories.name AS category_name,
                income_sources.name AS income_source_name
              FROM transactions
              LEFT JOIN categories
                ON transactions.category_id = categories.id
              LEFT JOIN income_sources
                ON transactions.income_source_id = income_sources.id
              WHERE transactions.user_id = $1
              ORDER BY transactions.date DESC, transactions.created_at DESC
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
            categoryId,
            incomeSourceId,
            description,
            date,
        } = req.body;

        if (!amount || !type || !date) {
            return res.status(400).json({
                message: "Amount, type, and date are required",
            });
        }

        if (type !== "INCOME" && type !== "EXPENSE") {
            return res.status(400).json({
                message: "Type must be INCOME or EXPENSE",
            });
        }

        if (type === "EXPENSE" && !categoryId) {
            return res.status(400).json({
                message: "Category is required for expenses",
            });
        }

        if (type === "INCOME" && !incomeSourceId) {
            return res.status(400).json({
                message: "Income source is required for income",
            });
        }

        const result = await pool.query(
            `
              INSERT INTO transactions
                (
                 user_id,
                 amount,
                 type,
                 category_id,
                 income_source_id,
                 description,
                 date
                )
              VALUES
                ($1, $2, $3, $4, $5, $6, $7)
              RETURNING *
            `,
            [
                userId,
                amount,
                type,
                type === "EXPENSE" ? categoryId : null,
                type === "INCOME" ? incomeSourceId : null,
                description || null,
                date,
            ]
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

const updateTransaction = async (req, res) => {
    try {
        const userId = req.user.userId;
        const transactionId = req.params.id;

        const {
            amount,
            type,
            categoryId,
            description,
            date,
        } = req.body;

        if (!amount || !type || !categoryId || !date) {
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
             UPDATE transactions
             SET
             amount = $1,
             type = $2,
             category_id = $3,
             description = $4,
             date = $5
             WHERE id = $6 AND user_id = $7
             RETURNING *
            `,
            [
                amount,
                type,
                categoryId,
                description || null,
                date,
                transactionId,
                userId,
            ]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Transaction not found",
            });
        }

        res.json({
            message: "Transaction updated successfully",
            transaction: result.rows[0],
        });

    } catch (error) {
        console.error("Update transaction error:", error.message);

        res.status(500).json({
            message: "Failed to update transaction",
        });
    }
};

const deleteTransaction = async (req, res) => {
    try {
        const userId = req.user.userId;
        const transactionId = req.params.id;

        const result = await pool.query(
            `
             DELETE FROM transactions
             WHERE id = $1 AND user_id = $2
             RETURNING *
            `,
            [transactionId, userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Transaction not found",
            });
        }

        res.json({
            message: "Transaction deleted successfully",
            transaction: result.rows[0],
        });

    } catch (error) {
        console.error("Delete transaction error:", error.message);

        res.status(500).json({
            message: "Failed to delete transaction",
        });
    }
};

module.exports = {
    getTransactions,
    createTransaction,
    updateTransaction,
    deleteTransaction,
};