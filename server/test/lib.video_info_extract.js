/**
 * Created by pengfeixiang on 18/2/5.
 */

'use strict';

const lib = require('../lib/video_info_extract');
const mkdirp = require('mkdirp');
const path = require('path');
const config = require('../config/config');


const print = (err, data) => {
    console.log(err, data);
};

const id = '' + Date.now();

const basePath = path.join(config.webStoragePath, 'video_info_extract/result', id);
mkdirp.sync(path.join(basePath, 'keyframe'));
mkdirp.sync(path.join(basePath, 'imgMark'));
mkdirp.sync(path.join(basePath, 'imgDesc'));

const input = {
    videoPath: '/web_storage/keyframe/video/test.mp4',
    keyframeDir: path.join(basePath, 'keyframe'),
    imgMarkDir: path.join(basePath, 'imgMark'),
    imgDescDir: path.join(basePath, 'imgDesc'),
};

lib.run(input, print);
