pipeline {
    agent any

    triggers {
        pollSCM('H/2 * * * *')
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Deploy with Docker Compose') {
            steps {
                sh '''
                    # 生成 .env 文件
                    cat > .env << 'ENVEOF'
DB_ROOT_PASSWORD=root
DB_NAME=nav_station
JWT_SECRET=nav-station-secret-key-2024
HTTP_PORT=80
ENVEOF

                    # 停止旧容器（忽略首次执行错误）
                    docker compose -f docker-compose.prod.yml down 2>/dev/null || true

                    # 构建并启动
                    docker compose -f docker-compose.prod.yml up -d --build

                    # 清理无用镜像
                    docker image prune -f
                '''
            }
        }

        stage('Health Check') {
            steps {
                sh '''
                    echo "等待服务启动..."
                    sleep 10

                    # 通过 docker exec 在 nginx 容器内发起请求
                    RESULT=$(docker exec nav-nginx wget -qO- http://127.0.0.1/api/categories 2>&1) || true
                    if echo "$RESULT" | grep -q '"code":0'; then
                        echo "✅ 健康检查通过"
                    else
                        echo "❌ 健康检查失败"
                        docker compose -f docker-compose.prod.yml ps
                        docker compose -f docker-compose.prod.yml logs --tail=30
                        exit 1
                    fi
                '''
            }
        }
    }

    post {
        failure {
            echo "❌ 部署失败，请检查 Jenkins 构建日志"
        }
        success {
            echo "✅ 部署成功，访问 http://124.222.246.46 查看导航站"
        }
    }
}
