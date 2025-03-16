const Game = require("../models/TimerId");

// 🔹 Format time (Add leading zero if below 10)
const formatTime = (time) => (time < 10 ? `0${time}` : `${time}`);

// 🔹 Generate 16-digit Game ID
const generateGameId = async () => {
  const datePart = new Date().toISOString().slice(0, 10).replace(/-/g, ""); // YYYYMMDD
  const lastGame = await Game.findOne().sort({ createdAt: -1 });

  let newIncrement = "00000003"; // Default ID if no previous game exists
  if (lastGame) {
    const lastIncrement = parseInt(lastGame.gameId.slice(8), 10);
    newIncrement = String(lastIncrement + 1).padStart(8, "0"); // Increment last part
  }

  return datePart + newIncrement; // Return formatted 16-digit Game ID
};

// 🔹 Fetch the Current Game Data
const getCurrentGame = async (req, res) => {
  try {
    let game = await Game.findOne().sort({ createdAt: -1 });

    if (!game) {
      const newGame = new Game({
        gameId: await generateGameId(),
        timeLeft: 30,
      });
      game = await newGame.save();
    }

    res.json({ gameId: game.gameId, timeLeft: formatTime(game.timeLeft) });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// 🔹 Update Timer Every Second
const updateGameTimer = async () => {
  let game = await Game.findOne().sort({ createdAt: -1 });

  if (game) {
    if (game.timeLeft > 0) {
      game.timeLeft -= 1;
    } else {
      game.gameId = await generateGameId(); // Generate new Game ID
      game.timeLeft = 30;
    }
    await game.save();
  }
};

// ✅ Export functions
module.exports = {
  getCurrentGame,
  updateGameTimer,
  generateGameId, // Exporting in case needed elsewhere
};
