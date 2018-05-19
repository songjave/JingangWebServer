/**
 * Created by pengfeixiang on 18/2/5.
 */

'use strict';

const lib = require('../lib/keyframe');

const print = (err, data) => {
    console.log(err, data);
};

const input = {
    inputFile: '/web_storage/keyframe/video/test.mp4',
    outputDir: '/web_storage/keyframe/1111',
};

lib.extract(input, print);
