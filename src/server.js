const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const http = require("http");
const connectDB = require("./config/db");
const TimerIdRoutes = require("./routes/TimerIdRoutes");
const { updateGameTimer } = require("./controllers/TimerIdController");
const authRoutes = require("./routes/authRoutes");

dotenv.config();
connectDB();

const app = express();
const server = http.createServer(app);

app.use(cors());
app.use(express.json());

app.use("/api", TimerIdRoutes);
app.use("/api/auth", authRoutes);

// Start Timer Update Every Second
setInterval(updateGameTimer, 1000);

// app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
