/**
 * Created by pengfeixiang on 17/12/25.
 */
'use strict';
const fs = require('fs');

const verify = require('../lib/login').verify;
const buffer = fs.readFileSync('./obama2.jpg');
console.log(buffer.length);

const req = {
  buffer,
  name: ''
};



verify(req, (err, data) => {
  console.log(err, data);
});