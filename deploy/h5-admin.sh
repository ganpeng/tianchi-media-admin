#!/usr/bin/env bash

# import external shell file
# source ./base.sh

# Get abs dir of current directory
#cd `dirname $0` && cd ..

cd /data/release/frontend/h5-admin

echo "--------------------install dependencies"
npm install

echo "--------------------build fro production with minification in 'dist' folder"
npm run build


## Make war and rsync to remote server
ENV="${1:-'dev'}"  # Get first parameter, if no one specified get default value: dev
BRANCH="${2:-'master'}"

#MODULES=${@:3}  # Get publish Modules separated by space

echo "-------${ENV}--------"

case "${ENV}" in
    "dev")
        TARGET_HOSTS="dev.tianchimedia.com"
        ;;
    "test")
        TARGET_HOSTS="test.tianchimedia.com"
        ;;
    "prod")
        TARGET_HOSTS="prod.tianchimedia.com"
	;;
    *)
        echo "Usage: ./h5-admin.sh {dev|test|prod}"
        exit 1
esac

## Build, package and release to eureka server
#
# Usage: void release_service_server module
release_service_server() {
#    local module=${1}
#    local module_jar="tianchi-${module}.jar"
#    # Publish service register center: eureka
    echo "--------------------repackage h5-admin"
    (cd /data/release/frontend/h5-admin/dist)

    count=0
    while [ "x${TARGET_HOSTS[count]}" != "x" ]
    do
        TARGET_HOST=${TARGET_HOSTS[count]}
        TARGET_DIR="/data/dist/dynamic//h5-admin/"
        ssh www@${TARGET_HOST} "mkdir -p ${TARGET_DIR}"

        echo "----------------------------Sync h5-adminto: ${TARGET_HOST}"
        rsync -av /data/release/frontend/h5-admin/dist/ www@${TARGET_HOST}:${TARGET_DIR}

 #       ssh www@${TARGET_HOST} "tar -xJf ${TARGET_DIR}"

        count=$((${count} + 1))
    done
}

# Execute shell main
update_git_repo ${BRANCH};
release_service_server;

