'use strict';

const express = require('express');
const router = express.Router();
const config = require('../config/config');
const multer  = require('multer');
const upload = multer({ storage: multer.memoryStorage() });
const vad = require('../lib/vad');
const wtt = require('../lib/wavStt');
const mkdirp = require('mkdirp');
const path = require('path');
const fs = require('fs');
const jieba = require('../lib/jieba');
const iconv = require('iconv-lite');
const ffmpeg = require('../lib/ffmpeg');

const ERROR = require('../config/error');
const format = require('../lib/text_formatter');
const fileFormat = require('../lib/fileFormat');
const core = require('../core/tools/sts');
const db = require('../db/deep_speech');

router.post('/text_parse', upload.single('txt'), (req, res) => {
    if (!req.body.userId || !req.body.docId) {
        return res.trans(ERROR.PARAMS_MISSING, {errMsg: 'missing taskId'});
    }

    const taskId = '' + Date.now() + '_' + req.body.userId + '_' + req.body.docId;
    const fullDir = path.join(config.webStoragePath, './sts/' + taskId);

    return mkdirp(fullDir, function (err) {
        const uploadFilePath = path.join(fullDir, 'upload.txt');
        return fs.writeFile(uploadFilePath, req.file.buffer, (err) => {
            let  output = req.file.buffer;
            fileFormat.isGbkTextFile(uploadFilePath, (err, isGbk) => {
                if (err) {
                    return res.trans(err);
                }

                if (isGbk) {
                    output = iconv.decode(req.file.buffer, "gbk");
                }

                const originText = output.toString();
                const toSave = {
                    taskId,
                    originText,
                    userId: req.body.userId,
                    docId: req.body.docId,
                    uploadDir: fullDir,
                    originTextList: format(originText),
                };

                return core.insert(toSave, res.trans);
            });
        });
    });
});


const doWavParse = (json, cb) => {
    const fullDir = path.join(config.webStoragePath, './sts/' + json.taskId);
    const vadParams = {
        file: 'origin.wav',
        path: fullDir,
        aggressiveness: json.aggressiveness
    };
    return vad.run(vadParams, (err, result = {}) => {
        if (err) {
            return cb(err);
        }

        const splitedReviewedTextList = jieba.segmentSync({textList : json.textList});

        return db.getById(json.id).then((item) => {
            console.log(Object.keys(item));
            item.result = [];
            item.reviewedTextList = json.textList;
            item.duration =  result.duration || 0;
            item.durationList = result.durationList || [];
            item.wavList = result.wavList || [];
            item.splitedReviewedTextList = splitedReviewedTextList;
            return db.updateById(json.id, item);
        }).then(() => {
            return cb(0, {
                id: json.id,
                location: '/sts/' + json.taskId,
                textList: splitedReviewedTextList,
                wavList: result.wavList || []
            });
        }).catch((err) => {
            console.error(err);
            return cb(-1, {errMsg: '数据库错误'});
        });
    });
};


router.post('/wav_parse', upload.single('wav'), (req, res) => {
    if (!req.body.jsonData) {
        return res.trans(ERROR.PARAMS_MISSING, {errMsg: 'missing jsonData'});
    }

    const json = JSON.parse(req.body.jsonData);

    if (!json.taskId || !json.textList || !json.id) {
        return res.trans(ERROR.PARAMS_MISSING, {errMsg: 'missing taskId or textList or id'});
    }

    const fullDir = path.join(config.webStoragePath, './sts/' + json.taskId);
    const filePath = path.join(fullDir, 'upload.wav');

    return fs.writeFile(filePath, req.file.buffer, (err) => {
        if (err) {
            return res.trans(ERROR.UNKNOWN);
        }

        const params = {
            path: fullDir,
            in: 'upload.wav',
            out: 'origin.wav'
        };

        return ffmpeg.toWav16k(params, (err) => {
            if (err) {
                return res.trans(-1, {errMsg: 'ffmpeg 转换音频失败，请联系管理员确认音频格式'});
            }
            return doWavParse(json, (err, data) => {
                return res.trans(err, data);
            })
        });
    });
});


router.get('/task/:id', (req, res) => {
    const id = req.params.id;
    return db.getById(id).then((result = {}) => {
        result.location = '/sts/' + result.taskId;
        return res.trans(0, result);
    }).catch((err) => {
        console.error(err);
        return res.trans(ERROR.UNKNOWN, {errMsg: '数据库读取失败'});
    });
});


router.get('/task/:id/:version', (req, res) => {
    const id = req.params.id;
    const version = +(req.params.version);
    return core.getById({ id }, (err, data = {}) => {
        if (err) {
            return res.trans(ERROR.UNKNOWN, {errMsg: '数据库读取失败'});
        }

        if (!data) {
            return res.trans(ERROR.PARAMS_INVALID, {errMsg: 'id不存在'});
        }

        data.result = data.result || [];
        for (let i = 0; i < data.result.length; i++) {
            if (data.result[i].version === version) {
                const ret = data.result[i];
                ret.id = id;
                ret.taskId = data.taskId;
                ret.location = '/sts/' + data.taskId;
                return res.trans(0, ret);
            }
        }

        return res.trans(ERROR.PARAMS_INVALID, {errMsg: '此版本不存在'});
    });
});


router.get('/task', (req, res) => {
    return core.list(req.query, res.trans);
});


router.post('/task/:id', (req, res) => {
    const id = req.params.id;
    if (req.query._op === 'del' ) {
        return core.delById({ id }, res.trans);
    }

    return res.trans(ERROR.UNSUPPORTED);
});


router.get('/wavStt', (req, res) => {
    return wtt.wavToText(req.query.path, (err, data = {}) => {
        return res.trans(err, data);
    });
});


router.post('/submit', upload.none(), (req, res) => {
    if (!req.body.jsonData) {
        return res.trans(ERROR.PARAMS_MISSING, {errMsg: 'missing jsonData'});
    }

    const json = JSON.parse(req.body.jsonData);

    if (!json.taskId || !json.id || !json.wavList || !json.textList) {
        return res.trans(ERROR.PARAMS_MISSING, {errMsg: 'missing taskId or id or wavList or textList'});
    }

    const fullDir = path.join(config.webStoragePath, './sts/' + json.taskId);

    const resultBakList = [];
    const len = json.textList.length;
    for (let i = 0; i < len; i++) {
        resultBakList.push(`${json.wavList[i]}|||${json.textList[i]}`);
    }
    return fs.writeFile(path.join(fullDir, 'parsed.txt'), resultBakList.join('\r\n'), (err) => {
        if (err) {
            return res.trans(-1, {errMsg: '写入文件错误'});
        }

        const toUpdate = {
            editor: json.editor || json.userId || '',
            updateAt: Date.now(),
            textList: json.textList,
            wavList: json.wavList,
            fromVersion: json.fromVersion || 0
        };

        if (json.fromVersion === undefined || json.fromVersion < 0) {
            toUpdate.status = 0; //未被审查
            toUpdate.version = 0;
        }
        else {
            toUpdate.status = 1; //已被审查
            toUpdate.version = json.fromVersion + 1; //TODO 增加+100逻辑
        }

        return db.getById(json.id).then((item) => {
            const durationObj = {};
            for (let i = 0; i < item.wavList.length; i++) {
                durationObj[item.wavList[i]] = item.durationList[i];
            }
            toUpdate.duration = 0;
            json.wavList.forEach((name) => {
                toUpdate.duration += durationObj[name];
            });

            item.result = item.result || [];
            item.result.push(toUpdate);
            return db.updateById(json.id, item);
        }).then(() => {
            return res.trans(0);
        }).catch((err) => {
            console.error(err);
            return res.trans(-1, {errMsg: '数据库错误'});
        });
    });
});


module.exports = router;
