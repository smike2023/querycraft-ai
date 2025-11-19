@echo off
REM QueryCraft AI - GitHub Push Script for Windows

echo ========================================
echo QueryCraft AI - GitHub Push Script
echo ========================================
echo.

REM Check if git is installed
git --version >nul 2>&1
if errorlevel 1 (
    echo Git is not installed. Please install git first.
    echo Download from: https://git-scm.com/download/win
    pause
    exit /b 1
)

echo Preparing to push to GitHub...
echo.

REM Remove old git folder if exists
if exist ".git" (
    echo Removing old git history...
    rmdir /s /q ".git"
)

REM Initialize fresh git repo
echo Initializing fresh git repository...
git init
git branch -M main

REM Configure git user
git config user.name "smike2023"
git config user.email "smike2023@users.noreply.github.com"

REM Add all files
echo Adding all files...
git add .

REM Create commit
echo Creating commit...
git commit -m "Initial commit: QueryCraft AI - Professional MongoDB Platform with 8 Tools"

REM Add remote
echo Adding remote repository...
git remote add origin https://github.com/smike2023/querycraft-ai.git

echo.
echo IMPORTANT: You will be prompted for authentication
echo    Use your GitHub username and Personal Access Token
echo.
echo    Username: smike2023
echo    Password: [Your Personal Access Token]
echo.
pause

REM Push to GitHub
echo.
echo Pushing to GitHub...
git push -u origin main --force

if %errorlevel% == 0 (
    echo.
    echo SUCCESS! Your code is now on GitHub!
    echo Visit: https://github.com/smike2023/querycraft-ai
    echo.
) else (
    echo.
    echo Push failed. Please check your GitHub credentials.
    echo.
    echo To create a Personal Access Token:
    echo 1. Go to https://github.com/settings/tokens
    echo 2. Click 'Generate new token (classic)'
    echo 3. Check the 'repo' scope
    echo 4. Copy the token and use it as your password
    echo.
)

pause
