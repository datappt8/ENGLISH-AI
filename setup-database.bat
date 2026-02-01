@echo off
echo ========================================
echo PostgreSQL Database Setup
echo ========================================
echo.

REM 设置 PostgreSQL 路径（请根据实际安装路径修改）
set PSQL_PATH=C:\Program Files\PostgreSQL\18\bin\psql.exe

REM 检查 PostgreSQL 是否存在
if not exist "%PSQL_PATH%" (
    set PSQL_PATH=C:\Program Files\PostgreSQL\16\bin\psql.exe
)

if not exist "%PSQL_PATH%" (
    echo [ERROR] PostgreSQL not found!
    echo Please install PostgreSQL or update PSQL_PATH in this script.
    pause
    exit /b 1
)

echo [INFO] Found PostgreSQL at: %PSQL_PATH%
echo.

REM 步骤1: 创建用户
echo [STEP 1/4] Creating PostgreSQL user 'englishai'...
"%PSQL_PATH%" -U postgres -c "CREATE USER englishai WITH PASSWORD 'Englishai';" 2>nul
if %errorlevel% equ 0 (
    echo [SUCCESS] User created
) else (
    echo [INFO] User may already exist, continuing...
)
echo.

REM 步骤2: 授予权限
echo [STEP 2/4] Granting privileges...
"%PSQL_PATH%" -U postgres -c "ALTER USER englishai CREATEDB;" 2>nul
echo [SUCCESS] Privileges granted
echo.

REM 步骤3: 初始化数据库
echo [STEP 3/4] Initializing database...
"%PSQL_PATH%" -U postgres -f database\init.sql
if %errorlevel% equ 0 (
    echo [SUCCESS] Database initialized
) else (
    echo [ERROR] Database initialization failed
    pause
    exit /b 1
)
echo.

REM 步骤4: 插入种子数据
echo [STEP 4/4] Inserting seed data...
"%PSQL_PATH%" -U postgres -d englishai -f database\seed.sql
if %errorlevel% equ 0 (
    echo [SUCCESS] Seed data inserted
) else (
    echo [ERROR] Seed data insertion failed
    pause
    exit /b 1
)
echo.

echo ========================================
echo Database Setup Complete!
echo ========================================
echo.
echo Database Name: englishai
echo Username: englishai
echo Password: Englishai
echo.
echo You can now start the backend server:
echo   npm run dev:backend
echo.
pause
