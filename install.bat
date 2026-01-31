@echo off
REM English Quest - Windows Installation Script
REM This script installs dependencies for all modules

setlocal enabledelayedexpansion

echo ==================================
echo English Quest - Installation
echo ==================================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo Error: Node.js is not installed
    echo Please install Node.js ^(^>=18.0.0^) from https://nodejs.org/
    exit /b 1
)

echo Node.js version:
node -v
echo NPM version:
npm -v
echo.

REM Get script directory
set "SCRIPT_DIR=%~dp0"
cd /d "%SCRIPT_DIR%"

REM Install root dependencies
echo Installing root dependencies...
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo Error: Failed to install root dependencies
    exit /b 1
)
echo Root dependencies installed successfully!
echo.

REM Install frontend dependencies
if exist "frontend" (
    echo Installing Frontend dependencies...
    cd frontend
    call npm install
    if %ERRORLEVEL% NEQ 0 (
        echo Error: Failed to install frontend dependencies
        exit /b 1
    )
    cd ..
    echo Frontend dependencies installed successfully!
    echo.
) else (
    echo Warning: frontend directory not found
)

REM Install backend dependencies
if exist "backend" (
    echo Installing Backend dependencies...
    cd backend
    call npm install
    if %ERRORLEVEL% NEQ 0 (
        echo Error: Failed to install backend dependencies
        exit /b 1
    )
    cd ..
    echo Backend dependencies installed successfully!
    echo.
) else (
    echo Warning: backend directory not found
)

echo ==================================
echo Installation completed successfully!
echo ==================================
echo.
echo Next steps:
echo   1. Copy .env.example to .env in frontend and backend directories
echo   2. Configure your environment variables
echo   3. Run 'npm run dev' to start development servers
echo.

endlocal
