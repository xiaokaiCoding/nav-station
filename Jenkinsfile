pipeline {
    agent any

    environment {
        APP_NAME     = 'nav-station'
        SERVER_HOST  = '124.222.246.46'
        SERVER_USER  = 'root'
        CRED_ID      = 'ssh-key-credential'
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

        stage('Build Docker Images') {
            steps {
                sh '''
                    docker build -t ${APP_NAME}-backend:latest ./backend
                    docker build -t ${APP_NAME}-frontend:latest ./frontend
                '''
            }
        }

        stage('Deploy') {
            steps {
                sh '''
                    # Copy files to server
                    rsync -avz --exclude=node_modules --exclude=.next --exclude=.git \
                        --exclude=Jenkinsfile --exclude=*.md \
                        ./ ${SERVER_USER}@${SERVER_HOST}:${DEPLOY_PATH}/

                    # Restart services via docker-compose
                    ssh ${SERVER_USER}@${SERVER_HOST} "
                        cd ${DEPLOY_PATH}
                        docker compose -f docker-compose.prod.yml up -d --build
                        docker image prune -f
                    "
                '''
            }
        }

        stage('Health Check') {
            steps {
                sh '''
                    sleep 5
                    curl -sf http://${SERVER_HOST}/api/categories || (echo "Health check failed!" && exit 1)
                    echo "Deploy successful!"
                '''
            }
        }
    }

    post {
        failure {
            echo "部署失败，请检查日志"
        }
        success {
            echo "部署成功"
        }
    }
}
