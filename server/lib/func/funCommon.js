"use strict";

const fs = require('fs');
const uuid = require('uuid');
const request = require('request');
const ERROR = require('../../config/error');

const getExt = (fileName) => {
    const index= fileName.lastIndexOf(".");
    const ext = fileName.substr(index+1);
    return '.' + ext;
};

const writeFile = (imgMarkDir, imgDescDir, n) => {
    const jsonData = {
        "list": [],
        "summary": "这是视频信息提取的描述"
    };
    console.log('imgMarkDir:', imgMarkDir);
    for (let i=0; i<n; i++) {
        fs.writeFileSync(imgMarkDir + uuid.v4() + '.jpg', fs.readFileSync(('./lib/func/img.jpg'))); // 用path写路径
    }
    fs.writeFileSync(imgDescDir + 'result.json', jsonData);
};

const download = (url, filename, cb) => {
    request.head(url, (err, res, body) => {
        if (err) {
            console.error(err);
            return cb(err);
        }
        request(url).pipe(fs.createWriteStream(filename)).on('close', () => {
            fs.stat(filename, (err, stats) => {
                console.log('stats.size----', stats.size);
                if (err) {
                    return cb(err);
                }
                /*if (stats.size < 3000) {
                    console.error('-------NOT_FOUND----');
                    return cb(ERROR.NOT_FOUND);
                }*/
                return cb(0);
            });
        });
    });
};

const replaceStorage = (dir) => {
    return dir.replace(/^.*web_storage/, '/web_storage');
};

const delStorage = (dir) => {
    return dir.replace(/^.*web_storage/, '');
};

module.exports = {
    getExt,
    writeFile,
    download,
    replaceStorage,
    delStorage
};
