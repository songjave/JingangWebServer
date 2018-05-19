/**
 * Created by pengfeixiang on 18/1/6.
 * 服务状态检测 ping
 */

const lib = require('../../lib/stt');
const baidu = require('../../lib/baidu_online');
const ffmpeg = require('../../lib/ffmpeg');
const ERROR = require('../../config/error');

const recognize = (input, cb) => {
    if (input.is16K) {
        return lib.recognize(input, (err, result = {}) => {
            const text = result.text || '';
            return cb(err || result.errCode || 0, {text});
        });
    }

    input.isBeta && (input.need8k = true);
    return ffmpeg.bufferConvert(input, (err, res = {}) => {
        if (err) {
            console.error(err);
            return cb(ERROR.UNKNOWN, {errMsg: 'ffmpeg convert error'});
        }

        const proxy = input.isBaiduOnline ? baidu : lib;

        return proxy.recognize(input, (err, result = {}) => {
            const text = result.text || '';
            return cb(err || result.errCode || 0, {text});
        });
    });
};

module.exports = {
    recognize
};
