# 🛠️ GitHub管理环境配置指南

## 📋 当前环境检查

### ✅ 已安装
- **Git**: 已安装并可用
- **Git仓库**: 已初始化

### 需要配置的内容

---

## 🔧 必需配置

### 1. Git基本配置

如果还没有配置Git用户信息，需要运行：

```bash
# 配置用户名（显示在提交记录中）
git config --global user.name "Your Name"

# 配置邮箱（与GitHub账号关联）
git config --global user.email "your.email@example.com"

# 验证配置
git config --global --list
```

### 2. GitHub认证方式（选择一种）

#### 方式A: HTTPS + Personal Access Token（推荐，简单）

**步骤**:
1. 访问 GitHub Settings → Developer settings → Personal access tokens → Tokens (classic)
   - 直接链接: https://github.com/settings/tokens
2. 点击 "Generate new token (classic)"
3. 设置：
   - Note: `Talkgame Development`
   - Expiration: 90 days（或自定义）
   - 勾选权限：
     - ✅ `repo` (完整仓库访问)
     - ✅ `workflow` (GitHub Actions)
     - ✅ `write:packages` (如果需要发布包)
4. 生成并**复制Token**（只显示一次！）
5. 推送时使用Token作为密码

```bash
# 推送时会要求输入用户名和密码
git push -u origin main
# Username: your_github_username
# Password: 粘贴你的Personal Access Token
```

**保存Token（可选）**:
```bash
# Windows上保存凭据
git config --global credential.helper wincred

# 或使用Git Credential Manager
git config --global credential.helper manager
```

#### 方式B: SSH密钥（更安全，一次配置）

**步骤**:
1. 生成SSH密钥：
```bash
# 生成新的SSH密钥
ssh-keygen -t ed25519 -C "your.email@example.com"
# 按Enter使用默认位置，设置密码（可选）
```

2. 复制公钥：
```bash
# Windows
cat ~/.ssh/id_ed25519.pub | clip

# 或手动查看
cat ~/.ssh/id_ed25519.pub
```

3. 添加到GitHub：
   - 访问 https://github.com/settings/keys
   - 点击 "New SSH key"
   - Title: `Talkgame Dev Machine`
   - Key: 粘贴公钥内容
   - 点击 "Add SSH key"

4. 测试连接：
```bash
ssh -T git@github.com
# 应该看到: Hi username! You've successfully authenticated...
```

5. 使用SSH URL推送：
```bash
git remote set-url origin git@github.com:YOUR_USERNAME/talkgame.git
git push -u origin main
```

---

## 🚀 可选但推荐：GitHub CLI

### 什么是GitHub CLI？
GitHub官方命令行工具，可以直接在终端管理GitHub仓库、Issues、PR等。

### 安装GitHub CLI

#### Windows
```bash
# 使用winget
winget install --id GitHub.cli

# 或使用scoop
scoop install gh

# 或下载安装包
# https://github.com/cli/cli/releases
```

#### 验证安装
```bash
gh --version
```

### 配置GitHub CLI
```bash
# 登录GitHub
gh auth login

# 选择：
# - GitHub.com
# - HTTPS
# - Yes (authenticate Git)
# - Login with a web browser
# 然后在浏览器中授权
```

### GitHub CLI的优势

使用GitHub CLI后，我可以帮您：

```bash
# 创建仓库（无需手动在网页操作）
gh repo create talkgame --public --description "🎮 Talk, Play, Master English"

# 查看仓库状态
gh repo view

# 创建Issue
gh issue create --title "Bug: XXX" --body "描述"

# 创建PR
gh pr create --title "Feature: XXX"

# 查看Actions状态
gh run list

# 克隆仓库
gh repo clone YOUR_USERNAME/talkgame
```

---

## 📦 我可以帮您做的GitHub操作

### 有GitHub CLI的情况（推荐）

我可以完全自动化：
- ✅ 创建仓库
- ✅ 推送代码
- ✅ 创建Issues
- ✅ 创建Pull Requests
- ✅ 管理Releases
- ✅ 查看Actions状态
- ✅ 管理仓库设置

### 没有GitHub CLI的情况

我可以：
- ✅ 管理本地Git操作（commit, branch, merge等）
- ✅ 准备推送命令
- ✅ 生成Issue/PR模板
- ⚠️ 需要您手动在GitHub网页上创建仓库
- ⚠️ 需要您手动推送代码

---

## 🎯 推荐配置方案

### 方案1: 最简单（适合快速开始）
```bash
# 1. 配置Git用户信息
git config --global user.name "Your Name"
git config --global user.email "your@email.com"

# 2. 在GitHub网页创建仓库
# 访问 https://github.com/new

# 3. 使用HTTPS推送（会要求输入Token）
git remote add origin https://github.com/YOUR_USERNAME/talkgame.git
git push -u origin main
```

### 方案2: 最强大（推荐）
```bash
# 1. 配置Git用户信息
git config --global user.name "Your Name"
git config --global user.email "your@email.com"

# 2. 安装GitHub CLI
winget install --id GitHub.cli

# 3. 登录GitHub CLI
gh auth login

# 4. 我可以帮您自动创建仓库并推送
gh repo create talkgame --public --source=. --push
```

---

## ✅ 配置检查清单

完成以下配置后，我就可以完全管理GitHub了：

### 必需配置
- [ ] Git已安装
- [ ] Git用户名已配置
- [ ] Git邮箱已配置
- [ ] GitHub账号已创建
- [ ] 认证方式已选择（Token或SSH）

### 推荐配置
- [ ] GitHub CLI已安装
- [ ] GitHub CLI已登录
- [ ] Git凭据已保存（避免重复输入密码）

---

## 🚀 快速配置命令

### 一键配置脚本（复制粘贴运行）

```bash
# 配置Git用户信息（替换为您的信息）
git config --global user.name "Your Name"
git config --global user.email "your@email.com"

# 配置凭据保存
git config --global credential.helper manager

# 查看配置
git config --global --list

# 如果要安装GitHub CLI
winget install --id GitHub.cli

# 登录GitHub CLI
gh auth login
```

---

## 💡 我的建议

### 如果您想让我完全管理GitHub：

**推荐安装GitHub CLI**，这样我可以：
1. 自动创建仓库
2. 自动推送代码
3. 自动创建Issues和PR
4. 自动管理Releases
5. 查看CI/CD状态

### 如果不想安装额外工具：

**只需配置Git基本信息和Token**，然后：
1. 您手动在GitHub网页创建仓库
2. 我准备推送命令
3. 您运行命令推送代码
4. 之后的Git操作我都可以帮您管理

---

## 🎯 现在该做什么？

### 选项1: 完整配置（推荐）
```bash
# 运行这些命令
git config --global user.name "Your Name"
git config --global user.email "your@email.com"
winget install --id GitHub.cli
gh auth login
```
然后告诉我："配置完成"，我就可以帮您自动创建仓库并推送！

### 选项2: 简单配置
```bash
# 只配置Git
git config --global user.name "Your Name"
git config --global user.email "your@email.com"
```
然后：
1. 您在GitHub网页创建仓库
2. 告诉我仓库URL
3. 我帮您推送代码

---

**您想选择哪个方案？或者需要我详细解释某个步骤？** 🤔
