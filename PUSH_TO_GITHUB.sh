#!/bin/bash

# QueryCraft AI - GitHub Push Script
# This script will push your code to GitHub repository

echo "🚀 QueryCraft AI - GitHub Push Script"
echo "======================================"
echo ""

# Check if git is installed
if ! command -v git &> /dev/null; then
    echo "❌ Git is not installed. Please install git first."
    exit 1
fi

echo "📦 Preparing to push to GitHub..."
echo ""

# Remove old git folder if exists
if [ -d ".git" ]; then
    echo "🗑️  Removing old git history..."
    rm -rf .git
fi

# Initialize fresh git repo
echo "✨ Initializing fresh git repository..."
git init
git branch -M main

# Configure git user (you can change these)
git config user.name "smike2023"
git config user.email "smike2023@users.noreply.github.com"

# Add all files
echo "📝 Adding all files..."
git add .

# Create commit
echo "💾 Creating commit..."
git commit -m "Initial commit: QueryCraft AI - Professional MongoDB Platform with 8 Tools

- Connection Manager
- Query Builder  
- Aggregation Pipeline Builder
- Template Library
- Query History & Analytics
- Results Explorer
- NOSQL to SQL Converter
- SQL to NOSQL Converter

Built with React, TypeScript, Supabase, and OpenAI GPT-4"

# Add remote
echo "🔗 Adding remote repository..."
git remote add origin https://github.com/smike2023/querycraft-ai.git

echo ""
echo "⚠️  IMPORTANT: You will be prompted for authentication"
echo "    Use your GitHub username and Personal Access Token"
echo ""
echo "    Username: smike2023"
echo "    Password: [Your Personal Access Token]"
echo ""
read -p "Press ENTER to continue with push..."

# Push to GitHub
echo ""
echo "🚀 Pushing to GitHub..."
git push -u origin main --force

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ SUCCESS! Your code is now on GitHub!"
    echo "🌐 Visit: https://github.com/smike2023/querycraft-ai"
    echo ""
else
    echo ""
    echo "❌ Push failed. Please check your GitHub credentials."
    echo ""
    echo "To create a Personal Access Token:"
    echo "1. Go to https://github.com/settings/tokens"
    echo "2. Click 'Generate new token (classic)'"
    echo "3. Check the 'repo' scope"
    echo "4. Copy the token and use it as your password"
    echo ""
fi
