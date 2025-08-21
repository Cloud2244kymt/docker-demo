
pipeline {
  agent any
  environment {
    DOCKER_HOST = 'tcp://host.docker.internal:2375'
    IMAGE      = 'cuddlycloud2244/docker-demo'
    APP_PORT   = '3000'
    HOST_PORT  = '8082'
  }
  options { timestamps() }   // <- removed ansiColor

  stages {
    stage('Checkout') { steps { checkout scm } }

    stage('Build image') {
      steps {
        script {
          env.SHORT_SHA = sh(returnStdout: true, script: "git rev-parse --short HEAD || echo ${env.BUILD_NUMBER}").trim()
        }
        sh "docker build -t ${IMAGE}:latest -t ${IMAGE}:${SHORT_SHA} ."
      }
    }

    stage('Test (smoke)') {
      steps {
        sh '''
          CID=$(docker run -d -p 0:'"${APP_PORT}"' ${IMAGE}:latest)
          sleep 3
          docker exec "$CID" wget -qO- http://localhost:'"${APP_PORT}"'/healthz | grep -q ok
          docker rm -f "$CID"
        '''
      }
    }

    stage('Push') {
      steps {
        withCredentials([usernamePassword(credentialsId: 'DOCKERHUB', usernameVariable: 'U', passwordVariable: 'P')]) {
          sh """
            echo \$P | docker login -u \$U --password-stdin
            docker push ${IMAGE}:latest
            docker push ${IMAGE}:${SHORT_SHA}
            docker logout || true
          """
        }
      }
    }

    stage('Deploy') {
      steps {
        sh """
          docker rm -f demo_node || true
          docker run -d --name demo_node -p ${HOST_PORT}:${APP_PORT} ${IMAGE}:latest
        """
        echo "Open: http://localhost:${HOST_PORT}/"
      }
    }
  }

  post { always { sh 'docker image prune -f || true' } }
}
