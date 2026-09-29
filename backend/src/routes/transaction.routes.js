const express = require("express");
const { getTransactions } = require("../controllers/transaction.controller");
const authenticateToken = require("../middleware/auth.middleware");

const router = express.Router();

router.get("/", authenticateToken, getTransactions);

module.exports = router;