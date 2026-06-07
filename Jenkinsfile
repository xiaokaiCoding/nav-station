pipeline {
    agent any

    options {
        timeout(time: 15, unit: 'MINUTES')
        disableConcurrentBuilds()
    }

    triggers {
        pollSCM('H/5 * * * *')
    }

    environment {
        APP_NAME = 'nav-station'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout([
                    $class: 'GitSCM',
                    branches: [[name: '*/master']],
                    userRemoteConfigs: [[
                        url: 'https://github.com/xiaokaiCoding/nav-station.git',
                        credentialsId: '19af8209-b26b-4745-a27b-41ecf3e9e80f'
                    ]],
                    extensions: [
                        [$class: 'CloneOption', timeout: 300, depth: 1, noTags: true],
                        [$class: 'CheckoutOption', timeout: 120]
                    ]
                ])
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

                    # 强制停止并删除旧容器
                    docker compose -f docker-compose.prod.yml down --remove-orphans --timeout 10 2>/dev/null || true
                    # 如果有残留容器，强制删除
                    docker rm -f nav-mysql nav-backend nav-frontend nav-nginx 2>/dev/null || true

                    # 构建发生变化的镜像（利用 Docker 层缓存）
                    docker compose -f docker-compose.prod.yml build --parallel

                    # 启动所有服务
                    docker compose -f docker-compose.prod.yml up -d

                    # 清理悬空镜像（保留缓存层）
                    docker image prune -f
                '''
            }
        }

        stage('Health Check') {
            steps {
                sh '''
                    sleep 8
                    RESULT=$(docker exec nav-nginx wget -qO- http://127.0.0.1/api/categories 2>&1) || true
                    if echo "$RESULT" | grep -q '"code":0'; then
                        echo "✅ 健康检查通过"
                    else
                        echo "❌ 健康检查失败"
                        docker compose -f docker-compose.prod.yml ps
                        exit 1
                    fi
                '''
            }
        }
    }

    post {
        failure {
            echo "❌ 部署失败"
        }
        success {
            echo "✅ 部署成功"
        }
    }
}
