#!/bin/bash
# 一键部署脚本：推送代码 → 同步到服务器 → 触发 Jenkins 构建
set -e

SERVER="root@124.222.246.46"
SSH_KEY="/Users/zyb/Downloads/2026_0606.pem"
DEPLOY_PATH="/opt/nav-station"

echo "=== 1. 同步代码到服务器 ==="
rsync -avz --exclude=node_modules --exclude=.next --exclude=.git \
  --exclude=.env --exclude=*.log --exclude=frontend/node_modules --exclude=backend/node_modules \
  -e "ssh -i ${SSH_KEY} -o StrictHostKeyChecking=no" \
  ./ ${SERVER}:${DEPLOY_PATH}/

echo "=== 2. 在服务器上构建并重启 ==="
ssh -i "${SSH_KEY}" -o StrictHostKeyChecking=no ${SERVER} "
  cd ${DEPLOY_PATH}
  # 构建 Docker 镜像
  docker compose -f docker-compose.prod.yml up -d --build
  # 清理无用镜像
  docker image prune -f
  # 检查服务状态
  docker compose -f docker-compose.prod.yml ps
  # 健康检查
  sleep 5
  curl -sf http://127.0.0.1/api/categories > /dev/null && echo '✅ 服务运行正常' || (echo '❌ 健康检查失败' && exit 1)
"

echo "=== 部署完成 ==="
echo "访问地址: http://124.222.246.46"
