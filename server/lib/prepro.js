"use strict";

const xlsx = require('xlsx');
const fs = require('fs');

const dir = '../db/pediaContent/';

const xlsxToJson = (path, contentJson) => {
    const workbook = xlsx.readFile(path);
    const sheetNames = workbook.SheetNames;
    const worksheet = workbook.Sheets[sheetNames[0]];
    let sheet = xlsx.utils.sheet_to_json(worksheet);
    //console.log(sheet);
    const arr = [];
    for (let cell of sheet) {
        const lineArr = [];
        for (let item in cell) {
            //console.log(item);
            lineArr.push(cell[item]);
        }
        //console.log(lineArr + '-----');
        arr.push(lineArr);
    }
    //console.log(arr);

    arr.sort((a, b) => {
        return a.length - b.length;
    });
    arr.forEach((line) => {
        const lineJson = {};
        const name = line[line.length-1].replace(/\s(),\.'"\?!#<>-~:（），。‘’“”《》：~、？！）/g, '');
        contentJson[`${line[0]}-${name}`] = line;

    });
    //console.log(arr);
    //console.log(contentJson);
    //fs.writeFileSync(path.replace('xlsx', 'json'), JSON.stringify(contentJson)); //xlsx文件名
};

const writeJson = (dir, files, contentJson, cb) => {
    files.forEach((file) => {
        //console.log('focus:', file.match('.xlsx'));
        file.match('.xlsx') && xlsxToJson(dir + file, contentJson);
    });
    return cb();
};

const readDir = (dir) => {
    fs.readdir(dir, (err, files) => {
        if (err) {
            return console.error(err);
        }
        const contentJson = {};
        writeJson(dir, files, contentJson, () => {
            fs.writeFileSync(dir + 'content.json', JSON.stringify(contentJson));
        });

    });
};

readDir(dir);






