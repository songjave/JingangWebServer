'use strict';

const fs = require('fs');
const ERROR = require('../config/error');
const stt = require('../lib/stt');
const path = require('path');
const config = require('../config/config');
const ffmpeg = require('../lib/ffmpeg');

const wavToText = (input, cb) => {
    //console.log('focus:', '../public' + input);
    fs.readFile(path.join(config.webStoragePath, input), (err, data) => {
        if(err) {
            return cb(err);
        }
        //console.log(data.length, data.size);
        if (data.length > 540 * 1024) {
            return cb(0, {text: '音频过长'});
        }

        const obj = {
            buffer: data
        };

        if (!config.forceStsUseBetaStt) {
            return stt.recognize(obj, (err, result = {}) => {
                return cb(err || result.errCode || 0, result);
            });
        }

        obj.need8k = true;
        obj.isBeta = true;
        return ffmpeg.bufferConvert(obj, (err) => {
            if (err) {
                console.error(err);
                return cb(ERROR.UNKNOWN, {errMsg: 'ffmpeg convert error'});
            }

            return stt.recognize(obj, (err, result = {}) => {
                return cb(err || result.errCode || 0, result);
            });
        });
    });
};

module.exports = {
    wavToText
};
