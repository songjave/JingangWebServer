"use strict";

const jsonData = require('../db/pediaContent/content.json');
const error = require('../config/error');

const searchContent = (input, cb) => {
    //console.log(jsonData);
    const name = input.entryName.replace(/[\s(),\.'"?!#<>-~:（），。‘’“”：~、？！]/g, '');
    const matchWords = `${input.bookName}-${name.trim()}`;
    console.log('matchWords', matchWords);
    for (let val in jsonData) {
        //console.log(val);
        if (val === matchWords) {
            //console.log(jsonData[val]);
            const result = {
                data: jsonData[val]
            };
            return cb(0, result);
        }
    }
    return cb(error.NOT_FOUND, {
        errMsg: 'NOT_FOUND',
        matchWords: matchWords
    });
};

module.exports = {
    searchContent
};





