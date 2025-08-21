pipeline {
  agent any

  environment {
    // Talk to Docker Desktop over TCP instead of the Windows named pipe
    DOCKER_HOST    = 'tcp://host.docker.internal:2375'
    DOCKER_BUILDKIT = '0'   // keep BuildKit off while using 2375
    IMAGE_REPO = 'cloud2244kymt/docker-demo' // your Docker Hub repo
  }

  options { timestamps() }

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
        sh 'docker run --rm ${IMAGE_REPO}:build-${BUILD_NUMBER} echo "container OK"'
      }
    }

    stage('Login & Push') {
      when { expression { return env.DOCKERHUB_USER && env.DOCKERHUB_TOKEN } }
      steps {
        withCredentials([usernamePassword(credentialsId: 'dockerhub-creds',
                         passwordVariable: 'DOCKERHUB_TOKEN', usernameVariable: 'DOCKERHUB_USER')]) {
          sh '''
            echo "$DOCKERHUB_TOKEN" | docker login -u "$DOCKERHUB_USER" --password-stdin
            docker tag ${IMAGE_REPO}:build-${BUILD_NUMBER} ${IMAGE_REPO}:latest
            docker push ${IMAGE_REPO}:build-${BUILD_NUMBER}
            docker push ${IMAGE_REPO}:latest
          '''
        }
      }
    }
  }

  post {
    always { sh 'docker logout || true' }
  }
}

