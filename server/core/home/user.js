/**
 * Created by pengfeixiang on 18/1/7.
 */

const ERROR = require('../../config/error');
const user = require('../../db/users');
const face = require('../../lib/faceServer');
const voice = require('../../lib/voiceServer');

const passwordVerify = (input, cb) => {
    return user.getByUid(input.uid).then((data) => {
        if (!data || !data.uid || data.password !== input.password) {
            return cb(ERROR.VERIFY_ERROR);
        }

        return cb(0, data);
    }).catch((err) => {
        console.error(err);
        return cb(ERROR.UNKNOWN, {errMsg: 'db异常'});
    });
};


const voiceVerify = (input, cb) => {
    return voice.verify({buffer: input.voice}, (err, result = {}) => {
        if (err) {
            return cb(err);
        }

        if (!result.id) {
            return cb(ERROR.VERIFY_ERROR);
        }

        result.uid = result.id;
        return user.getByUid(result.uid).then((data) => {
            if (!data || !data.uid) {
                return cb(ERROR.VERIFY_ERROR);
            }
            return cb(0, data);
        }).catch((err) => {
            console.error(err);
            return cb(ERROR.UNKNOWN, {errMsg: 'db异常'});
        });
    });
};


const faceVerify = (input, cb) => {
    return face.verify({buffer: input.face}, (err, result = {}) => {
        if (err) {
            return cb(err);
        }

        if (!result.id) {
            return cb(ERROR.VERIFY_ERROR);
        }

        result.uid = result.id;
        return user.getByUid(result.uid).then((data = {}) => {
            if (!data || !data.uid) {
                return cb(ERROR.VERIFY_ERROR);
            }
            return cb(0, data);
        }).catch((err) => {
            console.error(err);
            return cb(ERROR.UNKNOWN, {errMsg: 'db异常'});
        });
    });
};

const verify = (input, cb) => {
    if (input.uid && input.password) {
        return passwordVerify(input, cb);
    }

    if (input.face) {
        return faceVerify(input, cb);
    }

    if (input.voice) {
        console.log('input:', input);
        return voiceVerify(input, cb);
    }

    return cb(ERROR.VERIFY_ERROR);
};


const query = (input, cb) => {
    return user.getByUid(input.uid).then((data) => {
        return cb(0, data);
    }).catch((err) => {
        console.error(err);
        return cb(ERROR.UNKNOWN, {errMsg: 'db异常'});
    });
};




module.exports = {
    verify,
    query
};
