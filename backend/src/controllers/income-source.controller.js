const pool = require("../config/db");

const getIncomeSources = async (req, res) => {
    try {
        const result = await pool.query(
            `
      SELECT id, name
      FROM income_sources
      ORDER BY id ASC
      `
        );

        res.json(result.rows);
    } catch (error) {
        console.error("Get income sources error:", error.message);

        res.status(500).json({
            message: "Failed to fetch income sources",
        });
    }
};

module.exports = {
    getIncomeSources,
};