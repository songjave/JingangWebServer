/**
 * Created by pengfeixiang on 18/1/24.
 */

'use strict';

const core = require('../core/stt');
const fs = require('fs')
const buffer = fs.readFileSync('./dyj.wav');


const run = () => {
    const _t = Date.now();
    core.recognize({ buffer }, (err, data) => {
        console.log(Date.now() - _t, err, data);
    });
};


const runBeta = () => {
    const _t = Date.now();
    core.recognize({ buffer, isBeta: true }, (err, data) => {
        console.log(Date.now() - _t, err, data);
    });
};


run();
runBeta();
