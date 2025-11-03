const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const path = require("path");
require("dotenv").config();

const connectDB = require("./config/database");
const apiRoutes = require("./routes/api");

const app = express();
const PORT = process.env.PORT || 5000;

// Connect DB
connectDB();

// Security + CORS
app.use(helmet());
app.use(cors({
  origin: "*"||"http://localhost:3000",
  credentials: true,
}));

// Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Serve uploaded images correctly
app.use("/uploads", express.static(path.join(__dirname, "public", "uploads")));

// API
app.use("/api", apiRoutes);

// Error handler
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ success: false, message: "Internal server error" });
});

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
