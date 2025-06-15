
pipeline {
  agent {
    docker {
      image 'sonarsource/sonar-scanner-cli:latest'
      args '-v /var/run/docker.sock:/var/run/docker.sock' // optional, only if needed
    }
  }

  environment {
    SONAR_TOKEN = credentials('sonar-token')
    SONAR_HOST_URL = 'http://172.17.0.1:9000'
  }

  stages {
    stage('Checkout') {
      steps {
        checkout scm
      }
    }
    stage('SonarQube Scan') {
      steps {
        withSonarQubeEnv('SonarQube') {
          sh """
            sonar-scanner \
              -Dsonar.projectKey=School-Management-System \
              -Dsonar.sources=. \
              -Dsonar.host.url=${SONAR_HOST_URL} \
              -Dsonar.login=${SONAR_TOKEN}
          """
        }
      }
    }
    stage('Quality Gate') {
      steps {
        timeout(time: 1, unit: 'MINUTES') {
          waitForQualityGate abortPipeline: true
        }
      }
    }
  }
}
