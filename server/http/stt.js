/**
 * Created by pengfeixiang on 18/2/3.
 */

'use strict';

const config = require('../config/config');
const express = require('express');
const router = express.Router();

const multer  = require('multer');
const upload = multer({ storage: multer.memoryStorage() });
const stt = require('../core/func/stt');
const ERROR = require('../config/error');

router.post('/', upload.single('file'), (req, res) => {
    if (!req.file || !req.file.buffer) {
        return res.trans(ERROR.PARAMS_MISSING);
    }

    const params = { buffer: req.file.buffer };
    return stt.recognize(params, res.trans);
});


router.post('/stt', upload.single('file'), (req, res) => {
    if (!req.file || !req.file.buffer) {
        return res.trans(ERROR.PARAMS_MISSING);
    }

    const params = { buffer: req.file.buffer };
    return stt.recognize(params, res.trans);
});

router.post('/stt_beta', upload.single('file'), (req, res) => {
    if (!req.file || !req.file.buffer) {
        return res.trans(ERROR.PARAMS_MISSING);
    }

    const params = { buffer: req.file.buffer, isBeta: !config.disableBetaStt };
    return stt.recognize(params, res.trans);
});


router.post('/stt_alpha', upload.single('file'), (req, res) => {
    if (!req.file || !req.file.buffer) {
        return res.trans(ERROR.PARAMS_MISSING);
    }

    const params = { buffer: req.file.buffer, isAlpha: true };
    return stt.recognize(params, res.trans);
});

router.post('/stt_baidu_online', upload.single('file'), (req, res) => {
    if (!req.file || !req.file.buffer) {
        return res.trans(ERROR.PARAMS_MISSING);
    }

    const params = { buffer: req.file.buffer, isBaiduOnline: true };
    return stt.recognize(params, res.trans);
});

module.exports = router;
