/**
 * Created by pengfeixiang on 18/2/1.
 */

'use strict';

const fs = require('fs');
const path = require('path');
const spawn = require('child_process').spawn;

const DATA_DIR = process.env.PWD;
const DATA_FILE =  path.join(DATA_DIR, './data.txt');
const MANIFEST_FILE = path.join(DATA_DIR, './data.manifest');

let jsonArr = fs.readFileSync(DATA_FILE, 'utf8').split('\n');
jsonArr = jsonArr.map((str) => {
    return JSON.parse(str);
});


const unpack = (input, cb) => {
    const cmd = spawn('tar', ['-zxvf', input.file, '-C', DATA_DIR]);

    cmd.stdout.on('data', (data) => {
        //console.log(`stdout: ${data}`);
    });

    cmd.stderr.on('data', (data) => {
        // console.log(`stderr: ${data}`);
    });

    cmd.on('close', (code) => {
        // console.log(`vad child process exited with code ${code}`);
        return cb(+code);
    });
};


const unpackDir = (cb, index = 0) => {
    if (!jsonArr[index]) {
        return cb(0);
    }

    const json = jsonArr[index];

    if (fs.existsSync(path.join(DATA_DIR, json.taskId))) {
        console.log(`${json.taskId} existed, ignore unpack`);
        return unpackDir(cb, ++index);
    }

    const file = path.join(DATA_DIR, json._id + '.tar.gz');
    console.log('unpack ', file);

    return unpack({ file }, (err) => {
        if (err) {
            return cb(err);
        }

        return unpackDir(cb, ++index);
    });
};

const prepareWavData = (cb) => {
    return unpackDir(cb);
};

const createManifest = () => {
    const retArr = [];
    jsonArr.forEach((json) => {
        const durationMap = {};
        for (let i = 0; i < json.wavList.length; i++) {
            durationMap[json.wavList[i]] = json.durationList[i] / 1000;
        }

        const obj = json.result[json.result.length - 1];

        for (let i = 0; i < obj.wavList.length; i++) {
            const ret = {
                audio_filepath: path.join(DATA_DIR, json.taskId, obj.wavList[i]), //TODO
                duration: durationMap[obj.wavList[i]],
                text: obj.textList[i].replace(/\s+/g, '')
            };
            retArr.push(JSON.stringify(ret));
        }
    });
    fs.writeFileSync(MANIFEST_FILE, retArr.join('\n'));
    console.log(`create finished: ${MANIFEST_FILE} `);
};

const run = () => {
    prepareWavData((err) => {
        if (err) {
            console.error(err);
            return process.exit(-1);
        }
        createManifest();
        process.exit(0);
    });
};

run();

