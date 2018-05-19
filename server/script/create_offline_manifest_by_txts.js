/**
 * Created by pengfeixiang on 18/2/4.
 */

const fs = require('fs');
const path = require('path');

const WAV_DIR = '/data2/samba_share/offline_wav_storage';
const TEXT_DIR = '/data2/samba_share/offline_txt_storage';
const TARGET_DIR = '/data2/samba_share/offline_manifest_storage';

const files = fs.readdirSync(TEXT_DIR);
const ret = [];
const stat = {
    duration:  0,
    textLen: 0,
};

const create = () => {
    files.forEach((txt) => {
        if (!/\.txt/.test(txt)) {
            return;
        }

        const name = txt.replace(/\.txt$/, '');
        const json = JSON.parse(fs.readFileSync(path.join(WAV_DIR, name, 'vad.json'), 'utf8'));
        const durationMap = {};
        for(let i = 0; i < json.wavList.length; i++) {
            durationMap[json.wavList[i]] = json.durationList[i];
        }

        const lines = fs.readFileSync(path.join(TEXT_DIR, txt), 'utf8').split('\n');


        lines.forEach((line) => {
            line = line.trim();
            if (!line) {
                return;
            }

            const arr = line.split('###');
            if (arr.length !== 2) {
                console.log(arr);
                throw new Error(`${txt} 文件解析异常`);
            }

            const str = arr[1].trim();
            if (!str) {
                return;
            }

            ret.push(JSON.stringify({
                audio_filepath: path.join(WAV_DIR, txt, arr[0]),
                duration: durationMap[arr[0]],
                text: arr[1].replace(/\s+/g, '')
            }));

            stat.duration += ret.duration || 0;
            stat.textLen += ret.text.length;
        });
    });
    fs.writeFileSync(path.join(TARGET_DIR, `data.manifest.${stat.duration}.${stat.textLen}`), ret.join('\n'));
};

create();

