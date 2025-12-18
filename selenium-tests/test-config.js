// Selenium Test Configuration
module.exports = {
  // Application URLs (update these with your live URLs)
  FRONTEND_URL: "http://172.188.254.183",
  BACKEND_URL: "http://4.144.173.4:3000",

  // Test settings
  TIMEOUT: 10000,
  SCREENSHOT_DIR: "./screenshots",

  // Browser settings
  BROWSER: "chrome",
  HEADLESS: false, // Set to true for CI/CD

  // Test data
  TEST_BOOK: {
    title: "Selenium Test Book",
    author: "Test Author",
    isbn: "978-0-123-45678-9",
  },

  TEST_USER: {
    name: "Test User Selenium",
    email: "selenium.test@example.com",
    phone: "555-TEST-001",
  },
};
