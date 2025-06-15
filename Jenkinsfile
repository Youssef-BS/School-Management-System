pipeline {
  agent any

  tools {
    nodejs 'NodeJS 18'
  }

  environment {
    SONAR_TOKEN = credentials('sonarqube-token')
  }

  stages {
    stage('Install Frontend Dependencies') {
      steps {
        dir('client') {
          sh 'npm install'
        }
      }
    }

    stage('Install Backend Dependencies') {
      steps {
        dir('server') {
          sh 'npm install'
        }
      }
    }

    stage('Run SonarQube Analysis') {
      steps {
        dir('server') {
          withSonarQubeEnv('SonarQube') {
sh '''
  npx sonar-scanner \
  -Dsonar.projectKey=School-Management-System \
  -Dsonar.sources=. \
  -Dsonar.host.url=http://172.17.0.1:9000 \
  -Dsonar.login=$SONAR_TOKEN
'''

          }
        }
      }
    }
  }
}
