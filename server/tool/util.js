/**
 * Created by pengfeixiang on 17/11/23.
 */
"use strict";

const path = require('path');
const url = require('url');
const fs = require('fs');
const isProd = process.env.NODE_ENV === 'production';

const yyyymmdd = () => {
  const t = new Date();
  const mm = t.getMonth() + 1; // getMonth() is zero-based
  const dd = t.getDate();

  return [t.getFullYear(), (mm > 9 ? '' : '0') + mm, (dd > 9 ? '' : '0') + dd].join('');
};


const errLogger = (input) => {
  const str = typeof input === 'object' ? JSON.stringify(input) : input.toString();

  if (!isProd) {
    console.error(str);
  }

  return fs.appendFile(`./error_${yyyymmdd()}.log`, str + '\n', () => {});
};

const _buildUrl = (arg, str) => {
  // console.log(arg);
  if (/^http/.test(str)) {
    return str;
  }

  const prefix = arg.protocol + '//' + arg.hostname;

  if (/^\//.test(str)) {
    return prefix + str;
  }

  return  prefix + path.join(arg.pathname, str);
};

const buildUrl = (input, path) => {
  const obj = url.parse(input.options.uri);
  if (input.next && input.next.uri) {
    input.next.uri = _buildUrl(obj, input.next.uri);
  }

  input.todoList = input.todoList || [];

  for(let i = 0; i < input.todoList.length; i++) {
    input.todoList[i].uri = _buildUrl(obj, input.todoList[i].uri);
  }
};

const getFullUrl = (baseUrl, path) => {
  const obj = url.parse(baseUrl);
  return _buildUrl(obj, path);
};



module.exports = {
  buildUrl,
  getFullUrl,
  yyyymmdd,
  errLogger
};


