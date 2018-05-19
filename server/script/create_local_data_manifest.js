/**
 * Created by pengfeixiang on 18/2/1.
 */

'use strict';

const fs = require('fs');
const path = require('path');

const TARGET_DIR = '/data2/samba_share/offline_manifest_storage';
const ROOT = '/data2/samba_share/wyy_wav_storage';
const MANIFEST_FILE = 'data.manifest';
const VAD_FILE = 'vad.json';

const list = [];
const stat = {
    duration:  0,
    textLen: 0,
};

const dealSubManifest = (file) => {
    const lines = fs.readFileSync(file, 'utf8').split('\n');
    lines.forEach((line) => {
        if (!line ) {
            return;
        }

        list.push(line);
        const obj = JSON.parse(line);
        stat.duration += obj.duration;
        stat.textLen += obj.text.length;
    });
};

const readDirSync = (dir) => {
    const manifest = path.join(dir, MANIFEST_FILE);
    if (fs.existsSync(manifest)) {
        return dealSubManifest(manifest);
    }

    const pa = fs.readdirSync(dir, 'utf8');

    const vad = path.join(dir, VAD_FILE);
    const hasVad = fs.existsSync(vad);
    pa.forEach((ele) => {
        const info = fs.statSync(path.join(dir, ele));
        if (info.isDirectory()) {
            readDirSync(path.join(dir, ele));
        }
        else if (/\.txt/.test(ele) && hasVad) {
            const json = JSON.parse(fs.readFileSync(vad, 'utf8'));
            const textArr = fs.readFileSync(path.join(dir, ele), 'utf8').split('\n');
            const durationMap = {};
            for(let i = 0; i < json.wavList.length; i++) {
                durationMap[json.wavList[i]] = json.durationList[i] / 1000;
            }

            textArr.forEach((line) => {
                line = line.trim();
                if (!line) {
                    return ;
                }

                const arr = line.split('###');
                if (arr.length !== 2) {
                    throw new Error(`${dir} txt文件解析异常`);
                }

                if (pa.indexOf(arr[0]) < 0 || !arr[1].trim()) {
                    throw new Error(`${dir} txt文件解析异常`);
                }

                const ret = {
                    audio_filepath: path.join(dir, arr[0]),
                    duration: durationMap[arr[0]],
                    text: arr[1].replace(/\s+/g, '')
                };

                stat.duration += ret.duration || 0;
                stat.textLen += ret.text.length;
                list.push(JSON.stringify(ret));
            });
        }
    });
};


readDirSync(ROOT);
fs.writeFileSync(path.join(TARGET_DIR, `data.manifest.${stat.duration}.${stat.textLen}`), list.join('\n'));


