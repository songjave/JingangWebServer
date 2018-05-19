

'use strict';


const lib = require('../lib/vad');
const path = require('path');
// const file = path.join(__dirname, './1.wav');


lib.run({
    path: path.join(__dirname, './vad'),
    file: 'xwlb.wav',
    aggressiveness: 3
}, (err, data) => {
	console.log(err, data);
});
