// Test AKS deployment script
const { execSync } = require("child_process");

async function testAKSDeployment() {
  console.log("🧪 Testing AKS Deployment...\n");

  try {
    // Get LoadBalancer IP
    console.log("🔍 Getting LoadBalancer IP...");
    const getIPCommand = `kubectl get service lms-frontend-service -o jsonpath='{.status.loadBalancer.ingress[0].ip}'`;
    const externalIP = execSync(getIPCommand, { encoding: "utf8" }).trim();

    if (!externalIP || externalIP === "null") {
      console.log("❌ LoadBalancer IP not yet assigned");
      console.log("💡 Run: kubectl get services");
      return;
    }

    console.log(`✅ External IP: ${externalIP}`);
    const baseURL = `http://${externalIP}`;

    // Test 1: Frontend accessibility
    console.log("\n🌐 Testing Frontend Access");
    try {
      const frontendResponse = await fetch(baseURL);
      if (frontendResponse.ok) {
        console.log("✅ Frontend accessible");
      } else {
        console.log(`❌ Frontend returned status: ${frontendResponse.status}`);
      }
    } catch (error) {
      console.log(`❌ Frontend not accessible: ${error.message}`);
    }

    // Test 2: Backend health check
    console.log("\n🔧 Testing Backend Health");
    try {
      const healthResponse = await fetch(`${baseURL}/health`);
      if (healthResponse.ok) {
        const health = await healthResponse.json();
        console.log(`✅ Backend healthy: ${health.message}`);
      } else {
        console.log(`❌ Health check failed: ${healthResponse.status}`);
      }
    } catch (error) {
      console.log(`❌ Health check failed: ${error.message}`);
    }

    // Test 3: API functionality
    console.log("\n📚 Testing API Endpoints");
    try {
      const booksResponse = await fetch(`${baseURL}/api/books`);
      if (booksResponse.ok) {
        const books = await booksResponse.json();
        console.log(`✅ Books API working - Found ${books.length} books`);
      } else {
        console.log(`❌ Books API failed: ${booksResponse.status}`);
      }
    } catch (error) {
      console.log(`❌ Books API failed: ${error.message}`);
    }

    // Test 4: Database connectivity
    console.log("\n🗄️ Testing Database Connection");
    try {
      const usersResponse = await fetch(`${baseURL}/api/users`);
      if (usersResponse.ok) {
        const users = await usersResponse.json();
        console.log(`✅ Database connected - Found ${users.length} users`);
      } else {
        console.log(`❌ Database connection failed: ${usersResponse.status}`);
      }
    } catch (error) {
      console.log(`❌ Database connection failed: ${error.message}`);
    }

    // Test 5: Full workflow test
    console.log("\n🔄 Testing Complete Workflow");
    try {
      // Add a test book
      const newBook = {
        title: "AKS Test Book",
        author: "Cloud Author",
        isbn: "978-0-000-00000-0",
      };

      const addBookResponse = await fetch(`${baseURL}/api/books`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newBook),
      });

      if (addBookResponse.ok) {
        console.log("✅ Book creation workflow working");
      } else {
        console.log(`❌ Book creation failed: ${addBookResponse.status}`);
      }
    } catch (error) {
      console.log(`❌ Workflow test failed: ${error.message}`);
    }

    console.log("\n🎉 AKS deployment testing complete!");
    console.log(`\n🌐 Application URLs:`);
    console.log(`- Frontend: ${baseURL}`);
    console.log(`- API Health: ${baseURL}/health`);
    console.log(`- Books API: ${baseURL}/api/books`);

    // Get pod status
    console.log("\n📊 Pod Status:");
    try {
      const podStatus = execSync("kubectl get pods", { encoding: "utf8" });
      console.log(podStatus);
    } catch (error) {
      console.log("Could not get pod status");
    }
  } catch (error) {
    console.error("❌ AKS deployment test failed:", error.message);
    console.log("\n💡 Troubleshooting commands:");
    console.log("kubectl get pods");
    console.log("kubectl get services");
    console.log("kubectl logs deployment/lms-backend");
    console.log("kubectl logs deployment/lms-frontend");
  }
}

// Run the test
testAKSDeployment();
