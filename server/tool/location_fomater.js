/**
 * Created by pengfeixiang on 17/12/3.
 */

'use strict';

const compressProvince = (str) => {
  return str.replace(/回族|壮族|维吾尔|自治区|省$|市$/g, '');
};


const compressCity = (str) => {
  return str.replace(/回族|苗族|土家族|自治县$|蒙古自治州|自治州$|盟$|市$|地区$|新区$|区$|县$/g, '');
};


const strFormater = (str) => {

};

const arrayFormater = (arr) => {

};

const objectFormater = (obj) => {
  const retArr = [];
  if (obj.country && obj.country !== '中国') {
    console.error('未实现的国家检测！！！');
    return;
  }

  retArr.push('中国');

  if (!obj.province || !obj.city) {
    console.error(obj);
    return;
  }

  retArr.push(compressProvince(obj.province));

  if (obj.province !== obj.city) {
    retArr.push(compressCity(obj.city));
  }
  else {
    obj.district ? retArr.push(compressCity(obj.district)) : retArr.push(compressCity(obj.city));
  }

  return retArr;
};


const formater = (input) => {
  if (typeof input === 'string') {
    return strFormater(input);
  }

  if (input instanceof Array) {
    return arrayFormater(input);
  }

  return objectFormater(input);
};


module.exports = formater;