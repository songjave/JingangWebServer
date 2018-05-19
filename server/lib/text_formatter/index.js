'use strict';

const fs = require('fs');
const path = require('path');
const parser = require('./lib/zh_analyzer').parse;
const DICT_PATH = './lib/fullwidth.2.halfwidth.utf8.dict';
const DICT_MAP = {};
let REPLACE_REG;

(function _init (){
  let arr = fs.readFileSync(path.join(__dirname, DICT_PATH), 'utf8').split('\n');
  arr.forEach((line) => {
    let _arr = line.split('\t');
    let k = _arr[0] &&_arr[0].trim();
    let v = _arr[1] && _arr[1].trim();
    if (k && v) {
      DICT_MAP[k] = v;
    }
  });

  REPLACE_REG = new RegExp( '[' + Object.keys(DICT_MAP).join('') + ']', 'g');
})();


const format = (str) => {
    return str.replace(REPLACE_REG, function (m) {
        return DICT_MAP[m] || ' ';
    });
};

module.exports = (str) => {
  return parser(format(str), true);
};
