@echo off
echo ========================================
echo PostgreSQL Database Setup (Interactive)
echo ========================================
echo.

REM 设置 PostgreSQL 路径
set PSQL_PATH=C:\Program Files\PostgreSQL\18\bin\psql.exe

if not exist "%PSQL_PATH%" (
    set PSQL_PATH=C:\Program Files\PostgreSQL\16\bin\psql.exe
)

if not exist "%PSQL_PATH%" (
    echo [ERROR] PostgreSQL not found!
    pause
    exit /b 1
)

echo [INFO] Found PostgreSQL at: %PSQL_PATH%
echo.

REM 提示输入 postgres 密码
echo Please enter your PostgreSQL 'postgres' user password:
set /p PGPASSWORD=Password:
echo.

REM 导出密码环境变量
set PGPASSWORD=%PGPASSWORD%

echo [STEP 1/4] Creating user 'englishai'...
"%PSQL_PATH%" -U postgres -c "CREATE USER englishai WITH PASSWORD 'Englishai';"
if %errorlevel% neq 0 (
    echo [INFO] User may already exist, continuing...
)

echo [STEP 2/4] Granting privileges...
"%PSQL_PATH%" -U postgres -c "ALTER USER englishai CREATEDB;"

echo [STEP 3/4] Initializing database...
"%PSQL_PATH%" -U postgres -f database\init.sql
if %errorlevel% neq 0 (
    echo [ERROR] Failed!
    pause
    exit /b 1
)

echo [STEP 4/4] Inserting seed data...
"%PSQL_PATH%" -U postgres -d englishai -f database\seed.sql
if %errorlevel% neq 0 (
    echo [ERROR] Failed!
    pause
    exit /b 1
)

echo.
echo ========================================
echo SUCCESS! Database Setup Complete!
echo ========================================
echo.
echo Database: englishai
echo Username: englishai
echo Password: Englishai
echo.
echo Start backend: npm run dev:backend
echo.
pause
