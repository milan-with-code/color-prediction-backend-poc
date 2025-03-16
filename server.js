const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const http = require("http");
const connectDB = require("./src/config/db");
const TimerIdRoutes = require("./src/routes/TimerIdRoutes");
const { updateGameTimer } = require("./src/controllers/TimerIdController");
const authRoutes = require("./src/routes/authRoutes");

dotenv.config();
connectDB();

const app = express();
const server = http.createServer(app);

app.use(cors());
app.use(express.json());

// Basic route
app.get("/", (req, res) => {
  res.send("Hello from Color Prediction Game Backend!");
});

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Your additional routes would go here (e.g., authentication, game logic, etc.)
app.use("/api", TimerIdRoutes);
app.use("/api/auth", authRoutes);

// Start Timer Update Every Second
setInterval(updateGameTimer, 1000);

// app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
