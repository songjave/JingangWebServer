/**
 * Created by pengfeixiang on 18/2/4.
 */

const fs = require('fs');
const path = require('path');

const ROOT = '/data2/samba_share/wyy_wav_storage';
const fileFormat = require('../lib/fileFormat');
const iconv = require('iconv-lite');

const readDirSync = (dir) => {
    const pa = fs.readdirSync(dir, 'utf8');
    pa.forEach((ele) => {
        const info = fs.statSync(path.join(dir, ele));
        if (info.isDirectory()) {
            readDirSync(path.join(dir, ele));
        }
        else if (/\.txt/.test(ele)) {
            const textPath = path.join(dir, ele);
            return fileFormat.isGbkTextFile(textPath, (err, isGbk) => {
                if (isGbk) {
                    const buffer = iconv.decode(fs.readFileSync(textPath), "gbk");
                    fs.writeFileSync(textPath, buffer);
                    console.log('rewrite', ele);
                }
            });
        }
    });
};

readDirSync(ROOT);


