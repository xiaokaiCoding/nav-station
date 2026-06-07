# 个人导航站

个人网站快捷导航站，支持分类管理、搜索过滤、后台 CRUD 操作。

## 技术栈

- **前端**: Next.js 14 + React + Tailwind CSS
- **后端**: Node.js + Express
- **数据库**: MySQL 8.0（腾讯云服务器）

## 快速开始

### 1. 建立 SSH 隧道（连接腾讯服务器 MySQL）

```bash
ssh -i /Users/zyb/Downloads/2026_0606.pem -N -L 3306:localhost:3306 root@124.222.246.46
```

保持终端运行，不要关闭。

### 2. 启动后端

```bash
cd backend
npm install
npm run dev
```

后端运行在 http://localhost:4000

### 3. 启动前端

```bash
cd frontend
npm install
npm run dev
```

前端运行在 http://localhost:3000

## 功能

- **首页**: 按分类展示书签卡片，顶部搜索框实时过滤
- **管理后台**: 点击首页右上角"管理"按钮进入，支持分类和书签的增删改查
- **书签**: 点击书签卡片新窗口打开链接

## 目录结构

```
nav-station/
├── frontend/           # Next.js 前端
│   ├── src/
│   │   ├── app/        # 页面
│   │   └── components/ # 组件
│   └── ...
├── backend/            # Express 后端
│   ├── src/
│   │   ├── routes/     # API 路由
│   │   ├── controllers/ # 业务逻辑
│   │   └── db.js       # 数据库连接
│   └── sql/init.sql    # 数据库初始化
└── docker-compose.yml  # 本地开发可选 MySQL 配置（当前使用远程服务器）
```
