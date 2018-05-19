/**
 * Created by pengfeixiang on 18/1/30.
 */

const core = require('../core/stt');
const baidu_online = require('../lib/baidu_online');
const fs = require('fs');
// const buffer = fs.readFileSync('./pfx_16k.wav');

const path = require('path');
const filePath = '/offline_wav_storage/gaoyuanyuan_1_34' || path.join(__dirname, './vad');
const _fileList = fs.readdirSync(filePath);
const fileList = [];

_fileList.forEach((file) => {
    /\.wav$/.test(file) && fileList.push(file);
});

fileList.sort((a, b) => {
    return parseInt(a) - parseInt(b);
});

const run = (index = 0) => {
    if (!fileList[index]) {
        return console.log('done');
    }

    //console.log(fileList[index]);
    const buffer = fs.readFileSync(path.join(filePath, fileList[index]));

    if (buffer.length > 570 * 1024) {
        index ++;
        console.log('to long');
        return run(index);
    }

    return core.recognize({ buffer, isBeta: true }, (err, data = {}) => {
        index ++;
        console.log(index, data.text || '---');
        return run(index);
    });
};



run();


