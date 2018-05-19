#/bin/bash

LOCAL_PATH=$(pwd)

mkdir -p /web_storage/log
echo "docker start" > /web_storage/log/access.log
mkdir -p /web_storage/download
mkdir -p /web_storage/sts
mkdir -p /web_storage/baike
mkdir -p /web_storage/stt
mkdir -p /web_storage/login
mkdir -p /web_storage/face
mkdir -p /web_storage/voice

docker run -itd -v /web_storage:/web_storage -v $LOCAL_PATH:/mysvr -p 8084:8084 -e PORT=8084 -e NODE_ENV=production 9.168.16.200:5000/zx_web:0.6 pm2 start /mysvr/server/app.js -i 4
