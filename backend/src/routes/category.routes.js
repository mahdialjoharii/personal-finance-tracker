const express = require("express");

const {
    getCategories,
} = require("../controllers/category.controller");

const authenticateToken = require("../middleware/auth.middleware");

const router = express.Router();

router.get("/", authenticateToken, getCategories);

module.exports = router;