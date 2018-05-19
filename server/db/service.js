/**
 * Created by pengfeixiang on 18/1/3.
 */
'use strict';

const fs = require('fs');
const ERROR = require('../config/error');
const path = require('path');
const JSON_FILE = path.join(__dirname, './service.json');
const db = require(JSON_FILE);


const list = (input, cb) => {
    let arr = [];
    for(let k in db) {
        arr.push(db[k]);
    }
    arr.sort((a, b) => {
        return b.createAt - a.createAt;
    });

    const ret = {
        total: arr.length,
        docs: arr,
        page: 1
    };
    return cb(0, ret);
};

const save = (cb) => {
    fs.writeFile(JSON_FILE, JSON.stringify(db, null, 4), (err) => {
        // console.log(JSON.stringify(db));
        err && console.error(err);
        return cb(err ? ERROR.UNKNOWN : 0);
    });
};

const add = (input, cb) => {
    if (!input.sid || !input.port || !input.ip) {
        return cb(ERROR.PARAMS_MISSING, {errMsg: 'missing sid or port or ip'});
    }

    if (db[input.sid]) {
        return cb(ERROR.PARAMS_INVALID, {errMsg: 'sid already exist'});
    }

    input.createAt = Math.floor(Date.now() / 1000);
    input.updateAt = input.createAt;

    db[input.sid] = input;
    save(cb);
};

const update = (input, cb) => {
    if (!input.sid) {
        return cb(ERROR.PARAMS_MISSING, {errMsg: 'missing sid'});
    }

    if (!db[input.sid]) { //sid不存在
        return cb(ERROR.PARAMS_INVALID, {errMsg: 'sid not exist'});
    }

    for (let k in input) {
        db[input.sid][k] = input[k];
    }

    db[input.sid].updateAt = Math.floor(Date.now() / 1000);

    save(cb);
};

const del = (input, cb) => {
    if (!input.sid) {
        return cb(ERROR.PARAMS_MISSING, {errMsg: 'missing sid'});
    }

    if (!db[input.sid]) { //sid不存在
        return cb(0);
    }

    delete db[input.sid];
    save(cb);
};

const query = (input, cb) => {
    if (!input.sid) {
        return cb(ERROR.PARAMS_MISSING, {errMsg: 'missing sid'});
    }

    if (!db[input.sid]) { //sid不存在
        return cb(ERROR.PARAMS_INVALID, {errMsg: 'sid not exist'});
    }

    return cb(0, db[input.sid]);
};


const verify = (input, cb) => {
    query(input, (err, info = {}) => {
        if (err) {
            return cb(err);
        }

        if(input.password !== info.password) {
            return cb(ERROR.VERIFY_ERROR);
        }

        return cb(0, info);
    })
};

module.exports = {
    add,
    update,
    del,
    query,
    verify,
    list
};


