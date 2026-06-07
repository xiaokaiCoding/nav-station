# 个人导航站

个人网站快捷导航站，支持分类管理、搜索过滤、后台 CRUD 操作。

## 技术栈

- **前端**: Next.js 14 + React + Tailwind CSS
- **后端**: Node.js + Express
- **数据库**: MySQL 8.0

## 快速开始

### 1. 启动 MySQL

```bash
docker-compose up -d
```

或者手动启动 MySQL，然后执行 `backend/sql/init.sql` 初始化数据库。

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
│   │   ├── components/ # 组件
│   │   └── lib/        # 工具
│   └── ...
├── backend/            # Express 后端
│   ├── src/
│   │   ├── routes/     # API 路由
│   │   ├── controllers/ # 业务逻辑
│   │   ├── middleware/ # 中间件
│   │   └── db.js       # 数据库连接
│   └── sql/init.sql    # 数据库初始化
└── docker-compose.yml  # MySQL 容器
```
