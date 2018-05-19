/**
 * Created by pengfeixiang on 18/1/7.
 */

'use strict';

const fs = require('fs');
const lib = require('../lib/voiceServer');
const buffer = fs.readFileSync('./dyj.wav');
console.log(buffer.length);


const p = (err, data) => {
    console.log(err, data);
};

const input = {
    buffer,
    id: 'daiyanjun'
};

// lib.add(input, p);

//lib.inspect({}, p);

//lib.del(input, p);

//lib.clear({}, p);
//lib.reload({}, p);
//lib.ping(p);
lib.verify(input, p);
