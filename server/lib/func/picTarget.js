"use strict";

const path = require('path');
const mkdirp = require('mkdirp');
const uuid = require('uuid');

const config = require('../../config/config');
const funCommon = require('./funCommon');
const lib = require('../../lib/image_info_extract');

const connectServer = (keyframe, imgMark, imgDesc) => {
    mkdirp.sync(imgMark);
    mkdirp.sync(imgDesc);
    const toServer = {
        keyframeDir: funCommon.replaceStorage(keyframe),
        imgMarkDir: funCommon.replaceStorage(imgMark),
        imgDescDir: funCommon.replaceStorage(imgDesc)
    };
    lib.run(toServer, (err, data) => {
        console.log(err, data);
    });
};

const target = (input, cb) => {
    const keyframeDir = input[0].destination;
    const id = keyframeDir.match(/\/result\/(.*)\/keyframe/)[1]; // 最后一层目录 572e7d9b-3697-4999-8c45-05afd6393b9f
    const imgMarkDir = keyframeDir.replace('keyframe', 'imgMark');
    const imgDescDir = keyframeDir.replace('keyframe', 'imgDesc');

    mkdirp.sync(keyframeDir);
    connectServer(keyframeDir, imgMarkDir, imgDescDir);

    const result = {
        id: id
    };
    return cb(0, result);
};

const targetWeb = (input, cb) => {
    const keyframeDir = path.join(config.webStoragePath, `./img_info_extract/result/${input.id}/keyframe/`);
    const imgMarkDir = keyframeDir.replace('keyframe', 'imgMark');
    const imgDescDir = keyframeDir.replace('keyframe', 'imgDesc');

    const ext = funCommon.getExt(input.url);

    mkdirp(keyframeDir, () => {
        funCommon.download(input.url, `${keyframeDir + input.id + ext}`, (err) => {
            if (err) {
                console.error(err);
                return cb(err);
            }
            connectServer(keyframeDir, imgMarkDir, imgDescDir);
        });

        const result = {
            id: input.id
        };
        return cb(0, result);
    });
};

module.exports = {
    target,
    targetWeb
};
