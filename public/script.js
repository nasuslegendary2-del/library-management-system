// API Base URL
const API_BASE = "/api";

// DOM Elements
const sections = document.querySelectorAll(".section");
const navBtns = document.querySelectorAll(".nav-btn");

// Initialize app
document.addEventListener("DOMContentLoaded", function () {
  loadBooks();
  loadUsers();
  loadBorrowings();
  setupEventListeners();
});

// Navigation
function showSection(sectionName) {
  sections.forEach((section) => section.classList.remove("active"));
  navBtns.forEach((btn) => btn.classList.remove("active"));

  document.getElementById(sectionName).classList.add("active");
  event.target.classList.add("active");

  if (sectionName === "borrowings") {
    loadUsersForSelect();
    loadAvailableBooksForSelect();
  }
}

// Event Listeners
function setupEventListeners() {
  // Add Book Form
  document
    .getElementById("addBookForm")
    .addEventListener("submit", async (e) => {
      e.preventDefault();
      const title = document.getElementById("bookTitle").value;
      const author = document.getElementById("bookAuthor").value;
      const isbn = document.getElementById("bookIsbn").value;

      try {
        const response = await fetch(`${API_BASE}/books`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title, author, isbn }),
        });

        if (response.ok) {
          document.getElementById("addBookForm").reset();
          loadBooks();
          alert("Book added successfully!");
        } else {
          alert("Error adding book");
        }
      } catch (error) {
        console.error("Error:", error);
        alert("Error adding book");
      }
    });

  // Add User Form
  document
    .getElementById("addUserForm")
    .addEventListener("submit", async (e) => {
      e.preventDefault();
      const name = document.getElementById("userName").value;
      const email = document.getElementById("userEmail").value;
      const phone = document.getElementById("userPhone").value;

      try {
        const response = await fetch(`${API_BASE}/users`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, phone }),
        });

        if (response.ok) {
          document.getElementById("addUserForm").reset();
          loadUsers();
          alert("User registered successfully!");
        } else {
          alert("Error registering user");
        }
      } catch (error) {
        console.error("Error:", error);
        alert("Error registering user");
      }
    });

  // Borrow Book Form
  document
    .getElementById("borrowBookForm")
    .addEventListener("submit", async (e) => {
      e.preventDefault();
      const user_id = document.getElementById("borrowUserId").value;
      const book_id = document.getElementById("borrowBookId").value;

      try {
        const response = await fetch(`${API_BASE}/borrowings`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            user_id: parseInt(user_id),
            book_id: parseInt(book_id),
          }),
        });

        if (response.ok) {
          document.getElementById("borrowBookForm").reset();
          loadBooks();
          loadBorrowings();
          loadAvailableBooksForSelect();
          alert("Book borrowed successfully!");
        } else {
          const error = await response.json();
          alert(`Error: ${error.error}`);
        }
      } catch (error) {
        console.error("Error:", error);
        alert("Error borrowing book");
      }
    });
}

// Load Books
async function loadBooks() {
  try {
    const response = await fetch(`${API_BASE}/books`);
    const books = await response.json();

    const tbody = document.querySelector("#booksTable tbody");
    tbody.innerHTML = "";

    books.forEach((book) => {
      const row = tbody.insertRow();
      row.innerHTML = `
                <td>${book.id}</td>
                <td>${book.title}</td>
                <td>${book.author}</td>
                <td>${book.isbn}</td>
                <td class="available-${book.available}">${
        book.available ? "Yes" : "No"
      }</td>
            `;
    });
  } catch (error) {
    console.error("Error loading books:", error);
  }
}

// Load Users
async function loadUsers() {
  try {
    const response = await fetch(`${API_BASE}/users`);
    const users = await response.json();

    const tbody = document.querySelector("#usersTable tbody");
    tbody.innerHTML = "";

    users.forEach((user) => {
      const row = tbody.insertRow();
      row.innerHTML = `
                <td>${user.id}</td>
                <td>${user.name}</td>
                <td>${user.email}</td>
                <td>${user.phone}</td>
            `;
    });
  } catch (error) {
    console.error("Error loading users:", error);
  }
}

// Load Borrowings
async function loadBorrowings() {
  try {
    const response = await fetch(`${API_BASE}/borrowings`);
    const borrowings = await response.json();

    const tbody = document.querySelector("#borrowingsTable tbody");
    tbody.innerHTML = "";

    borrowings.forEach((borrowing) => {
      const row = tbody.insertRow();
      const borrowedDate = new Date(
        borrowing.borrowed_date
      ).toLocaleDateString();
      const returnButton =
        borrowing.status === "borrowed"
          ? `<button class="return-btn" onclick="returnBook(${borrowing.id})">Return</button>`
          : "";

      row.innerHTML = `
                <td>${borrowing.id}</td>
                <td>${borrowing.user_name}</td>
                <td>${borrowing.book_title}</td>
                <td>${borrowing.author}</td>
                <td>${borrowedDate}</td>
                <td class="status-${borrowing.status}">${borrowing.status}</td>
                <td>${returnButton}</td>
            `;
    });
  } catch (error) {
    console.error("Error loading borrowings:", error);
  }
}

// Load Users for Select
async function loadUsersForSelect() {
  try {
    const response = await fetch(`${API_BASE}/users`);
    const users = await response.json();

    const select = document.getElementById("borrowUserId");
    select.innerHTML = '<option value="">Select User</option>';

    users.forEach((user) => {
      const option = document.createElement("option");
      option.value = user.id;
      option.textContent = user.name;
      select.appendChild(option);
    });
  } catch (error) {
    console.error("Error loading users for select:", error);
  }
}

// Load Available Books for Select
async function loadAvailableBooksForSelect() {
  try {
    const response = await fetch(`${API_BASE}/books`);
    const books = await response.json();

    const select = document.getElementById("borrowBookId");
    select.innerHTML = '<option value="">Select Available Book</option>';

    books
      .filter((book) => book.available)
      .forEach((book) => {
        const option = document.createElement("option");
        option.value = book.id;
        option.textContent = `${book.title} by ${book.author}`;
        select.appendChild(option);
      });
  } catch (error) {
    console.error("Error loading books for select:", error);
  }
}

// Return Book
async function returnBook(borrowingId) {
  try {
    const response = await fetch(`${API_BASE}/borrowings/${borrowingId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
    });

    if (response.ok) {
      loadBooks();
      loadBorrowings();
      loadAvailableBooksForSelect();
      alert("Book returned successfully!");
    } else {
      alert("Error returning book");
    }
  } catch (error) {
    console.error("Error:", error);
    alert("Error returning book");
  }
}
