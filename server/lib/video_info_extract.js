/**
 * Created by pengfeixiang on 18/2/6.
 */

'use strict';
const fs = require('fs');
const path = require('path');
const keyframe = require('./keyframe');
const imgInfoExtract = require('./image_info_extract');
const ERROR = require('../config/error');
const MAX_CHECK_TIMES = 100;

const doImgInfoExtract = (obj) => {
    imgInfoExtract.run(obj, (err) => {
        err && console.error(err);
    });
};

const checkVideoExtractStatus = (obj, times = 0) => {
    if (times > MAX_CHECK_TIMES) {
        return console.error('exceed MAX_CHECK_TIMES');
    }

    fs.exists(path.join(obj.keyframeDir, 'result.json'), (exist) => {
        if (!exist) {
            return setTimeout(() => {
                console.log('check video', path.join(obj.keyframeDir, 'result.json'), times);
                checkVideoExtractStatus(obj, ++times);
            }, 3000);
        }

        console.log('checkVideoExtractStatus done');
        return doImgInfoExtract(obj);
    });
};


const doVideoExtract = (obj, cb) => {
    const input = {
        inputFile: obj.videoPath,
        outputDir: obj.keyframeDir,
    };

    return keyframe.extract(input, (err) => {
        if (err) {
            return cb(err);
        }

        checkVideoExtractStatus(obj, 0);
        return cb(0);
    });
};


module.exports = {
    run: doVideoExtract
};
