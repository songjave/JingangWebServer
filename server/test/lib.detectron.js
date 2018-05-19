/**
 * Created by pengfeixiang on 18/2/5.
 */

'use strict';

const lib = require('../lib/detectron');

const print = (err, data) => {
    console.log(err, data);
};

const input = {
    inputDir: '/web_storage/img_info_extract/TESTAir',
    outputDir: '/web_storage/img_info_extract/TESTAir_result',
};

lib.detect(input, print);
//lib.ping(print);
