/**
 * Created by pengfeixiang on 18/2/4.
 */

const fs = require('fs');
const path = require('path');

const SOURCE_DIR = '/Users/pengfeixiang/Desktop/wav_txts';
const TARGET_DIR = '/Users/pengfeixiang/Desktop/wav_txts_new';
const files = fs.readdirSync(SOURCE_DIR);
const fileFormat = require('../lib/fileFormat');
const iconv = require('iconv-lite');

/*files.forEach((txt) => {
    const textPath = path.join(SOURCE_DIR, txt);
    return fileFormat.isGbkTextFile(textPath, (err, isGbk) => {
        if (isGbk) {

            const buffer = iconv.decode(fs.readFileSync(textPath), "gbk");
            fs.writeFileSync(path.join(SOURCE_DIR, txt), buffer);
            console.log('rewrite', txt);
        }
    });
});*/


const format = () => {
files.forEach((txt) => {
    if (!/\.txt/.test(txt)) {
        return;
    }

    //console.log(txt);
    const file = path.join(SOURCE_DIR, txt);
    const lines = fs.readFileSync(file, 'utf8').split('\n');
    const ret = [];

    lines.forEach((line) => {
        line = line.trim();
        if (!line) {
            return;
        }

        const arr = line.split('###');
        if (arr.length !== 2) {
            console.log(arr);
            throw new Error(`${txt} 文件解析异常`);
        }

        const str = arr[1].trim();
        if (!str) {
            return;
        }

        let s = str.toUpperCase().replace(/\./g, '点').replace(/\d+/g, (n) => {
            const num = +n;
            switch(num) {
                case 707: return '七零七';
                case 130: return '一三零';
                case 737: return '七三七';
                case 90: return '九十';
                case 50: return '五十';
                case 40: return '四十';
                case 20: return '二十';
                case 0: return '零';
                case 1: return '一';
                case 2: return '二';
                case 3: return '三';
                case 4: return '四';
                case 5: return '五';
                case 6: return '六';
                case 7: return '七';
                case 8: return '八';
                case 9: return '九';
                case 10: return '十';
                case 11: return '十一';
                case 12: return '十二';
                case 13: return '十三';
                case 16: return '十六';
                case 19: return '十九';
                case 33: return '三十三';
                case 56: return '五十六';
                case 85: return '八五';
                case 95: return '九五';
                case 120: return '一百二十';
                case 200: return '两百';
                case 400: return '四百';
                case 2003: return '二零零三';
                case 2005: return '二零零五';
                case 2008: return '二零零八';
                case 2020: return '二零二零';
                case 2019: return '二零一九';
                case 2018: return '二零一八';
                case 2017: return '二零一七';
                case 2016: return '二零一六';
                case 2015: return '二零一五';
                case 2014: return '二零一四';
                case 2013: return '二零一三';
                case 2012: return '二零一二';
                case 2024: return '二零二四';
                case 2028: return '二零二八';
                case 2035: return '二零三五';
                case 2760: return '两千七百六十';
                case 12306: return '一二三零六';
                case 2300000: return '二百三十万';
                default: console.log(num, str, txt);
            }
        });
        ret.push(`${arr[0]}###${s}`);
    });

    fs.writeFileSync(path.join(TARGET_DIR, txt), ret.join('\r\n'));
});

};

format();

