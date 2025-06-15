const scanner = require('sonarqube-scanner');

scanner(
  {
    serverUrl: 'http://localhost:9000',
    token: '',
    options: {
      'sonar.projectKey': 'fullstack-app',
      'sonar.sources': 'server',
      'sonar.exclusions': '**/node_modules/**,client/**',
    },
  },
  () => process.exit()
);
