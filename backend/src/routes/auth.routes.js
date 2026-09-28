const express = require("express");
const { registerUser, loginUser } = require("../controllers/auth.controller");

const router = express.Router();

router.get("/test", (req, res) => {
  res.json({
    message: "Auth route is working",
  });
});

router.post("/register", registerUser);
router.post("/login", loginUser);

module.exports = router;