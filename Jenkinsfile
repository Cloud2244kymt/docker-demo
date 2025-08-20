pipeline {
  agent any
  options { timestamps() }

  // ---- EDIT THIS: your image name (repo) ----
  environment {
    IMAGE = "jenkins-docker-demo"         // e.g. "yourname/jenkins-docker-demo" if pushing to Docker Hub
    TAG   = "${env.BUILD_NUMBER}"
  }

  stages {
    stage('Checkout') {
      steps { checkout scm }
    }

    stage('Docker Build') {
      steps {
        bat 'docker version'
        bat 'docker build -t %IMAGE%:%TAG% .'
      }
    }

    stage('Test in Container') {
      steps {
        // expects your image to run `npm test` (or adjust for your stack)
        bat 'docker run --rm %IMAGE%:%TAG% npm test'
      }
    }

    stage('Run App (demo)') {
      when { expression { return env.RUN_DEMO ?: 'true' } } // set RUN_DEMO=false to skip
      steps {
        // stop old demo container if exists (ignore errors)
        bat 'docker rm -f jx-demo 2>nul || ver > nul'
        bat 'docker run -d --name jx-demo -p 3000:3000 %IMAGE%:%TAG%'
      }
    }

    // ---- OPTIONAL: Push to Docker Hub (set IMAGE to your Docker Hub repo) ----
    stage('Login & Push (optional)') {
      when { expression { return env.DO_PUSH ?: 'false' } } // set DO_PUSH=true in job or with parameters
      steps {
        withCredentials([usernamePassword(credentialsId: 'dockerhub',
                                          usernameVariable: 'DOCKER_USER',
                                          passwordVariable: 'DOCKER_PASS')]) {
          bat 'echo %DOCKER_PASS% | docker login -u %DOCKER_USER% --password-stdin'
        }
        bat 'docker tag %IMAGE%:%TAG% %IMAGE%:latest'
        bat 'docker push %IMAGE%:%TAG%'
        bat 'docker push %IMAGE%:latest'
      }
    }
  }

  post {
    always {
      bat 'docker images'
      bat 'docker ps -a'
    }
    cleanup {
      cleanWs()
    }
  }
}
