pipeline {
    agent any

    environment {
        DEPLOY_PATH  = '/opt/nav-station'
    }

    triggers {
        pollSCM('H/2 * * * *')
    }

    stages {
        stage('Pull Code') {
            steps {
                checkout scm
            }
        }

        stage('Deploy with Docker Compose') {
            steps {
                sh """
                    cp -f .env.example ${DEPLOY_PATH}/.env 2>/dev/null || true

                    cd ${DEPLOY_PATH}

                    # 停止旧容器
                    docker compose -f docker-compose.prod.yml down || true

                    # 构建并启动
                    docker compose -f docker-compose.prod.yml up -d --build

                    # 清理无用镜像
                    docker image prune -f
                """
            }
        }

        stage('Health Check') {
            steps {
                sh '''
                    sleep 8
                    STATUS=$(curl -sf -o /dev/null -w "%{http_code}" http://127.0.0.1:80/api/categories)
                    if [ "$STATUS" = "200" ]; then
                        echo "✅ 健康检查通过"
                    else
                        echo "❌ 健康检查失败, 状态码: $STATUS"
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
            echo "✅ 部署成功"
        }
    }
}
