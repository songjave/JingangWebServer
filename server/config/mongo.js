/**
 * Created by pengfeixiang on 18/1/19.
 */


'use strict';
const mongoose = require('mongoose');
const isProd = process.env.NODE_ENV === 'production';

const config = {
    maxCount: 10,
    mongoOperationConn: isProd ? 'mongodb://9.168.16.200:9917/baike' : 'mongodb://192.168.1.110:9917/baike',
    mongoConnOptions: {
        // useMongoClient: true,
        // autoReconnect: true,
        reconnectTries: 1000,
        reconnectInterval: 2500,
        keepAlive: 1,
        connectTimeoutMS: 8000
    }
};

mongoose.Promise = Promise;

mongoose.connect(config.mongoOperationConn, config.mongoConnOptions);

module.exports = mongoose;
