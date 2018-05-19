'use strict';

const wavStt = require('../lib/wavStt');

const path = '../public/stt/1515328695834.wav';

wavStt.wavToText(path, (err, data = {}) => {
    console.log(data);
});
