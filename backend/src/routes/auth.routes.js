const express = require("express");
const { registerUser, loginUser } = require("../controllers/auth.controller");
const authenticateToken = require("../middleware/auth.middleware");

const router = express.Router();

router.get("/protected", authenticateToken, (req, res) => {
    res.json({
        message: "You have access to this protected route",
        user: req.user,
    });
});

router.post("/register", registerUser);
router.post("/login", loginUser);

module.exports = router;