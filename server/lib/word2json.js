#!/usr/bin/env node
'use strict';

const path = require('path');
const fs = require('fs');
const mammoth = require('mammoth');
const md2json = require('md2json2html');

const run = (input) => {
    mammoth.convertToMarkdown({path: input.source}).then((result) => {
        const mdData = result.value;
        console.log(mdData);
        const jsonData = md2json.markdown2json(result.value.replace(/<\s*.*>/g, ''));
        console.log(JSON.stringify(jsonData.content.children, null, 4)); // md2json2html生成的json
        const contentArr = jsonData.content.children;

        const resultArr = [];
        let currentFlag = 0;
        let lastFlag = 0;

        let jsonCell = {
            entryContent: ''
        };
        let level = [];
        level.push(input.filename);

        contentArr.forEach((item) => {
            //console.log(item);
            if (/h\d/g.test(item.tagName)) {
                currentFlag = 1;
                if (lastFlag === -1 && currentFlag === 1) {
                    jsonCell = {
                        entryContent: ''
                    };
                    level = [];
                    level.push(input.filename);

                    resultArr.push(jsonCell);
                }
                level.push(item.children.replace(/[一二三四五六七八九十、。]/g, ''));
            }
            else if (item.tagName === 'p') {
                jsonCell.level = level;
                jsonCell.entryContent += item.children;
                currentFlag = -1;
            }
            lastFlag = currentFlag;
        });
        console.log('resultArr----\n', resultArr);
    }).catch((err) => {
        console.error(err);
    });
};

run({
    filename: '0330',
    source: path.join(__dirname, './0330.docx'),
    target: path.join(__dirname, './1.md')
});


