@echo off
title LokNiti AI Platform Launcher
echo ===================================================
echo             LOKNITI AI PLATFORM LAUNCHER           
echo ===================================================
echo.
echo [1/3] Navigating to project directory...
cd /d "%~dp0"

echo [2/3] Starting Vite local development server...
start cmd /k "npm run dev"

echo Waiting 3 seconds for Vite server to boot...
timeout /t 3 /nobreak >nul

echo [3/3] Launching web browser at http://localhost:5173/...
start http://localhost:5173/

echo.
echo ===================================================
echo LokNiti AI is now active and running!
echo You can view logs in the secondary command window.
echo ===================================================
pause
