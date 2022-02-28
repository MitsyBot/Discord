pipeline {
  agent any
  environment {
    GITHUB_TOKEN=credentials('github-token')
    IMAGE_NAME='mitsybot/discord-canary'
    IMAGE_VERSION='latest'
  }
  stages {
    stage('get prisma') {
      steps {
        sh 'rm -rf prisma && git clone https://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@github.com/Poluxtrail/mitsy-prisma prisma'
      }
    }
    stage('cleanup') {
      steps {
        sh 'docker system prune -a --volumes --force'
      }
    }
    stage('build image') {
      steps {
        sh 'docker build -t $IMAGE_NAME:$IMAGE_VERSION .'
      }
    }
    stage('login to GHCR') {
      steps {
        sh 'echo $GITHUB_TOKEN_PSW | docker login ghcr.io -u $GITHUB_TOKEN_USR --password-stdin'
      }
    }
    stage('tag image') {
      steps {
        sh 'docker tag $IMAGE_NAME:$IMAGE_VERSION ghcr.io/$IMAGE_NAME:$IMAGE_VERSION'
      }
    }
    stage('push image') {
      steps {
        sh 'docker push ghcr.io/$IMAGE_NAME:$IMAGE_VERSION'
      }
    }
  stage('Enviar para a maquina') {
          steps {
            script {
                  withCredentials([sshUserPrivateKey(credentialsId: 'ssh-credentials-id', keyFileVariable: 'identity', passphraseVariable: 'passWord', usernameVariable: 'userName')]) {
                               def remote = [:]

            remote.name = 'vps'
            remote.host = '198.12.96.170'
            remote.user = userName
            remote.password = passWord
            remote.allowAnyHosts = true
            sshCommand remote: remote, command: "docker stop discord-canary"
            sshCommand remote: remote, command: "docker rm discord-canary"
            sshCommand remote: remote, command: "docker image rm ghcr.io/mitsybot/discord-canary:latest"
            sshCommand remote: remote, command: "docker pull ghcr.io/mitsybot/discord-canary:latest"
            sshCommand remote: remote, command: "docker run -it -d -e SHARD_COUNT='1' -e BOT_TOKEN='NzkwNzYwMzYyMDYwMjgzOTc0.X-FS-Q.iGgQ9VOtnAD997JNJShl_ADFjEI' --name discord-canary ghcr.io/mitsybot/discord-canary:latest"
            }
        }
      } 
    }
  }
  post {
    always {
      sh 'docker logout'
    }
  }
}
