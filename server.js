const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const booksRoutes = require("./routes/books");
const usersRoutes = require("./routes/users");
const borrowingsRoutes = require("./routes/borrowings");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// Routes
app.use("/api/books", booksRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/borrowings", borrowingsRoutes);

// Serve frontend
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "OK", message: "Library Management System API" });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
