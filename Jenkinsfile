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
                    # 确保 .env 文件存在
                    if [ ! -f .env ]; then
                        cp .env.example .env
                    fi

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
                    STATUS=$(curl -sf -o /dev/null -w "%{http_code}" http://127.0.0.1:80/api/categories || echo "000")
                    if [ "$STATUS" = "200" ]; then
                        echo "✅ 健康检查通过"
                    else
                        echo "❌ 健康检查失败, 状态码: $STATUS"
                        docker compose -f docker-compose.prod.yml ps
                        docker compose -f docker-compose.prod.yml logs --tail=50
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
