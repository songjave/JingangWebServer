/**
 * Created by pengfeixiang on 18/2/5.
 */

'use strict';

const node = require('../config/rpc').node;
const addr = `${node.DETECTRON.host}:${node.DETECTRON.port}`;
const jingang  = require('../lib/jingang');

const ping = (cb) => {
    jingang.ping({addr}, cb);
};


const detect = (input, cb) => {
    const jsonData = {
        op: 'detect',
        inputDir: input.inputDir.replace(/^.*web_storage/, '/web_storage'),
        outputDir: input.outputDir.replace(/^.*web_storage/, '/web_storage')
    };

    const obj = {
        addr,
        timeout: 3000,
        req: {
            op: 'detectron',
            jsonData
        }
    };

    jingang.execute(obj, cb);
};

module.exports = {
    ping,
    detect
};
