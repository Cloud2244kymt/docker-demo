pipeline {
  agent any

  environment {
    IMAGE_REPO   = 'cloud2244kymt/docker-demo'  // your Docker Hub repo
    IMAGE_TAG    = "build-${env.BUILD_NUMBER}"
  }

  options {
    timestamps()
    // remove or comment out: ansiColor('xterm')
  }

  stages {
    stage('Checkout SCM') {
      steps { checkout scm }
    }

    stage('Docker Build') {
      steps {
        sh "docker --version"             // verify docker CLI in agent
        sh "docker build -t ${IMAGE_REPO}:${IMAGE_TAG} ."
      }
    }

    stage('Test in Container') {
      steps {
        sh "docker run --rm ${IMAGE_REPO}:${IMAGE_TAG} echo 'tests ok'"
      }
    }

    stage('Login & Push') {
      when { expression { return env.DOCKERHUB_USER && env.DOCKERHUB_TOKEN } }
      steps {
        sh "echo ${DOCKERHUB_TOKEN} | docker login -u ${DOCKERHUB_USER} --password-stdin"
        sh "docker push ${IMAGE_REPO}:${IMAGE_TAG}"
      }
    }

    stage('Post Actions') {
      steps {
        echo "Built: ${IMAGE_REPO}:${IMAGE_TAG}"
      }
    }
  }

  post {
    always {
      sh "docker image prune -f || true"
    }
  }
}

