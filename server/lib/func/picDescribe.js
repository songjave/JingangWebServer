"use strict";

const error = require('../../config/error');
const path = require('path');
const fs = require('fs');

const describe = (input, cb) => { // 支持批量上传
    const result = {};
    const resultArr = [];
    input.forEach((file) => {
        // 给服务：file.path
        // 服务返回……
        // 返回假描述
        const resultText = `${file.originalname}的图像描述`;
        const described = {
            img: file.originalname,
            des: resultText
        };
        resultArr.push(described);
    });
    result.list = resultArr;
    return cb(0, result)
};

module.exports = {
    describe
};
