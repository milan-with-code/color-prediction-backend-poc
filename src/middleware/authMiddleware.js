const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const token = req.header("Authorization");

  if (!token) {
    return res
      .status(401)
      .json({ message: "Access denied. No token provided." });
  }

  try {
    const tokenWithoutBearer = token.split(" ")[1]; // Remove "Bearer " prefix

    const decoded = jwt.verify(tokenWithoutBearer, process.env.JWT_SECRET);

    req.user = decoded;
    next();
  } catch (error) {
    console.error("JWT Verification Error:", error.message);
    return res
      .status(400)
      .json({ message: "Invalid token", error: error.message });
  }
};

module.exports = authMiddleware;
