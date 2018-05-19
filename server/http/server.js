"use strict";

const error = require('../config/error');
const express = require('express');
const logger = require('morgan');
const bodyParser = require('body-parser');
const basicAuth = require("basicauth-middleware");
const compress = require('compression');
const cookieSession = require('cookie-session');
const path = require('path');
const fs = require('fs');
const http = require('http');
const https = require('https');
const mkdirp = require('mkdirp');
const isLocal = process.platform === 'darwin' || process.platform === 'win32';
const ERROR = require('../config/error');
const morgan = require('morgan');
const userVerify = require('../core/middleware/user_verify');
const config = require('../config/config');
const ACCESS_LOG = path.join(config.webStoragePath, `log/access_${Date.now()}.log`);

//创建日志文件
mkdirp.sync(path.join(config.webStoragePath, '/log'));
fs.closeSync(fs.openSync(ACCESS_LOG, 'w'));

const app = express();
app.disable('x-powered-by');
app.enable('trust proxy');

app.use(compress());
app.use(logger('dev'));

app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({ extended: false}));

app.use('/cms.html', (req, res, next) => {
    res.redirect('/#/cms');
});

app.use('/baike', (req, res, next) => {
    res.set('Content-Type', 'image/jpeg');
    next();
});

app.use(express.static(config.webStoragePath));
app.use(express.static(path.join(__dirname, '../public')));

app.use('/monitor/monitor.jsp', function (req, res) {
    res.send('0');
});

app.use(cookieSession({
    name: 'sid',
    secret: 'lm@keyboAY!ard#)'
}));

app.use((req, res, next) => {
    res.trans = (err, data = {}) => {
        const json = {
            errCode: err || data.errCode || 0,
            errMsg: data.errMsg || ''
        };

        !json.errCode && (json.data = data);
        return res.json(json);
    };

    res.jsonWithDelay = (json)=> {
        setTimeout(() => {
            res.json(json);
        }, Math.random() * 500 + 1500);
    };

    return next();
});

app.use(morgan('combined', {stream: fs.createWriteStream(ACCESS_LOG, {flags: 'a'})}));

app.use('/api/user', require('./login'));
app.use('/api/tools/sts', require('./sts'));
app.use('/api/tools', require('./tools_api'));
app.use('/api/func/stt', require('./stt'));
app.use('/api/func', require('./func_api'));
app.use('/admin/api', basicAuth('admin', 'admin'), require('./admin_api'));

//login verify
app.use('/api/home', userVerify, require('./home_api'));

// catch 404 and forward to error handler
app.use(function(req, res) {
    res.json({errCode: error.UNSUPPORTED});
});

app.use(function(req, res, next) {
    let err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers
if (app.get('env') === 'development') {
    // development error handler
    // will print stacktrace
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.json({
            errCode: err.status || 500,
            errMsg: err.message || ''
        });
    });
}
else {
    // production error handler
    // no stacktraces leaked to user
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.json({
            errCode: err.status || 500,
            errMsg: 'invalid request or inner error'
        });
    });
}

app.set('host', process.env.IP || '0.0.0.0');
app.set('port', process.env.PORT || 8081);

const start = function () {
    const listenCallback = (err) => {
        return console.error(err ? err : `server listening at port ${app.get('port')}`);
    };

    if (isLocal) {
        http.createServer(app).listen(app.get('port'), app.get('host'), listenCallback);
    }
    else {
        const options = {
            key: fs.readFileSync(path.join(__dirname, '../cert/private.pem')),
            cert: fs.readFileSync(path.join(__dirname, '../cert/file.crt'))
        };
        https.createServer(options, app).listen(app.get('port'), app.get('host'), listenCallback);
    }
};

module.exports = {
    start
};
