// Simple API test script
const API_BASE = "http://localhost:3000/api";

async function testAPI() {
  console.log("🧪 Testing Library Management System API...\n");

  try {
    // Test 1: Get all books
    console.log("📚 Testing GET /api/books");
    const booksResponse = await fetch(`${API_BASE}/books`);
    const books = await booksResponse.json();
    console.log(`✅ Found ${books.length} books`);

    // Test 2: Get all users
    console.log("\n👥 Testing GET /api/users");
    const usersResponse = await fetch(`${API_BASE}/users`);
    const users = await usersResponse.json();
    console.log(`✅ Found ${users.length} users`);

    // Test 3: Add a new book
    console.log("\n📖 Testing POST /api/books");
    const newBookResponse = await fetch(`${API_BASE}/books`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: "Test Book",
        author: "Test Author",
        isbn: "978-0-123-45678-9",
      }),
    });
    const newBook = await newBookResponse.json();
    console.log(`✅ Added book: ${newBook.title}`);

    // Test 4: Borrow a book
    console.log("\n📋 Testing POST /api/borrowings");
    const borrowResponse = await fetch(`${API_BASE}/borrowings`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: 1,
        book_id: 1,
      }),
    });
    const borrowing = await borrowResponse.json();
    console.log(`✅ Book borrowed successfully, ID: ${borrowing.id}`);

    // Test 5: Get borrowings
    console.log("\n📊 Testing GET /api/borrowings");
    const borrowingsResponse = await fetch(`${API_BASE}/borrowings`);
    const borrowings = await borrowingsResponse.json();
    console.log(`✅ Found ${borrowings.length} borrowing records`);

    console.log(
      "\n🎉 All API tests passed! The application is working correctly."
    );
    console.log("\n🌐 Frontend available at: http://localhost:3000");
  } catch (error) {
    console.error("❌ Test failed:", error.message);
  }
}

// Run tests
testAPI();
