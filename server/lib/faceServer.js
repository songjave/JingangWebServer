/**
 * Created by pengfeixiang on 18/1/6.
 */

'use strict';

const node = require('../config/rpc').node;
const addr = `${node.FACE.host}:${node.FACE.port}`;
const jingang  = require('../lib/jingang');

const ping = (cb) => {
    jingang.ping({addr}, cb);
};


const reload = (input, cb) => {
    const jsonData = {
        op: 'reload',
    };

    const obj = {
        addr,
        timeout: 30000,
        req: { jsonData }
    };

    jingang.execute(obj, cb);
};


const clear = (input, cb) => {
    const jsonData = {
        op: 'clear',
    };

    const obj = {
        addr,
        timeout: 10000,
        req: { jsonData }
    };

    jingang.execute(obj, cb);
};


const inspect = (input, cb) => {
    const jsonData = {
        op: 'inspect',
    };

    const obj = {
        addr,
        req: { jsonData }
    };

    jingang.execute(obj, (err, result = {}) => {
        return cb(err, result.jsonData || {});
    });
};


const del = (input, cb) => {
    const jsonData = {
        op: 'delete',
        id: input.uid || ''
    };

    const obj = {
        addr,
        req: { jsonData }
    };

    jingang.execute(obj, cb);
};


const add = (input, cb) => {
    const jsonData = {
        op: 'add',
        id: input.uid || ''
    };

    const obj = {
        addr,
        req: {
            jsonData,
            binData: input.buffer
        }
    };

    jingang.execute(obj, cb);
};


const verify = (input, cb) => {
    const jsonData = {
        op: 'verify'
    };

    const obj = {
        addr,
        req: {
            jsonData,
            binData: input.buffer
        }
    };

    // console.log(obj.req);

    jingang.execute(obj, (err, result = {}) => {
        return cb(err, result.jsonData || {});
    });
};


const check_image_valid = (input, cb) => {
    const jsonData = {
        op: 'check_image_valid',
    };

    const obj = {
        addr,
        req: {
            jsonData,
            binData: input.buffer
        }
    };

    jingang.execute(obj, cb);
};


module.exports = {
    ping,
    add,
    del,
    clear,
    inspect,
    reload,
    verify,
    check_image_valid
};
