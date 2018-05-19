/**
 * Created by pengfeixiang on 18/2/3.
 */

const express = require('express');
const router = express.Router();
const ERROR = require('../config/error');
const multer  = require('multer');
const upload = multer({ storage: multer.memoryStorage() });
const stt = require('../core/func/stt');
const qa = require('../core/func/qa');
const recommend = require('../core/home/recommend');


router.post('/stt', upload.single('file'), (req, res) => {
    if (!req.file || !req.file.buffer) {
        return res.trans(ERROR.PARAMS_MISSING);
    }

    const params = { buffer: req.file.buffer };
    return stt.recognize(params, res.trans);
});


router.post('/qa', upload.none(), (req, res) => {
    const data = req.body.json ? JSON.parse(req.body.json) : req.body;
    if (!data.question) {
        return res.trans( ERROR.PARAMS_MISSING, { errMsg: 'PARAMS_MISSING question' });
    }

    data.uid = req.session.uid || '';
    return qa.query(data, res.trans);
});


router.get('/recommend', upload.none(), (req, res) => {
    req.query.uid = req.session.uid;
    recommend.list(req.query, (err, data = {}) => {
        return res.trans(err, data);
    });
});


//TODO 人脸识别 声纹识别

module.exports = router;
