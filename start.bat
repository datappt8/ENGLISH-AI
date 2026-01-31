@echo off
REM English Quest - Windows Startup Script
REM This script starts both frontend and backend development servers

setlocal enabledelayedexpansion

echo ==================================
echo English Quest - Starting Development Servers
echo ==================================
echo.

REM Get script directory
set "SCRIPT_DIR=%~dp0"
cd /d "%SCRIPT_DIR%"

REM Check if node_modules exists
if not exist "node_modules" (
    echo Error: Dependencies not installed
    echo Please run install.bat first
    exit /b 1
)

echo Starting development servers...
echo Frontend: http://localhost:5173
echo Backend: http://localhost:3000
echo.
echo Press Ctrl+C to stop all servers
echo.

REM Start both servers using npm-run-all
call npm run dev

endlocal
