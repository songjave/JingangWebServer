/**
 * Created by pengfeixiang on 18/1/31.
 */

'use strict';

const path = require('path');
const fs = require('fs');
const vad = require('../lib/vad');
const ffmpeg = require('../lib/ffmpeg');
const textFormat = require('../lib/text_formatter');
const fileFormat = require('../lib/fileFormat');
const iconv = require('iconv-lite');
const mkdirp = require('mkdirp');
const jieba = require('../lib/jieba');
// const json2excel = require('json2excel');
const PromisePool = require('es6-promise-pool');

const SOURCE_DIR = '/Users/pengfeixiang/Documents/resource' || '/data2/samba_share/songting_lixian_yinpin';
const TARGET_DIR = '/offline_wav_storage' || '/data2/samba_share/offline_wav_storage';
const PREFIX = '';
const stt = require('../core/stt');
const baidu_online = require('../lib/baidu_online');

const USE_BAIDU_ONLINE_STT = true;

const doSttPromise = (obj, index) => {
    return new Promise(function (resolve, reject) {
        obj.textList = obj.textList || [];
        const wavFile = obj.vad.wavList[index];
        const buffer = fs.readFileSync(path.join(obj.targetDir, wavFile));

        if (!USE_BAIDU_ONLINE_STT && buffer.length > 570 * 1024) {
            obj.textList[index] = '音频过长';
            return resolve('音频过长');
        }

        const proxy = USE_BAIDU_ONLINE_STT ? baidu_online : stt;
        return proxy.recognize({buffer, isBeta: true}, (err, result = {}) => {
            if (err) {
                obj.textList[index] = '识别异常';
                return resolve('识别异常');
            }

            console.log(wavFile, result.text);
            obj.textList[index] = result.text || '';
            return resolve(result.text || '');
        });
    });
};


const doStt = (obj, cb) => {
    obj.textList = obj.textList || [];
    obj.vad.wavList = obj.vad.wavList || [];

    const generatePromises = function * () {
        for (let i = 0; i < obj.vad.wavList.length; i++) {
            yield doSttPromise(obj, i);
        }
    };

    const promiseIterator = generatePromises();
    const pool = new PromisePool(promiseIterator, 20);

    pool.start().then(() => {
        return cb(0);
    }).catch((err) => {
        console.log(err);
        return cb(err);
    });
};

const doStt2 = (obj, cb, index = 0) => {
    obj.textList = obj.textList || [];

    if (!obj.vad || !obj.vad.wavList) {
        return cb(0);
    }

    const wavFile = obj.vad.wavList[index];
    if (!wavFile) {
        return cb(0);
    }

    const buffer = fs.readFileSync(path.join(obj.targetDir, wavFile));
    if (!USE_BAIDU_ONLINE_STT && buffer.length > 570 * 1024) {
        obj.textList.push('音频过长');
        return doStt(obj, cb, ++index);
    }

    const proxy = USE_BAIDU_ONLINE_STT ? baidu_online : stt;
    return proxy.recognize({buffer, isBeta: true}, (err, result = {}) => {
        if (err) {
            console.error(err, path.join(obj.targetDir, wavFile));
            obj.textList.push('识别异常');
        }
        else {
            console.log(wavFile, result.text);
            obj.textList.push(result.text || '');
        }

        return doStt(obj, cb, ++index);
    });
};

const formatAudio = (obj, cb) => {
    const params = {};
    params.path = obj.sourceDir;
    params.in = obj.audio;
    params.out = 'converted.wav';
    ffmpeg.toWav16k(params, (err) => {
        return cb(err);
    });
};

const formatText = (obj, cb) => {
    if (!obj.text) {
        return cb(0);
    }

    const textPath = path.join(obj.sourceDir, obj.text);
    let buffer = fs.readFileSync(textPath);

    return fileFormat.isGbkTextFile(textPath, (err, isGbk) => {
        if (isGbk) {
            buffer = iconv.decode(buffer, "gbk");
        }

        fs.writeFileSync(path.join(obj.sourceDir, 'converted.txt'), buffer);
        return cb(0);
    });
};

const getDirList = () => {
    const arr = fs.readdirSync(SOURCE_DIR);
    const ret = [];

    let list  =[];
    arr.forEach((mainDir) => {
        if (/^\./.test(mainDir)) {
            return;
        }
        const dirs = fs.readdirSync(path.join(SOURCE_DIR, mainDir));
        dirs.forEach((subDir) => {
            if (/^\./.test(subDir)) {
                return;
            }
            list.push({
                mainDir: mainDir,
                subDir: subDir,
                absPath: path.join(SOURCE_DIR, mainDir, subDir)
            });
        });
    });

    list.forEach((item) => {
        const obj = {
            mainDir: item.mainDir,
            subDir: item.subDir,
            uuid: item.subDir.length >= 10 ? item.subDir : item.mainDir + item.subDir
        };

        const files = fs.readdirSync(item.absPath);
        files.forEach((file) => {
            /\.wav$/i.test(file) && !/converted\.wav/.test(file) && (obj.audio = file);
            /\.txt$/i.test(file) && !/converted\.txt$/.test(file) && (obj.text = file);
        });

        if (obj.audio) {
            obj.targetDir = path.join(TARGET_DIR, obj.uuid);
            obj.sourceDir = item.absPath;
            ret.push(obj);
            mkdirp.sync(obj.targetDir);
        }
        else {
            console.error(`invalid dir ${item}`);
        }
    });

    return ret;
};


const doVad = (obj, cb) => {
    const params = {
        path: obj.sourceDir,
        file: 'converted.wav',
        targetPath: obj.targetDir,
        aggressiveness: obj.aggressiveness || 2
    };

    vad.run(params, (err, result = {}) => {
        if (err) {
            return cb(err);
        }


        if (params.aggressiveness === 2 && result.duration / result.wavList.length > 4000) { //平均时长大于4秒，使用 aggressiveness 3
            obj.aggressiveness = 3;
            return doVad(obj, cb);
        }

        obj.vad = result;
        obj.time = Date.now();
        obj.aggressiveness = params.aggressiveness;

        fs.writeFileSync(path.join(obj.targetDir, 'vad.json'), JSON.stringify(obj, null, 4));
        return cb(0);
    });
};


const doTextSplit = (obj, cb) => {
    const doSave = (textList, len) => {
        const retArr = [];
        const itemArr = [];

        for(let i = 0; i < len; i++) {
            retArr.push(`${obj.vad.wavList[i] || ''}###${textList[i] || ''}`);
            itemArr.push({
                audio: obj.vad.wavList[i] || '',
                text: textList[i] || ''
            });
        }

        fs.writeFileSync(path.join(obj.targetDir, obj.uuid + '.txt'), retArr.join('\r\n'));
        if (obj.referenceText) {
            const buffer = fs.readFileSync(path.join(obj.sourceDir, obj.referenceText));
            fs.writeFileSync(path.join(obj.targetDir,  '参考字幕.txt'), buffer);
        }

        return cb(0);

        /*const toExcel = {
            sheets: [{
                header: {
                    'audio': 'audio',
                    'text': 'text'
                },
                items: itemArr,
                sheetName: 'sheet1',
            }],
            filepath: path.join(obj.targetDir, obj.uuid + '.xlsx')
        };

        json2excel.j2e(toExcel,function(err){
            if (err) {
                return cb(err);
            }
            return cb(0);
        });*/
    };

    if (obj.text) { //自带字幕
        const text = fs.readFileSync(path.join(obj.sourceDir, 'converted.txt'), 'utf8');
        const textList = jieba.segmentSync({textList : textFormat(text)});
        const len = textList.length >= obj.vad.wavList.length ? textList.length : obj.vad.wavList.length;
        return doSave(textList, len);
    }

    return doStt(obj, (err) => {
        if (err) {
            return cb(err);
        }

        const textList = jieba.segmentSync({textList : obj.textList});
        const len = textList.length;

        return doSave(textList, len);
    });
};

const run = (list, cb, index = 0) => {
    if (!list[index]) {
        return cb(0);
    }

    const obj = list[index];

    if (fs.existsSync(path.join(obj.sourceDir, 'parsed.txt'))) {
        console.log(obj.sourceDir, ' already parsed, ignore it');
        return run(list, cb, ++index);
    }

    console.log(`【${obj.sourceDir}】  start----`);
    return formatAudio(obj, (err) => {
        if (err) {
            return cb(err);
        }
        console.log('formatAudio finished');

        return formatText(obj, (err) => {
            if (err) {
                return cb(err);
            }
            console.log('formatText finished');

            return doVad(obj, (err) => {
                if (err) {
                    return cb(err);
                }
                console.log('doVad finished');

                return doTextSplit(obj, (err) => {
                    if (err) {
                        return cb(err);
                    }

                    fs.writeFileSync(path.join(obj.sourceDir, 'parsed.txt'), Date.now().toString());
                    console.log('doTextSplit finished');

                    console.log(`【${obj.sourceDir}】  end----`);
                    return run(list, cb, ++index);
                });
            });
        });
    });
};


const list = getDirList();
run(list, (err) => {
    console.log(err);
});
