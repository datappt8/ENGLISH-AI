# 🔧 手机访问故障排查

## 当前服务器状态

✅ **前端服务器**: `https://192.168.1.245:5177`
✅ **服务器正在运行**: 端口 5177 已监听
✅ **本地测试通过**: curl 可以访问

## 手机访问检查清单

### 1. 确认手机和电脑在同一WiFi网络

**检查方法**:
- 电脑和手机必须连接到同一个WiFi
- 不能一个用WiFi，一个用移动数据

### 2. 确认IP地址正确

**当前IP**: `192.168.1.245`

**验证方法**:
```bash
# 在电脑上运行
ipconfig
# 查找 "无线局域网适配器 WLAN" 下的 IPv4 地址
```

### 3. 确认防火墙允许访问

**Windows防火墙可能阻止了端口5177**

**解决方法**:
1. 打开 Windows 设置
2. 搜索"防火墙"
3. 点击"允许应用通过防火墙"
4. 找到 Node.js 或允许端口 5177

**快速测试** - 临时关闭防火墙:
```bash
# 以管理员身份运行
netsh advfirewall set allprofiles state off
```

### 4. 手机浏览器访问步骤

**正确的访问流程**:

1. 在手机浏览器地址栏输入:
   ```
   https://192.168.1.245:5177
   ```

2. 会看到证书警告（正常现象）

3. **iOS Safari**:
   - 点击"显示详细信息"
   - 点击"访问此网站"
   - 再次点击"访问此网站"确认

4. **Android Chrome**:
   - 点击"高级"
   - 点击"继续前往 192.168.1.245（不安全）"

5. 应该能看到游戏页面

### 5. 常见错误及解决方案

#### 错误1: "无法访问此网站" / "ERR_CONNECTION_REFUSED"

**原因**:
- 不在同一WiFi
- 防火墙阻止
- IP地址错误

**解决**:
```bash
# 1. 确认IP地址
ipconfig

# 2. 测试端口是否开放
netstat -ano | findstr 5177

# 3. 临时关闭防火墙测试
# Windows设置 → 防火墙 → 关闭
```

#### 错误2: "ERR_SSL_PROTOCOL_ERROR"

**原因**: SSL证书问题

**解决**:
```bash
# 重新生成证书
cd frontend
del cert.pem key.pem
openssl req -x509 -newkey rsa:2048 -keyout key.pem -out cert.pem -days 365 -nodes -subj "//CN=192.168.1.245"

# 重启服务器
npm run dev
```

#### 错误3: "找不到页面" / "404 Not Found"

**原因**:
- 访问了错误的路径
- 服务器未正确启动

**解决**:
- 确保访问根路径: `https://192.168.1.245:5177/`（注意最后的斜杠）
- 不要访问: `https://192.168.1.245:5177/game`（首次访问）

#### 错误4: 页面空白或加载很久

**原因**:
- 网络慢
- 资源加载失败

**解决**:
- 打开手机浏览器的开发者工具（如果支持）
- 查看控制台错误
- 尝试刷新页面

### 6. 快速诊断命令

在电脑上运行这些命令来诊断问题:

```bash
# 1. 确认服务器运行
netstat -ano | findstr 5177

# 2. 测试本地访问
curl -k https://localhost:5177

# 3. 测试局域网访问
curl -k https://192.168.1.245:5177

# 4. 查看防火墙规则
netsh advfirewall firewall show rule name=all | findstr 5177
```

### 7. 替代方案

如果HTTPS一直有问题，可以使用以下替代方案:

#### 方案A: 使用ngrok（推荐）

```bash
# 1. 下载 ngrok: https://ngrok.com/download
# 2. 运行
ngrok http 5177

# 3. 会得到一个 https:// 开头的公网地址
# 4. 在手机上访问这个地址
```

#### 方案B: 使用localtunnel

```bash
# 1. 安装
npm install -g localtunnel

# 2. 运行
lt --port 5177

# 3. 会得到一个公网地址
```

#### 方案C: 部署到Vercel（生产环境）

```bash
# 1. 安装 Vercel CLI
npm install -g vercel

# 2. 部署
cd frontend
vercel

# 3. 会得到一个 https:// 的正式地址
```

## 推荐的测试流程

1. **先在电脑浏览器测试**
   - 访问 `https://localhost:5177`
   - 确认页面正常显示

2. **确认网络连接**
   - 电脑和手机连接同一WiFi
   - 记下电脑的IP地址

3. **临时关闭防火墙**
   - Windows设置 → 防火墙 → 关闭
   - 测试完成后记得重新开启

4. **手机访问**
   - 输入 `https://192.168.1.245:5177`
   - 信任证书
   - 测试麦克风

5. **如果还是不行**
   - 使用 ngrok 或 localtunnel
   - 或者部署到 Vercel

## 需要更多帮助？

请告诉我:
1. 手机上显示的具体错误信息
2. 手机的操作系统（iOS/Android）
3. 使用的浏览器（Safari/Chrome/其他）
4. 电脑和手机是否在同一WiFi

我会根据具体情况提供解决方案。
