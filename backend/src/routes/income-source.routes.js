const express = require("express");

const {
    getIncomeSources,
} = require("../controllers/income-source.controller");

const authenticateToken = require("../middleware/auth.middleware");

const router = express.Router();

router.get("/", authenticateToken, getIncomeSources);

module.exports = router;