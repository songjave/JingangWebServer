/**
 * Created by pengfeixiang on 18/1/3.
 */
'use strict';

const fs = require('fs');
const ERROR = require('../config/error');
const path = require('path');
const JSON_FILE = path.join(__dirname, './user.json');
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
    if (!input.uid || !input.password || !input.name) {
        return cb(ERROR.PARAMS_MISSING, {errMsg: 'missing uid or password or name'});
    }

    if (db[input.uid]) { //用户已存在
        return cb(ERROR.PARAMS_INVALID, {errMsg: 'id already exist'});
    }

    input.createAt = Math.floor(Date.now() / 1000);
    input.updateAt = input.createAt;

    db[input.uid] = input;
    save(cb);
};

const update = (input, cb) => {
    if (!input.uid) {
        return cb(ERROR.PARAMS_MISSING, {errMsg: 'missing id'});
    }

    if (!db[input.uid]) { //用户不存在
        return cb(ERROR.PARAMS_INVALID, {errMsg: 'id not exist'});
    }

    for (let k in input) {
        db[input.uid][k] = input[k];
    }

    db[input.uid].updateAt = Math.floor(Date.now() / 1000);

    save(cb);
};

const del = (input, cb) => {
    if (!input.uid) {
        return cb(ERROR.PARAMS_MISSING, {errMsg: 'missing id'});
    }

    if (!db[input.uid]) { //用户不存在
        return cb(0);
    }

    delete db[input.uid];
    save(cb);
};

const query = (input, cb) => {
    if (!input.uid) {
        return cb(ERROR.PARAMS_MISSING, {errMsg: 'missing id'});
    }

    if (!db[input.uid]) { //用户不存在
        return cb(ERROR.PARAMS_INVALID, {errMsg: 'id not exist'});
    }

    return cb(0, db[input.uid]);
};


const verify = (input, cb) => {
    if (!input.uid) {
        return cb(ERROR.PARAMS_MISSING, {errMsg: 'missing id'});
    }

    if (!db[input.uid] || db[input.uid].password !== input.password) {
        return cb(ERROR.VERIFY_ERROR);
    }

    return cb(0, db[input.uid]);
};

module.exports = {
    add,
    update,
    del,
    query,
    verify,
    list
};


