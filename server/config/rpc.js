/**
 * Created by pengfeixiang on 17/12/11.
 */

'use strict';
const env = process.env.NODE_ENV === 'production' ? 'production' : 'testing';
const config = require('./config');

const node = {};

node.testing = {
    QA: { host: '192.168.1.110', port: 9016, name: 'qa'},
    FACE: { host: '192.168.1.110', port: 9017, name: 'face'},
    VOICE: { host: '192.168.1.110', port: 9018, name: 'voice'},
    STT: { host: '192.168.1.124', port: 9011, name: 'stt'},
    STT_BETA: { host: '192.168.1.124', port: 9012, name: 'stt_beta'},
    NLP: { host: '192.168.1.123', port: 9016, name: 'nlp'},
    DETECTRON: { host: '192.168.1.124', port: 9027, name: 'detectron'},
    IMAGE_DESC: { host: '192.168.1.123', port: 9028, name: 'image_desc'},
    KEYFRAME: { host: '192.168.1.110', port: 9026, name: 'keyframe'}
};


node.production = {
    QA: { host: '9.168.16.204', port: 8082, name: 'qa'},
    FACE: { host: '9.168.16.204', port: 9017, name: 'face'},
    VOICE: { host: '9.168.16.204', port: 9018, name: 'voice'},
    STT: { host: '9.168.16.202', port: 8101, name: 'stt'}, //STT Router Server:8101 (STT占用9011-9016)
    STT_BETA: { host: '9.168.16.209', port: 9012, name: 'stt_beta'},
    NLP: { host: '9.168.16.204', port: 9016, name: 'nlp'},
    DETECTRON: { host: '9.168.16.209', port: 9027, name: 'detectron'},
    IMAGE_DESC: { host: '9.168.16.209', port: 9028, name: 'image_desc'},
    KEYFRAME: { host: '9.168.16.209', port: 9026, name: 'keyframe'},
};


if (config.disableBetaStt) {
    node.testing.STT_BETA = node.testing.STT;
    node.production.STT_BETA = node.production.STT;
}

module.exports = {
    node: node[env]
};
