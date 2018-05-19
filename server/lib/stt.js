/**
 * Created by pengfeixiang on 18/1/3.
 */

'use strict';

const config = require('../config/config');
const path = require('path');
const grpc = require('grpc');
const ERROR = require('../config/error');
const node = require('../config/rpc').node;
const ADDR = `${node.STT.host}:${node.STT.port}`;
const ADDR_BETA = `${node.STT_BETA.host}:${node.STT_BETA.port}`;

const PROTO_PATH = path.join(__dirname, '../lib/login.proto');
const LOGIN = grpc.load(PROTO_PATH).login;

const recognize = (input, cb) => {
    const client = new LOGIN.Verify(input.isBeta ? ADDR_BETA : ADDR, grpc.credentials.createInsecure());
    const req = {
        type: input.type || 'voice',
        name: input.name || '',
        password: input.password || '',
        binData: input.buffer ? input.buffer : new Buffer(0)
    };

    // console.log(req);

    const _t = Date.now();
    client.commonVerify(req, function(err, rsp = {}) {
        grpc.closeClient(client);

        if (err) {
            console.error(err);
            return cb(ERROR.RPC_ERROR);
        }

        // console.log(err, rsp, Date.now() - _t);
        const ret = {
            errCode: rsp.errCode || 0,
            errMsg: rsp.errMsg || '',
            text: rsp.userName || ''
        };

        if (config.enableBetaSttTextFilter) {
            if (/^[我|你]/.test(ret.text) && (!/^[我|你][是|好|的|们|在|很]/.test(ret.text))) {
                ret.text = ret.text.replace(/^[我|你]/, '');
            }

            ret.text = ret.text.replace(/女子/g, '好');
        }

        return cb(0, ret);
    });
};

module.exports = {
    recognize
};
