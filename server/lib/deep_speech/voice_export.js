/**
 * Created by pengfeixiang on 18/1/28.
 */

'use strict';

const path = require('path');
const spawn = require('child_process').spawn;

const doExport = (input) => {
    return new Promise((resolve, reject) => {
        const scriptFile = path.join(__dirname, '../../script/voice_data_export.js');
        input.date = input.date || '';
        const cmd = spawn('node', [scriptFile, input.date, input.id]);

        const dataArr = [];
        const errArr = [];

        cmd.stdout.on('data', (data) => {
            console.log(`stdout: ${data}`);
            dataArr.push(data);
        });

        cmd.stderr.on('data', (data) => {
            console.log(`stderr: ${data}`);
            errArr.push(data);
        });

        cmd.on('close', (code) => {
            if (code) {
                console.error(errArr.join(''));
                return resolve({status: -1});
            }

            let ret = {};
            try {
                ret = JSON.parse(dataArr.join(''));
                ret.status = 1;
            } catch(e) {
                ret =  {status: -2};
            }
            return resolve(ret);
        });
    });
};

module.exports = {
    doExport
};
