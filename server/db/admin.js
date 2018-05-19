/**
 * Created by pengfeixiang on 18/1/3.
 */
'use strict';

const fs = require('fs');
const ERROR = require('../config/error');
const path = require('path');
const JSON_FILE = path.join(__dirname, './admin.json');
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
    if (!input.id || !input.password || !input.name) {
        return cb(ERROR.PARAMS_MISSING, {errMsg: 'missing id or password or name'});
    }

    if (db[input.id]) { //用户已存在
        return cb(ERROR.PARAMS_INVALID, {errMsg: 'id already exist'});
    }

    input.createAt = Math.floor(Date.now() / 1000);
    input.updateAt = input.createAt;

    db[input.id] = input;
    save(cb);
};

const update = (input, cb) => {
    if (!input.id) {
        return cb(ERROR.PARAMS_MISSING, {errMsg: 'missing id'});
    }

    if (!db[input.id]) { //用户不存在
        return cb(ERROR.PARAMS_INVALID, {errMsg: 'id not exist'});
    }

    for (let k in input) {
        db[input.id][k] = input[k];
    }

    db[input.id].updateAt = Math.floor(Date.now() / 1000);

    save(cb);
};

const del = (input, cb) => {
    if (!input.id) {
        return cb(ERROR.PARAMS_MISSING, {errMsg: 'missing id'});
    }

    if (!db[input.id]) { //用户不存在
        return cb(0);
    }

    delete db[input.id];
    save(cb);
};

const query = (input, cb) => {
    if (!input.id) {
        return cb(ERROR.PARAMS_MISSING, {errMsg: 'missing id'});
    }

    if (!db[input.id]) { //用户不存在
        return cb(ERROR.PARAMS_INVALID, {errMsg: 'id not exist'});
    }

    return cb(0, db[input.id]);
};


const verify = (input, cb) => {
    if (!input.id) {
        return cb(ERROR.PARAMS_MISSING, {errMsg: 'missing id'});
    }

    if (!db[input.id] || db[input.id].password !== input.password) {
        return cb(ERROR.VERIFY_ERROR);
    }

    return cb(0, db[input.id]);
};

module.exports = {
    add,
    update,
    del,
    query,
    verify,
    list
};


