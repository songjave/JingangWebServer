/**
 * Created by pengfeixiang on 18/2/5.
 */

'use strict';

const node = require('../config/rpc').node;
const addr = `${node.KEYFRAME.host}:${node.KEYFRAME.port}`;
const jingang  = require('../lib/jingang');

const ping = (cb) => {
    jingang.ping({addr}, cb);
};


const extract = (input, cb) => {
    const jsonData = {
        op: 'extract',
        inputFile: input.inputFile.replace(/^.*web_storage/, '/web_storage'),
        outputDir: input.outputDir.replace(/^.*web_storage/, '/web_storage')
    };

    console.log(jsonData);

    const obj = {
        addr,
        timeout: 3000,
        req: {
            op: 'keyframe',
            jsonData
        }
    };

    jingang.execute(obj, cb);
};

module.exports = {
    ping,
    extract
};
