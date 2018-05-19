/**
 * Created by pengfeixiang on 18/2/3.
 */
'use strict';

const nlpServer = require('../../lib/nlpServer');

const query = (input, cb) => {
    return nlpServer.query(input, cb);
};

module.exports = {
    query
};
