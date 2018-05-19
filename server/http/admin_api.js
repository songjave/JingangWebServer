/**
 * Created by pengfeixiang on 18/1/5.
 */
'use strict';

const express = require('express');
const router = express.Router();
const ERROR = require('../config/error');
const multer  = require('multer');
const upload = multer({ storage: multer.memoryStorage() });

const user = require('../core/admin/users');
const service = require('../core/admin/service');
const sync = require('../core/admin/sync');
const reload = require('../core/admin/reload');
const sts = require('../core/admin/sts');

// ------------SYNC & RELOAD---------------

router.post('/sync/face', (req, res) => {
    return sync.face(req.body, res.trans);
});

router.post('/sync/voice', (req, res) => {
    return sync.voice(req.body, res.trans);
});

router.post('/reload/face', (req, res) => {
    return reload.face(req.body, res.trans);
});

router.post('/reload/voice', (req, res) => {
    return reload.voice(req.body, res.trans);
});


// ---------------USER----------------------

router.get('/user', (req, res) => {
    return user.list(req.query, res.trans);
});

router.post('/user', upload.any(), (req, res) => {
    if (!req.body.uid || !req.body.password || !req.body.name) {
        return res.trans(ERROR.PARAMS_MISSING, {errMsg: 'missing id or password or name'});
    }

    req.files.forEach((item) => {
        if (item.fieldname === 'voice') {
            req.body.voice = item.buffer;
        }
        else if (item.fieldname === 'face') {
            req.body.face = item.buffer;
        }
    });

    user.insert(req.body, (err, result = {}) => {
        res.trans(err, result);
    });
});

router.get('/user/:uid', (req, res) => {
    user.getUid(req.params, res.trans);
});

router.delete('/user/:id', (req, res) => {
    user.delById(req.params, res.trans);
});

router.put('/user/:id', upload.any(), (req, res) => {
    req.body.id = req.params.id;
    req.files.forEach((item) => {
        if (item.fieldname === 'voice') {
            req.body.voice = item.buffer;
        }
        else if (item.fieldname === 'face') {
            req.body.face = item.buffer;
        }
    });

    user.update(req.body, (err, result = {}) => {
        return res.trans(err, result);
    });
});


// -------------SERVICE--------------------

router.get('/service', (req, res) => {
    return service.ping(res.trans);
});

router.post('/service', upload.none(), (req, res) => {
    if (!req.body.sid || !req.body.name || !req.body.ip || !req.body.port) {
        return res.trans(ERROR.PARAMS_MISSING, {errMsg: 'missing id or name or ip or port'});
    }

    service.add(req.body, res.trans);
});

router.get('/service/:sid', (req, res) => {
    service.query(req.params, res.trans);
});

router.delete('/service/:sid', (req, res) => {
    service.del(req.params, res.trans);
});

router.put('/service/:sid', upload.none(), (req, res) => {
    req.body.sid = req.params.sid;
    service.update(req.body, res.trans);
});


// -----------语音标注管理------------------

//语音标注导出
router.post('/sts_export', (req, res) => {
    sts.doExport(req.body, (err) => {
        err && console.error(err);
    });
    return res.trans(0);
});

//语音标注导入
router.post('/sts_import', (req, res) => {
    sts.doImport(req.body, (err) => {
        err && console.error(err);
    });
    return res.trans(0);
});


router.post('/sts_export/:id', (req, res) => {
    const id = req.params.id;
    if (req.query._op === 'del' ) {
        return sts.delExportedRecordById({ id }, res.trans);
    }

    return res.trans(ERROR.UNSUPPORTED);
});


router.post('/sts_import/:id', (req, res) => {
    const id = req.params.id;
    if (req.query._op === 'del' ) {
        return sts.delImportedRecordById({ id }, res.trans);
    }

    return res.trans(ERROR.UNSUPPORTED);
});


router.get('/sts_export', (req, res) => {
    return sts.listExportedRecord(req.query, res.trans);
});

router.get('/sts_import', (req, res) => {
    return sts.listImportedRecord(req.query, (err, data = {}) => {
        sts.getBusStationDirs({}, (err, result = {}) => {
            if (err) {
                return res.trans(err);
            }

            data.files = result.list || [];
            return res.trans(err, data);
        });
    });
});


module.exports = router;
