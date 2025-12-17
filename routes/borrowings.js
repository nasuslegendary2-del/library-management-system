const express = require("express");
const pool = require("../config/database");
const router = express.Router();

// GET /api/borrowings - Get all borrowings with user and book details
router.get("/", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT b.*, u.name as user_name, bk.title as book_title, bk.author
      FROM borrowings b
      JOIN users u ON b.user_id = u.id
      JOIN books bk ON b.book_id = bk.id
      ORDER BY b.borrowed_date DESC
    `);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// POST /api/borrowings - Borrow a book
router.post("/", async (req, res) => {
  try {
    const { user_id, book_id } = req.body;

    // Check if book is available
    const bookCheck = await pool.query(
      "SELECT available FROM books WHERE id = $1",
      [book_id]
    );
    if (bookCheck.rows.length === 0) {
      return res.status(404).json({ error: "Book not found" });
    }
    if (!bookCheck.rows[0].available) {
      return res.status(400).json({ error: "Book is not available" });
    }

    // Create borrowing record and update book availability
    await pool.query("BEGIN");

    const borrowResult = await pool.query(
      "INSERT INTO borrowings (user_id, book_id, status) VALUES ($1, $2, $3) RETURNING *",
      [user_id, book_id, "borrowed"]
    );

    await pool.query("UPDATE books SET available = false WHERE id = $1", [
      book_id,
    ]);

    await pool.query("COMMIT");

    res.status(201).json(borrowResult.rows[0]);
  } catch (err) {
    await pool.query("ROLLBACK");
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// PUT /api/borrowings/:id - Return a book
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // Get borrowing details
    const borrowCheck = await pool.query(
      "SELECT * FROM borrowings WHERE id = $1 AND status = $2",
      [id, "borrowed"]
    );
    if (borrowCheck.rows.length === 0) {
      return res.status(404).json({ error: "Active borrowing not found" });
    }

    const book_id = borrowCheck.rows[0].book_id;

    // Update borrowing record and book availability
    await pool.query("BEGIN");

    const result = await pool.query(
      "UPDATE borrowings SET returned_date = CURRENT_TIMESTAMP, status = $1 WHERE id = $2 RETURNING *",
      ["returned", id]
    );

    await pool.query("UPDATE books SET available = true WHERE id = $1", [
      book_id,
    ]);

    await pool.query("COMMIT");

    res.json(result.rows[0]);
  } catch (err) {
    await pool.query("ROLLBACK");
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
