const express = require("express");
const { getCurrentGame } = require("../controllers/TimerIdController");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/current-game", getCurrentGame);

module.exports = router;