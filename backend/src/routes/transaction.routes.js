const express = require("express");
const {
  getTransactions,
  createTransaction,
} = require("../controllers/transaction.controller");
const authenticateToken = require("../middleware/auth.middleware");

const router = express.Router();

router.get("/", authenticateToken, getTransactions);
router.post("/", authenticateToken, createTransaction);

module.exports = router;