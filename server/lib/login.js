/**
 * Created by pengfeixiang on 17/12/18.
 */

'use strict';

const path = require('path');
const grpc = require('grpc');
const ERROR = require('../config/error');

const PROTO_PATH = path.join(__dirname, '../lib/login.proto');
const LOGIN = grpc.load(PROTO_PATH).login;
const ADDR = '10.0.0.26:9017';

const JSON_FILE = path.join(__dirname, '../db/user.json');
const db = require(JSON_FILE);

const verify = (input, cb) => {
  console.log(input);
  const client = new LOGIN.Verify(ADDR, grpc.credentials.createInsecure());
  const req = {
    type: input.type || 'face',
    name: input.name || '',
    password: input.password || '',
    binData: input.buffer ? input.buffer : new Buffer(0)
  };

  console.log(req);

  const _t = Date.now();
  client.commonVerify(req, function(err, rsp = {}) {
    if (err) {
      console.error(err);
      return cb(ERROR.RPC_ERROR);
    }

    console.log(err, rsp, Date.now() - _t);
    rsp.type = input.name ? 'enroll' : 'predict';
    return cb(0, rsp);
  });
};

module.exports = {
  verify
};

