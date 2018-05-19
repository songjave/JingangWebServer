/**
 * Created by pengfeixiang on 18/1/6.
 * 服务状态检测 ping
 */

const db = require('../../db/service');
const lib = require('../../lib/jingang');

const _ping = (arr, index, cb) => {
    if (!arr[index]) {
        return cb(0);
    }

    const obj = arr[index];

    if (!obj.ip || !obj.port) {
        index++;
        obj.status = 'Invalid params';
        return _run(arr, index, cb);
    }

    const addr = obj.ip + ':' + obj.port;

    return lib.ping({addr}, (err) => {
        obj.status = err ? 'Fail' : 'Success';
        index ++;
        return _ping(arr, index, cb);
    });
};


const ping = (cb) => {
    db.list({}, (err, result = {}) => {
        const docs = result.docs || [];
        if (docs.length === 0) {
            return cb(err, result);
        }

        return _ping(docs, 0, (err) => {
            return cb(err, result);
        });
    });
};


module.exports = {
    ping,
    add: db.add,
    query: db.query,
    del: db.del,
    update: db.update
};
