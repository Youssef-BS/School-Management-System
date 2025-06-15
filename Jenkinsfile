pipeline {
  agent any

  tools {
    nodejs 'NodeJS 18'      
  }

  environment {
    SONAR_TOKEN = credentials('sonarqube-token') 
  }

  stages {
    stage('Install Dependencies') {
      steps {
        sh 'npm install'
      }
    }

    stage('Run SonarQube Analysis') {
      steps {
        withSonarQubeEnv('SonarQube') {
          sh 'node sonar-scanner.js'
        }
      }
    }
  }
}
