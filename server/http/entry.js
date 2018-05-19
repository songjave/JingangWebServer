/**
 * Created by pengfeixiang on 17/12/11.
 */

'use strict';

const express = require('express');
const router = express.Router();
const path = require('path');
const BASE_PATH = path.join(__dirname, '../public/');

const multer  = require('multer');
const upload = multer({ storage: multer.memoryStorage() });
const baikeUpload = multer({ dest: path.join(BASE_PATH, './baike') });
//const qa = require('../core/qa');
const fs = require('fs');

const stt = require('../core/stt');
const user = require('../core/user');
const qa2 = require('../core/qa2');
const da = require('../core/da');

const ERROR = require('../config/error');
const queryDemo = require('../lib/queryDemo.js');
const picDescribe = require('../lib/func/picDescribe.js');

const nlpServer = require('../lib/nlpServer');
const recommend = require('../core/recommend');
const baike = require('../core/baike');

const tmp = require('tmp');
const config = require('../config/config');



router.post('/qa', upload.none(), (req, res) => {
    const data = JSON.parse(req.body.json);
    data.uid = req.session.uid || '';
    if (!data.question) {
        return res.json({
            errCode: ERROR.PARAMS_MISSING,
            errMsg: 'PARAMS_MISSING question'
        });
    }

    data.uid = req.session.uid || '';
    return nlpServer.query(data, (err, result = {}) => {
        return res.trans(err, result);
    });
});


router.get('/home/recommend', upload.none(), (req, res) => {
    req.query.uid = req.session.uid;
    recommend.list(req.query, (err, data = {}) => {
        return res.trans(err, data);
    });
});

router.post('/me/theme', upload.none(), (req, res) => {
    req.body.uid = req.session.uid;
    user.setTheme(req.body, (err, data = {}) => {
        return res.trans(err, data);
    });
});






module.exports = router;
