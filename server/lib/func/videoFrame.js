"use strict";

const path = require('path');
const mkdirp = require('mkdirp');

const config = require('../../config/config');
const funCommon = require('./funCommon');
const lib = require('../video_info_extract');


const keyFrame = (input, cb) => {
    const id = input.filename.replace(/(.*\/)*([^.]+).*/ig,"$2");
    const projectDir = input.destination;
    const keyframeDir = projectDir.replace('originVideo', 'result') + `${id}/keyframe/`;
    const imgMarkDir = projectDir.replace('originVideo', 'result') + `${id}/imgMark/`;
    const imgDescDir = projectDir.replace('originVideo', 'result') + `${id}/imgDesc/`;

    mkdirp.sync(keyframeDir);
    mkdirp.sync(imgMarkDir);
    mkdirp.sync(imgDescDir);

    const toServer = {
        videoPath: funCommon.replaceStorage(projectDir) + input.filename,
        keyframeDir: keyframeDir,
        imgMarkDir: imgMarkDir,
        imgDescDir: imgDescDir
    };
    lib.run(toServer, (err, data) => {
        console.log(err, data);
    });

    const result = {
        id: id
    };
    return cb(0, result);

};

const frameWeb = (input, cb) => {
    const projectDir = path.join(config.webStoragePath, `./video_info_extract/originVideo/`);
    const keyframeDir = projectDir.replace('originVideo', 'result') + `${input.id}/keyframe/`;
    const imgMarkDir = projectDir.replace('originVideo', 'result') + `${input.id}/imgMark/`;
    const imgDescDir = projectDir.replace('originVideo', 'result') + `${input.id}/imgDesc/`;

    const ext = funCommon.getExt(input.url);
    mkdirp(projectDir, (err) => {
        if (err) {
            console.error(err);
            return cb(err);
        }

        funCommon.download(input.url, `${projectDir + input.id + ext}`, (err) => {
            if (err) {
                console.error(err);
                return cb(err);
            }

            mkdirp.sync(keyframeDir);
            mkdirp.sync(imgMarkDir);
            mkdirp.sync(imgDescDir);

            const toServer = {
                videoPath: funCommon.replaceStorage(projectDir) + input.id + ext,
                keyframeDir: keyframeDir,
                imgMarkDir: imgMarkDir,
                imgDescDir: imgDescDir
            };
            lib.run(toServer, (err, data) => {
                console.log(err, data);
            });

            const result = {
                id: input.id
            };
            return cb(0, result);
        });
    });
};

module.exports = {
    keyFrame,
    frameWeb
};
