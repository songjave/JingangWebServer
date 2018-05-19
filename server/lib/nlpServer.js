/**
 * Created by pengfeixiang on 18/1/6.
 */

'use strict';

const node = require('../config/rpc').node;
const addr = `${node.NLP.host}:${node.NLP.port}`;
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


const inspect = (input, cb) => {
    const jsonData = {
        op: 'inspect',
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


const query = (input, cb) => {
    const jsonData = {
        op: input.op || 'query',
        question: input.question || '',
        link: input.link || '',
        id: input.uid || '',
        role: input.role || ''
    };

    console.log(jsonData);

    const obj = {
        addr,
        timeout: 30000,
        req: {
            jsonData,
        }
    };

    jingang.execute(obj, (err, result = {}) => {
        return cb(err, result);
    });
};

const segmentation = (input, cb) => {
    const jsonData = {
        op: 'segmentation',
        question: input.question || '',
        link: input.link || '',
        id: input.uid || ''
    };

    const obj = {
        addr,
        timeout: 5000,
        req: {
            jsonData,
        }
    };

    jingang.execute(obj, (err, result = {}) => {

        return cb(err, result);
    });
};


module.exports = {
    ping,
    add,
    query,
    reload,
    inspect,
    segmentation
};
