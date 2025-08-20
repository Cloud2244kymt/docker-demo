// Jenkinsfile (Declarative Pipeline)

pipeline {
  agent any

  // Global env for Windows + Docker Desktop:
  environment {
    // On Windows, Jenkins-in-Docker must talk to Docker Desktop via the named pipe:
    DOCKER_HOST = 'npipe:////./pipe/docker_engine'

    // If you later run Jenkins on Linux/mac (not Windows), comment the line above
    // and uncomment the line below:
    // DOCKER_HOST = 'unix:///var/run/docker.sock'

    IMAGE_REPO   = 'cuddlycloud2244/docker-demo'  // <-- change me
    CONTAINER    = "demo-app-${BUILD_NUMBER}"
    PORT_HOST    = '8081'     // test port on host (avoid clashing with Jenkins on 8080)
    PORT_IN_IMG  = '8080'     // change if your app listens on a different port
  }

  options {
    timestamps()
    ansiColor('xterm')
    skipDefaultCheckout(true)
    buildDiscarder(logRotator(numToKeepStr: '20'))
  }

  parameters {
    booleanParam(name: 'PUSH_TO_DOCKER_HUB', defaultValue: false, description: 'Push the built image to Docker Hub?')
    string(name: 'TAG', defaultValue: '', description: 'Optional image tag (leave empty to use build number)')
  }

  stages {

    stage('Checkout SCM') {
      steps {
        checkout scm
      }
    }

    stage('Docker Build') {
      steps {
        script {
          def tag = params.TAG?.trim() ? params.TAG.trim() : "${env.BUILD_NUMBER}"
          env.IMAGE_TAG = tag
        }
        sh '''
          set -eux
          docker version
          docker build -t "${IMAGE_REPO}:${IMAGE_TAG}" .
          docker images | grep "${IMAGE_REPO}" || true
        '''
      }
    }

    stage('Test in Container (smoke)') {
      steps {
        sh '''
          set -eux

          # Run container in the background for a quick health check
          docker run -d --rm --name "${CONTAINER}" -p "${PORT_HOST}:${PORT_IN_IMG}" "${IMAGE_REPO}:${IMAGE_TAG}"

          # Give it a moment to start
          sleep 4

          # Try to reach the app; adjust the URL/path to your app if needed
          # Prefer curl; fallback to busybox wget if curl is missing
          ( curl -fsS "http://localhost:${PORT_HOST}/" || wget -qO- "http://localhost:${PORT_HOST}/" ) > /dev/null

          echo "Smoke test OK"
        '''
      }
      post {
        always {
          sh 'docker logs "${CONTAINER}" || true'
          sh 'docker rm -f "${CONTAINER}" || true'
        }
      }
    }

    stage('Login & Push') {
      when { expression { return params.PUSH_TO_DOCKER_HUB } }
      steps {
        withCredentials([usernamePassword(credentialsId: 'dockerhub-creds', usernameVariable: 'DH_USER', passwordVariable: 'DH_PASS')]) {
          sh '''
            set -eux
            echo "$DH_PASS" | docker login -u "$DH_USER" --password-stdin
            docker push "${IMAGE_REPO}:${IMAGE_TAG}"
          '''
        }
      }
    }
  }

  post {
    always {
      // clean dangling/stopped stuff (best-effort)
      sh 'docker rm -f "${CONTAINER}" || true'
      sh 'docker builder prune -f || true'
    }
    success {
      echo "Build ${env.BUILD_NUMBER} OK -> ${IMAGE_REPO}:${env.IMAGE_TAG}"
    }
    failure {
      echo "Build ${env.BUILD_NUMBER} failed"
    }
  }
}
