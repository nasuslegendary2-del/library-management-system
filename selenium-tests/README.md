# Selenium Automated Tests - Library Management System

## Overview

Automated test suite using Selenium WebDriver to test the Library Management System web application.

## Test Cases Covered

### 1. **Load Home Page**

- Verifies application loads correctly
- Captures homepage screenshot
- Validates page title and main heading

### 2. **Add New Book**

- Tests book addition functionality
- Fills form with test data
- Verifies book appears in the system
- Captures form and success screenshots

### 3. **Register New User**

- Tests user registration process
- Validates form submission
- Confirms user creation
- Documents the registration flow

### 4. **Borrow Book Process**

- Tests borrowing functionality
- Navigates through borrowing interface
- Captures borrowing workflow

## Setup & Installation

### Prerequisites

- Node.js (v14 or higher)
- Chrome browser
- Internet connection

### Quick Setup

```bash
# Install dependencies
node install-dependencies.js

# Or manually:
cd selenium-tests
npm install
```

## Running Tests

### Run All Tests

```bash
npm test
```

### Configuration

Edit `test-config.js` to update:

- Application URLs
- Test data
- Browser settings
- Screenshot preferences

## Test Results

### Screenshots

- Automatically saved in `./screenshots/` directory
- Numbered sequentially (01_home_page.png, 02_books_section.png, etc.)
- High-resolution (1920x1080) for clear documentation

### Reports

- **JSON Report**: `screenshots/test-report.json`
- **HTML Report**: `screenshots/test-report.html`
- Console output with real-time results

## Current Configuration

- **Frontend URL**: http://172.188.254.183
- **Backend URL**: http://4.144.173.4:3000
- **Browser**: Chrome (visible mode for screenshots)
- **Timeout**: 10 seconds per action

## Test Data

- **Test Book**: "Selenium Test Book" by "Test Author"
- **Test User**: "Test User Selenium" (selenium.test@example.com)
- **Test ISBN**: 978-0-123-45678-9

## Grading Rubric Compliance

✅ **Minimum 3 Test Cases**: 4 comprehensive test cases  
✅ **Screenshot Documentation**: Automatic screenshot capture  
✅ **Execution Evidence**: HTML and JSON reports  
✅ **Real Application Testing**: Tests live AKS deployment

## Troubleshooting

### Common Issues

1. **Chrome not found**: Install Chrome browser
2. **Network timeout**: Check application URLs in config
3. **Element not found**: Application UI may have changed

### Debug Mode

Set `HEADLESS: false` in `test-config.js` to see browser actions in real-time.

## Integration with CI/CD

Tests can be integrated into GitHub Actions pipeline for automated execution on deployment.
