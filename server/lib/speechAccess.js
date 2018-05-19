/**
 * Created by pengfeixiang on 17/12/18.
 */

'use strict';

const path = require('path');
const grpc = require('grpc');
const ERROR = require('../config/error');

const PROTO_PATH = path.join(__dirname, '../lib/speech.proto');
const SPEECH = grpc.load(PROTO_PATH).speech;
const ADDR = '10.0.0.26:9002';

const recognize = (input, cb) => {
  const client = new SPEECH.Recognition(ADDR, grpc.credentials.createInsecure());
  const req = {
    name: "",
    audio: input.buffer
  };

  const _t = Date.now();
  client.recognize(req, function(err, rsp = {}) {
    if (err) {
      console.error(err);
      return cb(ERROR.RPC_ERROR);
    }

    console.log(err, rsp, Date.now() - _t);
    const ret = {
      errCode: rsp.errCode || 0,
      errMsg: rsp.errMsg || '',
      text: rsp.message || ''
    };
    return cb(0, ret);
  });
};

module.exports = {
  recognize
};