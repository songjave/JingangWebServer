/**
 * Created by pengfeixiang on 18/1/10.
 */

'use strict';

const jsonArr  = require('../../db/recommend.json');
const hash = (str) => {
    let _hash = 5381;
    let i    = str.length;

    while(i) {
        _hash = (_hash * 33) ^ str.charCodeAt(--i);
    }

    return _hash >>> 0;
};

const list = (input, cb) => {
    input.uid = input.uid || '';
    const code = hash(input.uid) % 3;
    const headList = [];
    const tailList = [];

    jsonArr.forEach((item) => {
        item.index === code ? headList.push(item) : tailList.push(item)
    });

    const docs = [].concat(headList, tailList);

    return cb(0, {
        docs,
        page: 1,
        total: docs.length
    });
};

module.exports = {
    list
};
