-- 数据库快速安装 SQL 脚本
-- 在 pgAdmin 4 的 Query Tool 中运行此脚本

-- 步骤1: 创建用户
CREATE USER englishai WITH PASSWORD 'Englishai';
ALTER USER englishai CREATEDB;

-- 步骤2: 创建数据库
CREATE DATABASE englishai
  WITH ENCODING 'UTF8'
  OWNER englishai;

-- 步骤3: 连接到新数据库
-- 在 pgAdmin 中：右键 "englishai" 数据库 -> Query Tool
-- 然后运行 database/init.sql 的内容（从 \c englishai; 之后的部分）
-- 最后运行 database/seed.sql 的内容（从 \c englishai; 之后的部分）

-- 完成！
