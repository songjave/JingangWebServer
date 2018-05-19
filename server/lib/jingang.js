/**
 * Created by pengfeixiang on 17/12/18.
 */

'use strict';

const path = require('path');
const grpc = require('grpc');
const ERROR = require('../config/error');

const PROTO_PATH = path.join(__dirname, '../lib/jingang.proto');
const JG = grpc.load(PROTO_PATH).jingang;
const TIMEOUT = 1000 * 10; //10s

const execute = (input, cb) => {
    const client = new JG.Common(input.addr, grpc.credentials.createInsecure());
    const req = input.req || {};

    if (typeof req.jsonData === 'object') {
        req.jsonData = JSON.stringify(req.jsonData);
    }

    const _t = Date.now();
    const deadline = new Date(Date.now() + (input.timeout || TIMEOUT));
    client.execute(req, {deadline}, (err, rsp = {}) =>  {
        grpc.closeClient(client);
        if (err) {
            console.error(err);
            return cb(ERROR.RPC_ERROR);
        }

        if (rsp.jsonData) {
            rsp.jsonData = JSON.parse(rsp.jsonData);
        }

        console.log('rsp', rsp);
        //console.log(err, rsp, Date.now() - _t);
        return cb(0, rsp);
    });
};


const ping = (input, cb) => {
    input.timeout = 500;
    const client = new JG.Common(input.addr, grpc.credentials.createInsecure());

    const _t = Date.now();
    const deadline = new Date(Date.now() + (input.timeout || TIMEOUT));

    client.ping({}, {deadline}, (err, rsp = {}) =>  {
        grpc.closeClient(client);
        if (err) {
            console.error(err);
            return cb(ERROR.RPC_ERROR);
        }
        console.log(err, rsp, Date.now() - _t);
        return cb(rsp.errCode || 0, rsp);
    });
};

module.exports = {
    execute,
    ping
};

