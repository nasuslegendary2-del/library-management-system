@echo off
echo 🚀 Quick GitHub Setup for Library Management System
echo.

REM Check if git is installed
git --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Git is not installed. Please install Git first.
    echo Download from: https://git-scm.com/download/win
    pause
    exit /b 1
)

echo ✅ Git is installed

REM Get GitHub username
set /p GITHUB_USERNAME="Enter your GitHub username: "
if "%GITHUB_USERNAME%"=="" (
    echo ❌ GitHub username is required
    pause
    exit /b 1
)

echo.
echo 📋 Setting up repository for: %GITHUB_USERNAME%
echo Repository URL will be: https://github.com/%GITHUB_USERNAME%/library-management-system

REM Initialize git if not already done
if not exist ".git" (
    echo 🔧 Initializing git repository...
    git init
)

REM Add all files
echo 📦 Adding all files...
git add .

REM Create initial commit
echo 💾 Creating initial commit...
git commit -m "Initial commit: Complete Library Management System with Docker, K8s, and CI/CD"

REM Add remote origin
echo 🔗 Adding remote repository...
git remote remove origin 2>nul
git remote add origin https://github.com/%GITHUB_USERNAME%/library-management-system.git

REM Set main branch
git branch -M main

echo.
echo ✅ Local setup complete!
echo.
echo 📋 Next steps:
echo 1. Create repository on GitHub: https://github.com/new
echo    - Repository name: library-management-system
echo    - Description: Cloud-native Library Management System with Docker, Kubernetes, and CI/CD
echo    - Make it Public
echo    - Do NOT initialize with README (we already have one)
echo.
echo 2. After creating the repository, press any key to push...
pause

REM Push to GitHub
echo 🚀 Pushing to GitHub...
git push -u origin main

if errorlevel 1 (
    echo.
    echo ❌ Push failed. Make sure:
    echo 1. You created the repository on GitHub
    echo 2. The repository name is exactly: library-management-system
    echo 3. You have internet connection
    echo.
    echo 💡 You can also push manually using:
    echo git push -u origin main
) else (
    echo.
    echo 🎉 Successfully pushed to GitHub!
    echo.
    echo 🌐 Your repository: https://github.com/%GITHUB_USERNAME%/library-management-system
    echo.
    echo 📋 Next steps:
    echo 1. Configure GitHub Secrets for CI/CD (see GITHUB-SETUP.md)
    echo 2. Update Docker Hub username in .github/workflows/ci-cd.yml
    echo 3. Test the CI/CD pipeline
)

echo.
pause