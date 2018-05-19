'use strict';

const path = require('path');
const spawn = require('child_process').spawn;
const tmp = require('tmp');
const fs = require('fs');

const convert = (input, cb) => {
    const ar = input.need8k ? '8000' : '16000';
    const ffmpeg = spawn('ffmpeg', ['-i', input.inputFile, '-acodec', 'pcm_s16le', '-ar', ar, '-ac', '1', '-y', input.outputFile]);

    ffmpeg.stdout.on('data', (data) => {
        //console.log(`stdout: ${data}`);
    });

    ffmpeg.stderr.on('data', (data) => {
        // console.log(`stderr: ${data}`);
    });

    ffmpeg.on('close', (code) => {
        // console.log(`vad child process exited with code ${code}`);
        return cb(+code);
    });
};

const toWav16k = (input, cb) => {
    const inputFile = path.join(input.path, input.in);
    const outputFile = path.join(input.path, input.out);
    return convert({inputFile, outputFile}, cb);
};

//TODO 回调金字塔
const bufferConvert = (input, cb) => {
    return tmp.file({ postfix: '.wav' }, (err, sourcePath, fd, cleanupCb) => {
        if (err) { return cb(err); }
        return tmp.file({ postfix: '.wav' }, (err, targetPath, fd, cleanupCb2) => {
            if (err) { cleanupCb(); return cb(err); }
            return fs.writeFile(sourcePath, input.buffer, (err) => {
                if (err) { cleanupCb(); cleanupCb2(); return cb(err); }
                return convert({inputFile: sourcePath, outputFile: targetPath, need8k: input.need8k }, (err) => {
                    if (err) { cleanupCb(); cleanupCb2(); return cb(err); }
                    return fs.readFile(targetPath, (err, data) => {
                        cleanupCb();
                        cleanupCb2();
                        input.buffer = data;
                        return cb(err|| 0);
                    });
                });
            });
        });
    });
};

module.exports = {
	toWav16k,
    bufferConvert
};
