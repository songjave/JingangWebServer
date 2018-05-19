/**
 * Created by pengfeixiang on 18/1/9.
 */
'use strict';

const express = require('express');
const router = express.Router();
const config = require('../config/config');
const multer  = require('multer');
const upload = multer({ storage: multer.memoryStorage() });
const path = require('path');
const fs = require('fs');
const mkdirp = require('mkdirp');
const ERROR = require('../config/error');
const BASE_PATH = config.webStoragePath;
const user = require('../core/home/user');

router.post('/logout', (req, res) => {
    req.session = null;
    res.trans(0, {});
});


router.get('/is_login', (req, res) => {
    if (!req.session.uid) {
        return res.trans(0, {isLogin: false});
    }

    return user.query({uid: req.session.uid}, res.trans);
});


router.post('/login', upload.any(), (req, res) => {
    mkdirp(path.join(BASE_PATH, './login/'), () => {
        req.files.forEach((item) => {
            if (item.fieldname === 'voice') {
                const filePath = `login/${Date.now()}.wav`;
                fs.writeFileSync(path.join(BASE_PATH, filePath), item.buffer);
                req.body.voice = item.buffer;

            }
            else if (item.fieldname === 'face') {
                const filePath = `login/${Date.now()}.png`;
                fs.writeFileSync(path.join(BASE_PATH, filePath) , item.buffer);
                req.body.face = item.buffer;
            }

        });

        // 声纹识别大多是都是返回吴圆圆，暂时不发声纹请求，但前端仍录音
        /*const isTextLogin = !req.body.voice && !req.body.face;
        //console.log('req.body.voice', req.body.voice);
        return user.verify(req.body, (err, result = {}) => {
            if (result.uid && !isTextLogin) {
                req.session.uid = result.uid;
            }
            res.trans(err, result);
        });*/

        return user.verify(req.body, (err, result = {}) => {
            req.session.uid = result.uid;
            res.trans(err, result);
        });
    });
});


module.exports = router;
