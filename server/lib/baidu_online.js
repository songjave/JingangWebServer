/**
 * Created by pengfeixiang on 18/1/30.
 */

'use strict';

const config = require('../config/config');
const baiduConfArr = config.baiduOnline;
const AipSpeechClient = require("baidu-aip-sdk").speech;
const ERROR = require('../config/error');

const HttpClient = require("baidu-aip-sdk").HttpClient;

// 设置request库的一些参数，例如代理服务地址，超时时间等
// request参数请参考 https://github.com/request/request#requestoptions-callback
HttpClient.setRequestOptions({timeout: 30000});

const clientArr = [];
baiduConfArr.forEach((baiduConf) => {
    const client = new AipSpeechClient(baiduConf.appid, baiduConf.appkey, baiduConf.secret);
    clientArr.push({ client, appid: baiduConf.appid });
});

let index = 0;
const len = clientArr.length;
const getInstance = () => {
    return clientArr[index++ % len]
};

const recognize = (input, cb) => {
    const instance = getInstance();
    const client = instance.client;
    client.recognize(input.buffer, input.format || 'wav', input.rate || 16000).then((res = {}) => {
        if (res.err_no) {
            if (res.err_no === 3301) { // speech quality error
                return cb(0, {text: ''});
            }

            console.error(res, instance.appid);
            return cb(ERROR.PARTNER_CALL_ERR, {errMsg: res.err_msg || ''});
        }

        if (!res.result) {
            return cb(ERROR.PARTNER_CALL_ERR, {errMsg:'返回格式异常'});
        }

        return cb(0, {text: res.result[0] || ''});
    }, (err) => {
        console.error(err);
        return cb(ERROR.RPC_ERROR, {errMsg: '调用失败'});
    });
};

module.exports = {
    recognize
};
