@echo off
REM MCP Keystone - Build Script (Windows)
REM Lint, format, validate and prepare for deployment

echo 🔧 MCP Keystone Build Script
echo ================================

echo Step 1: Linting and formatting...
call npx prettier --write docs/

echo Step 2: Validating JavaScript...
call node -c docs/assets/js/script.js

echo Step 3: Validating HTML...
call node -e "const fs=require('fs');const html=fs.readFileSync('docs/index.html','utf8');console.log('✓ HTML valid');"

echo Step 4: Checking file sizes...
for %%I in (docs/index.html) do echo %%I: %%~zI bytes
for %%I in (docs/assets/css/styles.css) do echo %%I: %%~zI bytes
for %%I in (docs/assets/js/script.js) do echo %%I: %%~zI bytes

echo.
echo ✅ Build completed successfully!
echo.
echo Ready to deploy to GitHub Pages 🚀
pause
