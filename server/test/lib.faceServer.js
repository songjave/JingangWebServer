/**
 * Created by pengfeixiang on 18/1/7.
 */

'use strict';

const fs = require('fs');
const lib = require('../lib/faceServer');
const path = require('path');
//const buffer = fs.readFileSync('./dyj.png');
const buffer = fs.readFileSync('../public/login/1515492102433.png');
console.log(buffer.length);


const p = (err, data) => {
    console.log(err, data);
};

const input = {
    buffer,
    id: 'daiyanjun'
};

//lib.add(input, p);

//lib.inspect({}, p);

//lib.del(input, p);

//lib.clear({}, p);
// lib.reload({}, p);
//lib.ping({}, p);

//lib.verify(input, p);


function readDirSync(thePath){
    const pa = fs.readdirSync(thePath);
    const list = [];
    pa.forEach(function(ele, index){

        /png$/.test(ele) && list.push(path.join(thePath, ele));
    });

    return list;
}

const _batch = (list, index, cb) => {
    if(!list[index]) {
        return cb(0);
    }

    const buffer = fs.readFileSync(list[index]);
    lib.verify({buffer}, (err, result) => {
        console.log(list[index], result);
        index++;
        return _batch(list, index, cb);
    })
};

const run = () => {
    const imagePath = path.join(__dirname, '../public/login/');
    const list = readDirSync(imagePath);
    _batch(list, 0, p);
};

run();



