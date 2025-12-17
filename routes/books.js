const express = require("express");
const pool = require("../config/database");
const router = express.Router();

// GET /api/books - Get all books
router.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM books ORDER BY id");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// POST /api/books - Add new book
router.post("/", async (req, res) => {
  try {
    const { title, author, isbn } = req.body;
    const result = await pool.query(
      "INSERT INTO books (title, author, isbn) VALUES ($1, $2, $3) RETURNING *",
      [title, author, isbn]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// GET /api/books/:id - Get book by ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query("SELECT * FROM books WHERE id = $1", [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Book not found" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
