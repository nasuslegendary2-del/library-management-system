// Container testing script
const API_BASE = "http://localhost";

async function testContainers() {
  console.log("🐳 Testing Containerized Library Management System...\n");

  try {
    // Test 1: Frontend accessibility
    console.log("🌐 Testing Frontend (Port 80)");
    const frontendResponse = await fetch(`${API_BASE}/`);
    if (frontendResponse.ok) {
      console.log("✅ Frontend accessible");
    } else {
      console.log("❌ Frontend not accessible");
    }

    // Test 2: Backend health check via frontend proxy
    console.log("\n🔧 Testing Backend Health Check");
    const healthResponse = await fetch(`${API_BASE}/health`);
    if (healthResponse.ok) {
      const health = await healthResponse.json();
      console.log(`✅ Backend healthy: ${health.message}`);
    } else {
      console.log("❌ Backend health check failed");
    }

    // Test 3: API endpoints via frontend proxy
    console.log("\n📚 Testing API via Frontend Proxy");
    const booksResponse = await fetch(`${API_BASE}/api/books`);
    if (booksResponse.ok) {
      const books = await booksResponse.json();
      console.log(`✅ API working - Found ${books.length} books`);
    } else {
      console.log("❌ API not accessible via proxy");
    }

    // Test 4: Database connectivity (indirect via API)
    console.log("\n🗄️ Testing Database Connectivity");
    const usersResponse = await fetch(`${API_BASE}/api/users`);
    if (usersResponse.ok) {
      const users = await usersResponse.json();
      console.log(`✅ Database connected - Found ${users.length} users`);
    } else {
      console.log("❌ Database connection failed");
    }

    console.log("\n🎉 Container testing complete!");
    console.log("\n📋 Container URLs:");
    console.log("- Frontend: http://localhost (Port 80)");
    console.log("- Backend: http://localhost:3000 (Port 3000)");
    console.log("- Database: localhost:5432 (Port 5432)");
  } catch (error) {
    console.error("❌ Container test failed:", error.message);
    console.log("\n💡 Make sure containers are running: docker-compose ps");
  }
}

// Run tests
testContainers();
