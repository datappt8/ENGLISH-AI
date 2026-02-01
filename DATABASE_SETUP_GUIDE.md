# 🚀 数据库快速安装指南

## 方法1：使用 pgAdmin 4（最简单）⭐

1. **打开 pgAdmin 4**（开始菜单搜索）

2. **连接到 PostgreSQL**
   - 展开左侧 "Servers" → "PostgreSQL 18"
   - 输入你安装时设置的密码

3. **创建用户**
   - 右键 "Login/Group Roles" → "Create" → "Login/Group Role"
   - General 标签：Name = `englishai`
   - Definition 标签：Password = `Englishai`
   - Privileges 标签：勾选 "Can login?" 和 "Create databases?"
   - 点击 "Save"

4. **运行初始化脚本**
   - 右键 "Databases" → "Create" → "Database"
   - Database = `englishai`
   - Owner = `englishai`
   - 点击 "Save"

5. **执行 SQL 脚本**
   - 右键数据库 "englishai" → "Query Tool"
   - 点击 "Open File" 图标
   - 选择 `D:\ENGLISH-AI\database\init.sql`
   - 点击 ▶️ 执行
   - 再打开 `D:\ENGLISH-AI\database\seed.sql`
   - 点击 ▶️ 执行

---

## 方法2：使用命令行

**在 Windows 命令提示符（CMD）中运行**：

```cmd
cd D:\ENGLISH-AI

REM 设置密码环境变量（替换为你的 postgres 密码）
set PGPASSWORD=你的postgres密码

REM 创建用户
"C:\Program Files\PostgreSQL\18\bin\psql.exe" -U postgres -c "CREATE USER englishai WITH PASSWORD 'Englishai';"
"C:\Program Files\PostgreSQL\18\bin\psql.exe" -U postgres -c "ALTER USER englishai CREATEDB;"

REM 初始化数据库
"C:\Program Files\PostgreSQL\18\bin\psql.exe" -U postgres -f database\init.sql

REM 插入种子数据
"C:\Program Files\PostgreSQL\18\bin\psql.exe" -U postgres -d englishai -f database\seed.sql

echo 完成！
```

---

## 方法3：修改后的自动脚本

我已经创建了 `setup-database-interactive.bat`，双击运行它会提示你输入密码。

---

## ✅ 验证安装

安装完成后，在 CMD 中运行：

```cmd
set PGPASSWORD=Englishai
"C:\Program Files\PostgreSQL\18\bin\psql.exe" -U englishai -d englishai -c "SELECT COUNT(*) FROM quest_templates;"
```

应该显示：`count = 5`（5个新手村任务）

---

## 🎯 安装完成后

1. 启动后端：`npm run dev:backend`
2. 启动前端：`npm run dev:frontend`
3. 或同时启动：`npm run dev`

---

**推荐使用 pgAdmin 4，最简单直观！**
