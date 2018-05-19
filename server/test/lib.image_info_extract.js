/**
 * Created by pengfeixiang on 18/2/5.
 */

'use strict';

const lib = require('../lib/image_info_extract');
const mkdirp = require('mkdirp');
const path = require('path');
const config = require('../config/config');


const print = (err, data) => {
    console.log(err, data);
};

const id = '' + Date.now();

/*
const basePath = path.join(config.webStoragePath, 'video_info_extract/result', id);
mkdirp.sync(path.join(basePath, 'keyframe'));
mkdirp.sync(path.join(basePath, 'imgMark'));
mkdirp.sync(path.join(basePath, 'imgDesc'));
*/

const input = {
    keyframeDir: path.join(config.webStoragePath, '/video_info_extract/result/1517931186707/keyframe'),
    imgMarkDir: path.join(config.webStoragePath, '/video_info_extract/result/1517931186707/imgMark'),
    imgDescDir: path.join(config.webStoragePath, '/video_info_extract/result/1517931186707/imgDesc'),
};

lib.run(input, print);
