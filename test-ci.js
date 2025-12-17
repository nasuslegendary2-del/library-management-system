// Simple CI test script
const fs = require("fs");
const path = require("path");

console.log("🧪 Running CI Tests...\n");

// Test 1: Check required files exist
const requiredFiles = [
  "server.js",
  "package.json",
  "Dockerfile.backend",
  "Dockerfile.frontend",
  "docker-compose.yml",
  "public/index.html",
  "routes/books.js",
  "routes/users.js",
  "routes/borrowings.js",
];

let allFilesExist = true;

requiredFiles.forEach((file) => {
  if (fs.existsSync(file)) {
    console.log(`✅ ${file} exists`);
  } else {
    console.log(`❌ ${file} missing`);
    allFilesExist = false;
  }
});

// Test 2: Check package.json structure
try {
  const packageJson = JSON.parse(fs.readFileSync("package.json", "utf8"));

  if (packageJson.name && packageJson.dependencies) {
    console.log("✅ package.json structure valid");
  } else {
    console.log("❌ package.json structure invalid");
    allFilesExist = false;
  }

  // Check required dependencies
  const requiredDeps = ["express", "cors", "pg", "dotenv"];
  requiredDeps.forEach((dep) => {
    if (packageJson.dependencies[dep]) {
      console.log(`✅ Dependency ${dep} found`);
    } else {
      console.log(`❌ Dependency ${dep} missing`);
      allFilesExist = false;
    }
  });
} catch (error) {
  console.log("❌ Error reading package.json:", error.message);
  allFilesExist = false;
}

// Test 3: Check Kubernetes manifests
const k8sFiles = [
  "k8s/backend-deployment.yaml",
  "k8s/frontend-deployment.yaml",
  "k8s/database-deployment.yaml",
];

k8sFiles.forEach((file) => {
  if (fs.existsSync(file)) {
    console.log(`✅ ${file} exists`);
  } else {
    console.log(`❌ ${file} missing`);
    allFilesExist = false;
  }
});

// Final result
if (allFilesExist) {
  console.log("\n🎉 All CI tests passed!");
  process.exit(0);
} else {
  console.log("\n❌ Some CI tests failed!");
  process.exit(1);
}
