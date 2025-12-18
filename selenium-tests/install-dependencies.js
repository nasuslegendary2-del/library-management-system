// Install Selenium dependencies
const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

console.log("📦 Installing Selenium Test Dependencies...");

try {
  // Check if we're in the selenium-tests directory
  const currentDir = process.cwd();
  const seleniumDir = path.join(currentDir, "selenium-tests");

  if (fs.existsSync(seleniumDir)) {
    process.chdir(seleniumDir);
    console.log(`📁 Changed to directory: ${seleniumDir}`);
  }

  // Install dependencies
  console.log("⬇️ Installing npm packages...");
  execSync("npm install", { stdio: "inherit" });

  console.log("✅ Selenium dependencies installed successfully!");
  console.log("\n🚀 Ready to run tests:");
  console.log("   npm test           - Run all test cases");
  console.log("   npm run screenshot - Generate screenshots only");
} catch (error) {
  console.error("❌ Failed to install dependencies:", error.message);
  console.log("\n💡 Manual installation:");
  console.log("   cd selenium-tests");
  console.log("   npm install");
}
