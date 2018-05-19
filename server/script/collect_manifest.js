/**
 * Created by pengfeixiang on 18/2/2.
 */

'use strict';

const MERGE_AISHELL = false;
const path = require('path');
const spawn = require('child_process').spawn;
const fs = require('fs');

const FILE = 'data.manifest';

const ROOT = '/data2/samba_share/self_wav_storage';
const fileList = [];
const lines = [];

const readDirSync = (dir) => {
    const file = path.join(dir, FILE);
    if (fs.existsSync(file)) {
        fileList.push(file);
        return;
    }

    const pa = fs.readdirSync(dir, 'utf8');
    pa.forEach((ele) => {
        const info = fs.statSync(path.join(dir, ele));
        if (info.isDirectory()) {
            readDirSync(path.join(dir, ele));
        }
    });
};

readDirSync(ROOT);
console.log('find manifest at ------\n', fileList.join('\n'));

fileList.forEach((file) => {
    const lineArr = fs.readFileSync(file, 'utf8').split('\n');
    lineArr.forEach((line) => {
        line && lines.push(line);
    });
});

fs.writeFileSync('./data.manifest.' + Date.now(), lines.join('\n'));
