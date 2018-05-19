/**
 * Created by pengfeixiang on 18/2/6.
 */

'use strict';
const fs = require('fs');
const path = require('path');
const keyframe = require('./keyframe');
const detectron = require('./detectron');
const imageDesc = require('./imageDesc');
const ERROR = require('../config/error');

const doDetect = (obj, cb) => {
    const input = {
        inputDir: obj.keyframeDir,
        outputDir: obj.imgMarkDir,
    };

    return detectron.detect(input, (err) => {
        return cb(err);
    });
};

const doDescribe = (obj, cb) => {
    const input = {
        inputDir: obj.keyframeDir,
        outputDir: obj.imgDescDir,
    };

    return imageDesc.run(input, (err) => {
        return cb(err);
    });
};

const run = (obj, cb) => {
    return doDetect(obj, (err) => {
        if (err) {
            console.error(err);
            return cb(+err || ERROR.UNKNOWN);
        }
        return doDescribe(obj, (err) => {
            if (err) {
                console.error(err);
                return cb(+err || ERROR.UNKNOWN);
            }

            return cb(0);
        });
    });
};

module.exports = {
    run
};
