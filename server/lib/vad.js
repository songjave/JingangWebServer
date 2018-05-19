'use strict';

const path = require('path');
const spawn = require('child_process').spawn;


const run = (input, cb) => {
    const PY_PATH = path.join(__dirname, './myvad2.py');
    input.aggressiveness = input.aggressiveness === undefined ? 1 : input.aggressiveness;
    //console.log('input.aggressiveness', input.aggressiveness);
    const params = [PY_PATH, input.aggressiveness, input.path, input.file];
    input.targetPath && params.push(input.targetPath);
    const vad = spawn('python2.7', params);

    const outArr = [];

    vad.stdout.on('data', (data) => {
        // console.log(`stdout: ${data}`);
    });

    vad.stderr.on('data', (data) => {
        outArr.push(data);
        // console.log(`stderr: ${data}`);
    });

    vad.on('close', (code) => {
        // console.log(`child process exited with code ${code}`);
        if (+code) {
            cb(+code || -1)
        }

        const list = outArr.join('').split('\n');
        let duration = 0;
        let durationList = [];
        let wavList = [];
        list.forEach((text) => {
            if (!text) {
                return;
            }
            const arr = text.split('|||');
            wavList.push(arr[0] + '.wav');
            durationList.push(parseInt(arr[1]));
            duration += parseInt(arr[1]);
        });

        return cb(0, {
            duration,
            durationList,
            wavList,
            // wavAbsoluteDir: input.path,
            originWav: input.file
        });
    });
};

module.exports = {
    run
};
