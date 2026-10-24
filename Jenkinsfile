pipeline {
    agent any

    options {
        timestamps()
        disableConcurrentBuilds()
    }

    environment {
        AWS_REGION = 'us-east-1'
        ECR_REPOSITORY = 'campaign-health-api'
        AWS_ACCOUNT_ID = '692901933475'
        ECR_REGISTRY = '692901933475.dkr.ecr.us-east-1.amazonaws.com'
        ECR_IMAGE = '692901933475.dkr.ecr.us-east-1.amazonaws.com/campaign-health-api'
        LOCAL_IMAGE = 'campaign-health-api'

        // Throwaway Postgres for the server integration tests
        TEST_DB_CONTAINER = "campaign-health-test-db-${BUILD_NUMBER}"
        TEST_DB_PORT = '55432'
    }

    stages {

        stage('Checkout') {
            steps {
                checkout scm

                sh '''
                    echo "Commit:"
                    git rev-parse HEAD

                    echo "Branch:"
                    git branch --show-current || true
                '''
            }
        }

        stage('Build Metadata') {
            steps {
                script {
                    env.GIT_SHA =
                        sh(
                            script: 'git rev-parse --short HEAD',
                            returnStdout: true
                        ).trim()

                    env.IMAGE_TAG =
                        "${env.BUILD_NUMBER}-${env.GIT_SHA}"
                }
                echo "Image tag: ${IMAGE_TAG}"
            }
        }

        stage('Backend Install') {
            steps {
                dir('server') {
                    sh 'npm ci'
                }
            }
        }

        stage('Backend Typecheck') {
            steps {
                dir('server') {
                    sh 'npm run typecheck'
                }
            }
        }

        stage('Backend Test') {
            environment {
                NODE_ENV = 'DEVELOPMENT'
                DATABASE_HOST = 'localhost'
                DATABASE_PORT = "${TEST_DB_PORT}"
                DATABASE_NAME = 'campaign_health'
                DATABASE_USER = 'campaign_user'
                DATABASE_PASSWORD = 'campaign_password'
                // env.ts requires a non-empty key; tests never call OpenAI
                OPENAI_API_KEY = 'ci-placeholder-key'
            }
            steps {
                sh '''
                    docker run -d --rm \
                        --name "$TEST_DB_CONTAINER" \
                        -e POSTGRES_DB="$DATABASE_NAME" \
                        -e POSTGRES_USER="$DATABASE_USER" \
                        -e POSTGRES_PASSWORD="$DATABASE_PASSWORD" \
                        -p "$TEST_DB_PORT:5432" \
                        postgres:17-alpine

                    for i in $(seq 1 30); do
                        if docker exec "$TEST_DB_CONTAINER" \
                            pg_isready -U "$DATABASE_USER" -d "$DATABASE_NAME"; then
                            break
                        fi
                        sleep 2
                    done
                '''

                dir('server') {
                    sh '''
                        npm run db:migrate
                        npm run db:seed
                        npm test
                    '''
                }
            }
            post {
                always {
                    sh 'docker rm -f "$TEST_DB_CONTAINER" 2>/dev/null || true'
                }
            }
        }

        stage('Backend Build') {
            steps {
                dir('server') {
                    sh 'npm run build'
                }
            }
        }

        stage('Frontend Install') {
            steps {
                dir('client') {
                    sh 'npm ci'
                }
            }
        }

        stage('Frontend Lint') {
            steps {
                dir('client') {
                    sh 'npm run lint'
                }
            }
        }

        stage('Frontend Test') {
            steps {
                dir('client') {
                    sh 'npm test'
                }
            }
        }

        stage('Frontend Build') {
            steps {
                dir('client') {
                    sh 'VITE_API_BASE_URL=/api npm run build'
                }
            }
        }

        stage('Docker Build') {
            steps {
                sh 'docker build -t "${LOCAL_IMAGE}:${IMAGE_TAG}" ./server'
            }
        }

        stage('ECR Login') {
            environment {
                AWS_CREDS = credentials('campaign-health-aws')
            }
            steps {
                sh '''
                    set +x

                    export AWS_ACCESS_KEY_ID="$AWS_CREDS_USR"
                    export AWS_SECRET_ACCESS_KEY="$AWS_CREDS_PSW"

                    aws ecr get-login-password --region "$AWS_REGION" \
                        | docker login --username AWS --password-stdin "$ECR_REGISTRY"
                '''
            }
        }

        stage('Tag and Push API Image') {
            steps {
                sh '''
                    docker tag "${LOCAL_IMAGE}:${IMAGE_TAG}" "${ECR_IMAGE}:${IMAGE_TAG}"
                    docker push "${ECR_IMAGE}:${IMAGE_TAG}"

                    docker tag "${LOCAL_IMAGE}:${IMAGE_TAG}" "${ECR_IMAGE}:latest"
                    docker push "${ECR_IMAGE}:latest"
                '''
            }
        }
    }

    post {
        success {
            echo 'Campaign Health CI pipeline completed successfully.'
        }

        failure {
            echo 'Campaign Health CI pipeline failed.'
        }

        always {
            sh '''
                docker image rm \
                    "${LOCAL_IMAGE}:${IMAGE_TAG}" \
                    "${ECR_IMAGE}:${IMAGE_TAG}" \
                    "${ECR_IMAGE}:latest" \
                    2>/dev/null || true
            '''

            deleteDir()
        }
    }
}
