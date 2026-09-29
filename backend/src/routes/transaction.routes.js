const express = require("express");
const {
    getTransactions,
    createTransaction,
    updateTransaction,
    deleteTransaction,
} = require("../controllers/transaction.controller");
const authenticateToken = require("../middleware/auth.middleware");

const router = express.Router();

router.get("/", authenticateToken, getTransactions);
router.post("/", authenticateToken, createTransaction);
router.put("/:id", authenticateToken, updateTransaction);
router.delete("/:id", authenticateToken, deleteTransaction);

module.exports = router;