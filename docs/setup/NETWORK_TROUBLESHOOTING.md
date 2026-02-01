# 🔧 网络连接问题排查指南

## 📱 手机访问电脑服务

### 问题：手机无法访问 localhost

**原因**: `localhost` 只能在本机访问，手机需要使用电脑的IP地址。

### ✅ 解决方案

#### 1. 获取电脑IP地址

**Windows**:
```bash
ipconfig
```
查找 "IPv4 地址"，例如：`192.168.1.100`

**Mac/Linux**:
```bash
ifconfig
```
查找 "inet" 地址

#### 2. 修改前端配置

编辑 `frontend/.env` 文件（如果不存在则创建）:
```bash
VITE_API_BASE_URL=http://你的电脑IP:5000/api
```

例如：
```bash
VITE_API_BASE_URL=http://192.168.1.100:5000/api
```

#### 3. 重启前端服务

```bash
cd frontend
npm run dev
```

#### 4. 手机访问

在手机浏览器输入：
```
http://你的电脑IP:5173
```

例如：
```
http://192.168.1.100:5173
```

### 🔒 防火墙设置

如果还是连不上，需要允许防火墙：

**Windows**:
1. 打开 Windows Defender 防火墙
2. 允许应用通过防火墙
3. 添加端口 5000 和 5173

**Mac**:
```bash
# 允许端口
sudo pfctl -f /etc/pf.conf
```

### 📡 确保同一网络

- 手机和电脑必须连接到同一个WiFi
- 不能使用移动数据

---

## 🌐 API请求失败

### 问题：前端显示 "Network Error"

#### 检查清单

1. **后端是否运行**
   ```bash
   curl http://localhost:5000/api
   ```
   应该返回 404 错误（正常）

2. **前端是否运行**
   ```bash
   curl http://localhost:5173
   ```
   应该返回 HTML

3. **是否已登录**
   - 打开浏览器开发者工具 (F12)
   - 查看 Application → Local Storage
   - 检查是否有 `token`

4. **CORS配置**
   检查 `backend/.env`:
   ```bash
   CORS_ORIGIN=http://localhost:5174
   ```
   应该改为：
   ```bash
   CORS_ORIGIN=http://localhost:5173
   ```

---

## 🚀 快速测试

### 测试后端
```bash
curl http://localhost:5000/api
```
✅ 正常：返回 404 错误
❌ 异常：连接失败

### 测试前端
```bash
curl http://localhost:5173
```
✅ 正常：返回 HTML
❌ 异常：连接失败

### 测试API（需要token）
```bash
# 先注册获取token
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"test123","email":"test123@example.com","password":"Test123456"}'

# 使用返回的token测试
curl http://localhost:5000/api/quests \
  -H "Authorization: Bearer 你的token"
```

---

## 💡 常见问题

### Q1: 手机显示"无法访问此网站"
**A**:
- 检查手机和电脑是否在同一WiFi
- 使用电脑IP而不是localhost
- 检查防火墙设置

### Q2: 显示"Network Error"
**A**:
- 检查是否已登录
- 清除浏览器缓存
- 检查后端服务是否运行

### Q3: 显示"401 Unauthorized"
**A**:
- Token已过期，重新登录
- 检查localStorage中的token

### Q4: 显示"CORS错误"
**A**:
- 检查backend/.env中的CORS_ORIGIN配置
- 重启后端服务

---

## 🔍 调试步骤

### 1. 打开浏览器开发者工具
按 `F12` 或右键 → 检查

### 2. 查看Network标签
- 查看失败的请求
- 检查请求URL是否正确
- 查看响应状态码

### 3. 查看Console标签
- 查看错误信息
- 检查是否有JavaScript错误

### 4. 查看Application标签
- Local Storage → 检查token
- 如果没有token，需要先登录

---

## 📞 获取帮助

### 提供以下信息：

1. **错误信息**
   - 完整的错误提示
   - 浏览器控制台的错误

2. **环境信息**
   - 使用的设备（手机/电脑）
   - 浏览器类型和版本
   - 是否在同一网络

3. **测试结果**
   - 后端测试结果
   - 前端测试结果
   - 是否已登录

---

## ✅ 完整解决方案

### 桌面端使用（推荐）

1. 访问 http://localhost:5173
2. 注册/登录账号
3. 进入游戏页面
4. 开始使用

### 手机端使用

1. 获取电脑IP地址
2. 创建 `frontend/.env`:
   ```
   VITE_API_BASE_URL=http://你的IP:5000/api
   ```
3. 重启前端服务
4. 手机访问 http://你的IP:5173
5. 注册/登录
6. 开始使用

---

**当前服务状态**:
- ✅ 后端: http://localhost:5000 (运行中)
- ✅ 前端: http://localhost:5173 (运行中)
- ✅ 数据库: PostgreSQL (已连接)
- ✅ AI服务: 阿里云通义千问 (已配置)
