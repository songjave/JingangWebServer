/**
 * Created by pengfeixiang on 18/1/5.
 */
'use strict';
const config = require('../config/config');
const path = require('path');
const fs = require('fs');
const uuid = require('uuid');

const express = require('express');
const router = express.Router();
const ERROR = require('../config/error');
const baike = require('../core/tools/baike');
const qaTest = require('../core/tools/qaTest');
const multer  = require('multer');

//TODO 文件类型检查png/jpg
const baikeUpload = multer({
    storage: multer.diskStorage({
        destination: function (req, file, cb) {
            return cb(null, path.join(config.webStoragePath, './baike'))
        },
        filename: function (req, file, cb) {
            console.log(file);
            return cb(null, uuid.v4() + '.jpg')
        }
    })
});

router.post('/baike', baikeUpload.array('imgs[]', 20), (req, res) => {
    if (req.body.jsonData) {
        const json = JSON.parse(req.body.jsonData);
        json.images = json.images || [];
        req.files = req.files || [];
        if (req.files.length !== json.images.length) {
            return res.trans(ERROR.PARAMS_INVALID);
        }

        for(let i = 0; i < json.images.length; i++) {
            json.images[i].id = req.files[i].filename || '';
            json.images[i].describe = json.images[i].describe || '';
        }

        return baike.insert(json, (err, data) => {
            return res.trans(err, data);
        });
    }

    return baike.insert(req.body, (err, data) => {
        return res.trans(err, data);
    });
});

router.get('/baike', (req, res) => {
    return baike.list(req.query, res.trans);
});

router.post('/baike/:id', baikeUpload.array('imgs[]', 20), (req, res) => {
    req.body.id = req.params.id;
    if (req.query._op === 'del' ) {
        return baike.delById(req.body, res.trans);
    }

    return baike.update(req.body, res.trans);
});

router.post('/baike_image_upload', baikeUpload.single('image'), (req, res) => {
    return res.trans(0, {id: req.file.filename, index: +(req.body.index)});
});


// ------------QA 测试工具------------

router.post('/qa_test', (req, res) => {
    return qaTest.insert(req.body, res.trans);
});


router.get('/qa_test', (req, res) => {
    return qaTest.list(req.query, res.trans);
});


router.post('/qa_test/:id', (req, res) => {
    req.body.id = req.params.id;
    if (req.query._op === 'del' ) {
        return qaTest.delById(req.body, res.trans);
    }

    return qaTest.update(req.body, res.trans);
});


module.exports = router;
