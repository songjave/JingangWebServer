/**
 * Created by pengfeixiang on 18/2/3.
 */

'use strict';

const express = require('express');
const router = express.Router();
const config = require('../config/config');
const path = require('path');
const ERROR = require('../config/error');
const multer  = require('multer');
const uuid = require('uuid');
const mkdirp = require('mkdirp');
const upload = multer({ storage: multer.memoryStorage() });

const qa = require('../core/func/qa');
const da = require('../core/func/da');
const doc = require('../core/func/doc');
const videoInfo = require('../core/func/videoInfo');

const picDescribe = require('../lib/func/picDescribe');
const picTarget = require('../lib/func/picTarget');
const videoFrame = require('../lib/func/videoFrame');
const graph = require('../lib/func/graph');
const getResult = require('../lib/func/getResult');

router.post('/qa', upload.none(), (req, res) => {
    const data = req.body.json ? JSON.parse(req.body.json) : req.body;
    if (!data.question) {
        return res.trans( ERROR.PARAMS_MISSING, { errMsg: 'PARAMS_MISSING question' });
    }

    data.uid = req.session.uid || '';
    return qa.query(data, res.trans);
});

const getExt = (file) => {
    const index= file.originalname.lastIndexOf(".");
    const ext = file.originalname.substr(index+1);
    return '.' + ext;
};

// -----------动态数据采集----------------------

router.post('/da', (req, res) => {
    return da.insert(req.body, (err, data = {}) => {
        return res.trans(err, data);
    });
});

router.get('/da', (req, res) => {
    return da.list(req.query, (err, result = {}) => {
        res.trans(err, result);
    })
});

router.post('/da/:id', (req, res) => {
    req.body.id = req.params.id;
    if (req.query._op === 'del' ) {
        return da.delById(req.body, (err, result = {}) => {
            res.trans(err, result);
        });
    }

    return da.update(req.body, (err, result) => {
        res.trans(err, result);
    });
});

// -----------------文档录入----------------------

router.post('/doc', (req, res) => {
    return doc.insert(req.body, (err, data = {}) => {
        return res.trans(err, data);
    });
});

router.get('/doc', (req, res) => {
    return doc.list(req.query, (err, result = {}) => {
        res.trans(err, result);
    })
});

router.post('/doc/:id', (req, res) => {
    req.body.id = req.params.id;
    if (req.query._op === 'del' ) {
        return doc.delById(req.body, (err, result = {}) => {
            res.trans(err, result);
        });
    }

    return doc.update(req.body, (err, result) => {
        res.trans(err, result);
    });
});

// -------------------图片自动描述-----------------------

const picDescribeUpload = multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            const dir = path.join(config.webStoragePath, `./picDescribe/${uuid.v4()}/`);
            mkdirp(dir, (err) => {
                if (err) {
                    console.error(err);
                    return cb(err);
                }
                return cb(null, dir);
            });
        },
        filename: (req, file, cb) => {
            return cb(null, `${uuid.v4() + getExt(file)}`);
        }
    })
});

router.post('/pic_describe', picDescribeUpload.array('file'), (req, res) => {
    return picDescribe.describe(req.files, (err, result = {}) => {
        return res.trans(err, result);
    });
});

// -------------------图片目标检测-----------------------

const picTargetUpload = multer({
        storage: multer.diskStorage({
            destination: (req, file, cb) => {
                const dir = path.join(config.webStoragePath, `./img_info_extract/result/${req.body.id}/keyframe/`);
                mkdirp(dir, (err) => {
                    if (err) {
                        console.error(err);
                        return cb(err);
                    }
                    return cb(null, dir);
                });
            },
            filename: (req, file, cb) => {
                return cb(null, `${uuid.v4() + getExt(file)}`);
            }
        })
    });

router.post('/pic_target', picTargetUpload.any('file'), (req, res) => {
    return picTarget.target(req.files, (err, result = {}) => {
        return res.trans(err, result);
    });
});

router.post('/pic_target_webUrl', upload.none(), (req, res) => {
    return picTarget.targetWeb(req.body, (err, result = {}) => {
        return res.trans(err, result);
    });
});

router.get('/pic_target/:id', (req, res) => {
    const type = 'img_info_extract';
    const id = req.params.id;
    return getResult.getImages(type, id, (err, result = {}) => {
        if (err) {
            console.error(err);
            return res.trans(ERROR.UNKNOWN, {errMsg: '数据库读取失败'});
        }
        return res.trans(0, result);
    });
});

// -------------------视频关键帧提取----------------------

const videoFrameUpload = multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            const dir = path.join(config.webStoragePath, `./video_info_extract/originVideo/`);
            mkdirp(dir, (err) => {
                if (err) {
                    console.error(err);
                    return cb(err);
                }
                return cb(null, dir);
            });
        },
        filename: (req, file, cb) => {
            return cb(null, `${uuid.v4() + getExt(file)}`);
        }
    })
});

router.post('/video_frame', videoFrameUpload.single('file'), (req, res) => {
    //info.id = req.file.filename.replace(/(.*\/)*([^.]+).*/ig,"$2");
    return videoFrame.keyFrame(req.file, (err, result = {}) => {
        return res.trans(err, result);
    });
});

router.post('/video_frame_webUrl', upload.none(), (req, res) => {
    req.body.id = uuid.v4();
    return videoFrame.frameWeb(req.body, (err, result = {}) => {
        return res.trans(err, result);
    });
});

router.get('/video_frame/:id', (req, res) => {
    const type = 'video_info_extract';
    const id = req.params.id;
    return getResult.getImages(type, id, (err, result = {}) => {
        if (err) {
            console.error(err);
            return res.trans(ERROR.UNKNOWN, {errMsg: '数据库读取失败'});
        }
        return res.trans(0, result);
    });
});
//  ----------------------视频信息列表----------------------
router.post('/video_info', (req, res) => {
    console.log('req.body', req.body);
    videoInfo.insert(req.body, (err, data = {}) => {
        return res.trans(err, data);
    });
});

router.get('/video_info', (req, res) => {
    return videoInfo.list(req.query, (err, result = {}) => {
        console.log('result----', result);
        console.log(result.docs);
        getResult.videoInfo(result, (err, data) => {
            console.log('data----', data);
            return res.trans(err, data);
        });
        //return res.trans(err, result);
    });
});

router.post('/video_info/:id', (req, res) => {
    req.body.id = req.params.id;
    if (req.query._op === 'del' ) {
        return videoInfo.delById(req.body, (err, result = {}) => {
            res.trans(err, result);
        });
    }

    return videoInfo.update(req.body, (err, result) => {
        res.trans(err, result);
    });
});
// -----------------------知识图谱----------------------
router.post('/graph', (req, res) => {
    return graph.getGraph(req.body.point, (err, result = {}) => {
        return res.trans(err, result);
    });
});


module.exports = router;
