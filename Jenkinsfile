pipeline {
  agent any
  environment {
    DOCKER_HOST    = 'npipe:////./pipe/docker_engine'
    DOCKER_BUILDKIT = '0'                 // <— add this line
    IMAGE_REPO     = 'cloud2244kymt/docker-demo'  // yours
  }

  stages {
    stage('Checkout SCM') {
      steps { checkout scm }
    }

    stage('Docker Build') {
  steps {
    sh '''
      echo "Workspace is: $PWD"
      ls -la
      docker --version
      docker build --progress=plain -t ${IMAGE_REPO}:build-${BUILD_NUMBER} .
    '''
  }
}


    stage('Test in Container') {
      steps {
        sh '''
          docker run --rm ${IMAGE_REPO}:build-${BUILD_NUMBER} echo "Container OK"
        '''
      }
    }

    // You can leave Login & Push commented until you set credentials
    // stage('Login & Push') { ... }
  }
}
