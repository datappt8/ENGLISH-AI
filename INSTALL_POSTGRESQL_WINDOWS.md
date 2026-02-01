# PostgreSQL Windows 安装指南

## 📥 第一步：下载 PostgreSQL

1. 访问官网下载页面：https://www.postgresql.org/download/windows/
2. 点击 "Download the installer"
3. 选择最新版本（推荐 PostgreSQL 16.x 或更高，**支持 18.1**）
4. 下载适合你系统的版本（通常是 Windows x86-64）

**直接下载链接**：
https://www.enterprisedb.com/downloads/postgres-postgresql-downloads

**✅ 版本兼容性**：
- PostgreSQL 12.x ~ 18.x 都支持
- 推荐使用最新稳定版（16.x 或 18.1）

---

## 🔧 第二步：安装 PostgreSQL

### 安装步骤

1. **运行安装程序**
   - 双击下载的 `.exe` 文件
   - 如果弹出 UAC 提示，点击"是"

2. **选择安装目录**
   - 默认：`C:\Program Files\PostgreSQL\16` (或 `\18` 如果安装 18.1)
   - 建议保持默认

3. **选择组件**（全部勾选）
   - ✅ PostgreSQL Server
   - ✅ pgAdmin 4（图形化管理工具）
   - ✅ Stack Builder（可选）
   - ✅ Command Line Tools

4. **选择数据目录**
   - 默认：`C:\Program Files\PostgreSQL\16\data` (或 `\18\data`)
   - 建议保持默认

5. **设置超级用户密码** ⚠️ **重要！**
   - 输入一个强密码（例如：`postgres123`）
   - **记住这个密码！** 你需要在后面配置中使用

6. **选择端口**
   - 默认：`5432`
   - 建议保持默认

7. **选择区域设置**
   - 选择 `Chinese, China` 或 `Default locale`

8. **完成安装**
   - 点击 "Next" 完成安装
   - 取消勾选 "Launch Stack Builder"（暂时不需要）

---

## ✅ 第三步：验证安装

### 方法1：使用 pgAdmin 4

1. 打开 pgAdmin 4（开始菜单搜索 "pgAdmin"）
2. 首次打开会要求设置主密码
3. 左侧展开 "Servers" → "PostgreSQL 16"
4. 输入你设置的密码
5. 如果能看到数据库列表，说明安装成功！

### 方法2：使用命令行

打开 Git Bash 或 PowerShell：

```bash
# 添加 PostgreSQL 到环境变量（如果还没有）
# 在 PowerShell 中运行（根据你的版本调整路径）：
$env:Path += ";C:\Program Files\PostgreSQL\16\bin"  # PG 16
# 或
$env:Path += ";C:\Program Files\PostgreSQL\18\bin"  # PG 18

# 测试连接
psql -U postgres -c "SELECT version();"
```

如果显示 PostgreSQL 版本信息（如 `PostgreSQL 18.1` 或 `16.x`），说明安装成功！

---

## 🗄️ 第四步：初始化项目数据库

### 在 Git Bash 中运行：

```bash
# 1. 进入项目目录
cd /d/ENGLISH-AI

# 2. 运行初始化脚本
psql -U postgres -f database/init.sql

# 输入密码后，等待执行完成
# 看到 "✅ 数据库初始化完成！" 表示成功

# 3. 插入种子数据
psql -U postgres -d english_quest_mvp -f database/seed.sql

# 看到 "✅ 种子数据插入完成！" 表示成功
```

### 如果遇到 psql 命令找不到：

**方法1：添加到系统环境变量**

1. 右键"此电脑" → "属性" → "高级系统设置"
2. 点击"环境变量"
3. 在"系统变量"中找到 `Path`，点击"编辑"
4. 点击"新建"，添加（根据你的版本）：
   - `C:\Program Files\PostgreSQL\16\bin` (PG 16)
   - `C:\Program Files\PostgreSQL\18\bin` (PG 18)
5. 点击"确定"保存
6. **重启 Git Bash**

**方法2：使用完整路径**

```bash
# PG 16
"/c/Program Files/PostgreSQL/16/bin/psql" -U postgres -f database/init.sql

# PG 18
"/c/Program Files/PostgreSQL/18/bin/psql" -U postgres -f database/init.sql
```

---

## ⚙️ 第五步：配置项目环境变量

编辑 `backend/.env` 文件，更新数据库密码：

```env
# Database - PostgreSQL
DB_HOST=localhost
DB_PORT=5432
DB_NAME=english_quest_mvp
DB_USER=postgres
DB_PASSWORD=你设置的密码  # ⚠️ 改成你在安装时设置的密码
```

---

## 🚀 第六步：测试数据库连接

```bash
# 启动后端服务器
cd backend
npm run dev
```

如果看到类似以下输出，说明数据库连接成功：

```
✅ PostgreSQL connected successfully
🚀 Server running on http://localhost:5000
```

---

## 🔍 常见问题

### 1. psql 命令找不到

**解决方案**：
- 确保已添加 PostgreSQL 到系统环境变量
- 重启终端/Git Bash
- 或使用完整路径运行命令

### 2. 密码认证失败

**错误信息**：`password authentication failed for user "postgres"`

**解决方案**：
- 确认密码输入正确
- 检查 `backend/.env` 中的 `DB_PASSWORD` 是否正确

### 3. 端口被占用

**错误信息**：`Port 5432 is already in use`

**解决方案**：
```bash
# 检查是否有其他 PostgreSQL 实例在运行
netstat -ano | findstr :5432

# 停止 PostgreSQL 服务（根据你的版本）
net stop postgresql-x64-16   # PG 16
net stop postgresql-x64-18   # PG 18

# 重新启动
net start postgresql-x64-16  # PG 16
net start postgresql-x64-18  # PG 18
```

### 4. 数据库已存在

**错误信息**：`database "english_quest_mvp" already exists`

**解决方案**：
```bash
# 删除现有数据库并重新创建
psql -U postgres -c "DROP DATABASE IF EXISTS english_quest_mvp;"
psql -U postgres -f database/init.sql
psql -U postgres -d english_quest_mvp -f database/seed.sql
```

---

## 📊 使用 pgAdmin 4 管理数据库

### 连接到数据库

1. 打开 pgAdmin 4
2. 展开 "Servers" → "PostgreSQL 16"
3. 展开 "Databases" → "english_quest_mvp"
4. 右键点击 "Tables" 查看所有表

### 查看数据

1. 右键点击表名（如 `users`）
2. 选择 "View/Edit Data" → "All Rows"
3. 可以查看和编辑数据

### 执行 SQL 查询

1. 右键点击 "english_quest_mvp"
2. 选择 "Query Tool"
3. 输入 SQL 查询，点击 ▶️ 执行

---

## 🎯 下一步

数据库配置完成后：

1. ✅ 启动后端：`npm run dev:backend`
2. ✅ 启动前端：`npm run dev:frontend`
3. ✅ 访问：http://localhost:5173

---

## 📞 需要帮助？

如果遇到问题：
1. 检查 PostgreSQL 服务是否运行
2. 确认密码配置正确
3. 查看后端日志输出
4. 参考项目 `SETUP.md` 文档
