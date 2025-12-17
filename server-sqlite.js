const express = require("express");
const cors = require("cors");
const path = require("path");
const sqlite3 = require("sqlite3").verbose();

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize SQLite database
const db = new sqlite3.Database("./library.db");

// Create tables and sample data
db.serialize(() => {
  // Create tables
  db.run(`CREATE TABLE IF NOT EXISTS books (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    author TEXT NOT NULL,
    isbn TEXT UNIQUE,
    available BOOLEAN DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS borrowings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    book_id INTEGER,
    borrowed_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    returned_date DATETIME NULL,
    status TEXT DEFAULT 'borrowed',
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (book_id) REFERENCES books(id)
  )`);

  // Insert sample data
  db.run(`INSERT OR IGNORE INTO books (title, author, isbn) VALUES
    ('The Great Gatsby', 'F. Scott Fitzgerald', '978-0-7432-7356-5'),
    ('To Kill a Mockingbird', 'Harper Lee', '978-0-06-112008-4'),
    ('1984', 'George Orwell', '978-0-452-28423-4'),
    ('Pride and Prejudice', 'Jane Austen', '978-0-14-143951-8'),
    ('The Catcher in the Rye', 'J.D. Salinger', '978-0-316-76948-0')`);

  db.run(`INSERT OR IGNORE INTO users (name, email, phone) VALUES
    ('John Doe', 'john.doe@email.com', '555-0101'),
    ('Jane Smith', 'jane.smith@email.com', '555-0102'),
    ('Bob Johnson', 'bob.johnson@email.com', '555-0103')`);
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// Books Routes
app.get("/api/books", (req, res) => {
  db.all("SELECT * FROM books ORDER BY id", (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

app.post("/api/books", (req, res) => {
  const { title, author, isbn } = req.body;
  db.run(
    "INSERT INTO books (title, author, isbn) VALUES (?, ?, ?)",
    [title, author, isbn],
    function (err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res
        .status(201)
        .json({ id: this.lastID, title, author, isbn, available: true });
    }
  );
});

// Users Routes
app.get("/api/users", (req, res) => {
  db.all("SELECT * FROM users ORDER BY id", (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

app.post("/api/users", (req, res) => {
  const { name, email, phone } = req.body;
  db.run(
    "INSERT INTO users (name, email, phone) VALUES (?, ?, ?)",
    [name, email, phone],
    function (err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.status(201).json({ id: this.lastID, name, email, phone });
    }
  );
});

// Borrowings Routes
app.get("/api/borrowings", (req, res) => {
  const query = `
    SELECT b.*, u.name as user_name, bk.title as book_title, bk.author
    FROM borrowings b
    JOIN users u ON b.user_id = u.id
    JOIN books bk ON b.book_id = bk.id
    ORDER BY b.borrowed_date DESC
  `;
  db.all(query, (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

app.post("/api/borrowings", (req, res) => {
  const { user_id, book_id } = req.body;

  // Check if book is available
  db.get("SELECT available FROM books WHERE id = ?", [book_id], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (!row) {
      res.status(404).json({ error: "Book not found" });
      return;
    }
    if (!row.available) {
      res.status(400).json({ error: "Book is not available" });
      return;
    }

    // Create borrowing and update book
    db.serialize(() => {
      db.run(
        "INSERT INTO borrowings (user_id, book_id, status) VALUES (?, ?, ?)",
        [user_id, book_id, "borrowed"],
        function (err) {
          if (err) {
            res.status(500).json({ error: err.message });
            return;
          }

          db.run(
            "UPDATE books SET available = 0 WHERE id = ?",
            [book_id],
            (err) => {
              if (err) {
                res.status(500).json({ error: err.message });
                return;
              }
              res
                .status(201)
                .json({
                  id: this.lastID,
                  user_id,
                  book_id,
                  status: "borrowed",
                });
            }
          );
        }
      );
    });
  });
});

app.put("/api/borrowings/:id", (req, res) => {
  const { id } = req.params;

  // Get borrowing details
  db.get(
    "SELECT * FROM borrowings WHERE id = ? AND status = ?",
    [id, "borrowed"],
    (err, row) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      if (!row) {
        res.status(404).json({ error: "Active borrowing not found" });
        return;
      }

      const book_id = row.book_id;

      // Update borrowing and book
      db.serialize(() => {
        db.run(
          "UPDATE borrowings SET returned_date = CURRENT_TIMESTAMP, status = ? WHERE id = ?",
          ["returned", id],
          function (err) {
            if (err) {
              res.status(500).json({ error: err.message });
              return;
            }

            db.run(
              "UPDATE books SET available = 1 WHERE id = ?",
              [book_id],
              (err) => {
                if (err) {
                  res.status(500).json({ error: err.message });
                  return;
                }
                res.json({ id, status: "returned" });
              }
            );
          }
        );
      });
    }
  );
});

// Serve frontend
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "OK", message: "Library Management System API (SQLite)" });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} with SQLite database`);
});

// Graceful shutdown
process.on("SIGINT", () => {
  db.close((err) => {
    if (err) {
      console.error(err.message);
    }
    console.log("Database connection closed.");
    process.exit(0);
  });
});
