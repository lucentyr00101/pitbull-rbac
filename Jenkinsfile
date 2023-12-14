def ERROR_MESSAGE
boolean PIPELINE_SUCCESS = true

pipeline {
    agent 
    {
        node 
        {
            label 'maven && devops'
        }
    }
  
    environment 
    {
        ENVIRONMENT = 'staging'
        REGISTRY = 'harbor-ali.mir708090.com'
        DOCKER_REPOSITORY_SERVER = "https://${REGISTRY}"
        HARBOR_ID = 'harbor-ali'
        DOCKERHUB_NAMESPACE = "pitbull/${ENVIRONMENT}"
        IMAGE_REPOSITORY = "pitbull-console"
        GITLAB_CREDENTIALS = 'github-ssh'
        GITLAB_REPOSITORY_URL = 'git@github.com:pitbull-rbac/pitbull-console.git'
        SCAPED_BRANCH_NAME = BRANCH.replaceAll('/','-')
        BRANCH = "release/1.0.0"

        BOT_TOKEN = 'bot5405564816%3AAAGha_5I23kbupAfqy8aK4pXUz7hXU7CBPM' //DevOps Bot
        //CHAT_ID = '5323458396' //Personal Page
        CHAT_ID = '-744447942'
        DISABLE_NOTIFICATION = 'false'
        PROJECT_NAME = "Pitbull-Console"

        BUILD_TRIGGER_BY = "${currentBuild.getBuildCauses()[0].shortDescription} / ${currentBuild.getBuildCauses()[0].userId}"
        GIT_COMMIT_HASH = "Error"
    }

    stages 
    {

        stage ('Checkout GitSCM')
        {
            steps
            {
                container('maven') {
                    script
                    {
                        try 
                        {
                            BUILD_TRIGGER_BY = "${currentBuild.getBuildCauses()[0].shortDescription} / ${currentBuild.getBuildCauses()[0].userId}"
                            checkout([
                                $class: 'GitSCM', 
                                    branches: [[
                                    name: "*/${BRANCH}"
                                ]], 
                                doGenerateSubmoduleConfigurations: false, 
                                 extensions: [[
                                    $class: 'CloneOption', 
                                    timeout: 20, 
                                    noTags: false
                                ]], 
                                submoduleCfg: [], 
                                userRemoteConfigs: [[
                                    credentialsId: "${GITLAB_CREDENTIALS}", 
                                    url: "${GITLAB_REPOSITORY_URL}"]]
                                ])
                            sh "ls -lah ./ && git config --global --add safe.directory /home/jenkins/agent/workspace/onsole-image-build_release_1.0.0"
                            GIT_COMMIT_HASH = sh (script: "git rev-parse --short HEAD", returnStdout: true).trim()
                        }
                        catch(e)
                        {
                            PIPELINE_SUCCESS = false
                            ERROR_MESSAGE = "${ERROR_MESSAGE} ${e} \n" 
                            print e
                            currentBuild.result = 'FAILURE'
                        }
                    }
                }
            }
        }

        stage ('Pre-Build Notification')
        {
            steps
            {
                container('maven') {
                    script
                    {
                        notification("🔧 We are building rockets!")
                    }
                }
            }

        }

        stage("Build image") 
        {
            steps 
            {
                container('maven') {
                    script 
                    {
                        try {
                            docker.build("${REGISTRY}/${DOCKERHUB_NAMESPACE}/${IMAGE_REPOSITORY}:${SCAPED_BRANCH_NAME}-${GIT_COMMIT_HASH}", "--no-cache  -f Dockerfile.${ENVIRONMENT} .")
                            docker.withRegistry("${DOCKER_REPOSITORY_SERVER}", "${HARBOR_ID}")
                            {
                                docker.image("$REGISTRY/$DOCKERHUB_NAMESPACE/${IMAGE_REPOSITORY}:${SCAPED_BRANCH_NAME}-${GIT_COMMIT_HASH}").push()
                                docker.image("$REGISTRY/$DOCKERHUB_NAMESPACE/${IMAGE_REPOSITORY}:${SCAPED_BRANCH_NAME}-${GIT_COMMIT_HASH}").push("latest")
                            }
                        }
                        catch(e)
                        {
                            PIPELINE_SUCCESS = false
                            ERROR_MESSAGE = "${ERROR_MESSAGE} ${e} \n"
                            print e
                            currentBuild.result = 'FAILURE'
                        }
                    }
                }
            }
        }
    }

    post
    {
        always
        {
            container('maven') {
                script
                {
                    if (!PIPELINE_SUCCESS)
                    {
                        notification("❗ Build Error! \n\n ${ERROR_MESSAGE}")
                    }
                    else
                    {
                        notification("✅ Build Success! \n\nThe rocket is now ready to lift off!")
                    }
                    cleanWs()
                }
            }
        }
    }
}

def notification(status)
{
    sh """
        curl --request POST \
        --url https://api.telegram.org/${BOT_TOKEN}/sendMessage \
        --header 'Accept: application/json' \
        --header 'Content-Type: application/json' \
        --header 'User-Agent: Telegram Bot SDK - (https://github.com/irazasyed/telegram-bot-sdk)' \
        --data '
        {
        "text": "
${status}

${BUILD_TRIGGER_BY}

Project Name: ${PROJECT_NAME}
Environment: ${ENVIRONMENT}
Branch: ${BRANCH}
Commit Hash: ${GIT_COMMIT_HASH}
Docker Image: ${REGISTRY}/${DOCKERHUB_NAMESPACE}/${IMAGE_REPOSITORY}
Docker Image Tag: ${SCAPED_BRANCH_NAME}-${GIT_COMMIT_HASH}
Build URL: ${BUILD_URL}
            ",
        "disable_web_page_preview": false,
        "disable_notification": ${DISABLE_NOTIFICATION},
        "reply_to_message_id": null,
        "chat_id": "${CHAT_ID}"
        }
        '
    """
}