/**
 * Created by pengfeixiang on 18/1/7.
 */

'use strict';

const faceServer = require('../../lib/faceServer');
const voiceServer = require('../../lib/voiceServer');

const face = (input, cb) => {
    return faceServer.reload(input, cb)
};

const voice = (input, cb) => {
    return voiceServer.reload(input, cb)
};

module.exports = {
    face,
    voice
};
