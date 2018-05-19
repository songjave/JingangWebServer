/**
 * Created by pengfeixiang on 18/1/7.
 */

'use strict';

// TODO user功能check

const user = require('../../db/users');
const faceServer = require('../../lib/faceServer');
const voiceServer = require('../../lib/voiceServer');
const fs = require('fs');
const path = require('path');

const _syncToFace = (arr, index, cb) => {
    const obj = arr[index];
    if (!obj) {
        return cb(0);
    }

    if (!obj.face) {
        index++;
        return _syncToFace(arr, index, cb);
    }

    const input = {
        buffer: fs.readFileSync(path.join(__dirname, '../public', obj.face)),
        uid: obj.uid
    };

    return faceServer.add(input, (err) => {
        if (err) {
            return cb(err);
        }

        index++;
        return _syncToFace(arr, index, cb);
    });
};

const face = (input, cb) => {
    return user.list({}, (err, result = {}) => {
        if (err) {
            return cb(err);
        }

        const arr = result.docs || [];
        return faceServer.clear({}, (err) => {
            if (err) {
                return cb(err);
            }

            return _syncToFace(arr, 0, (err) => {
                return cb(err);
            });
        });
    });
};


const _syncToVoice = (arr, index, cb) => {
    const obj = arr[index];
    if (!obj) {
        return cb(0);
    }

    if (!obj.voice) {
        index++;
        return _syncToVoice(arr, index, cb);
    }

    const input = {
        buffer: fs.readFileSync(path.join(__dirname, '../public', obj.voice)),
        uid: obj.uid
    };

    return voiceServer.add(input, (err) => {
        if (err) {
            return cb(err);
        }

        index++;
        return _syncToVoice(arr, index, cb);
    });
};

const voice = (input, cb) => {
    return user.list({}, (err, result = {}) => {
        if (err) {
            return cb(err);
        }

        const arr = result.docs || [];
        return voiceServer.clear({}, (err) => {
            if (err) {
                return cb(err);
            }

            return _syncToVoice(arr, 0, (err) => {
                return cb(err);
            });
        });
    });
};


module.exports = {
    face,
    voice
};
