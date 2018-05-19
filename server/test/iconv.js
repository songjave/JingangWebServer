'use strict';


const iconv = require('iconv-lite');
const fs  = require('fs');

const buffer = fs.readFileSync('./iso8859.txt', 'binary');
console.log(buffer.isEncoding('iso-8859'));

//const output = iconv.decode(buffer, "gbk");
//fs.writeFileSync('./utf8.txt', output);
