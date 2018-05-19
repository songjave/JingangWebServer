'use strict';

const MAX_LEN = 30;
const MIN_LEN = 6;

const SEPARATOR_MAP = {
    SEPARATOR_A: ['\n', ',', '。', '!', '?'],
    SEPARATOR_B: [';', ','],
    SEPARATOR_C: [','],
    SEPARATOR_D: [',', '(', '、', ')'],
    SEPARATOR_E: [' ', '"', ':'] // 用于强制断句
};

const REG_MAP = {
    SEPARATOR_A: new RegExp( '([\n。!?])', 'g'),
    SEPARATOR_B: new RegExp( '([' + SEPARATOR_MAP.SEPARATOR_B.join('') + '])', 'g'),
    SEPARATOR_C: new RegExp( '([' + SEPARATOR_MAP.SEPARATOR_C.join('') + '])', 'g'),
    SEPARATOR_D: new RegExp( '([' + SEPARATOR_MAP.SEPARATOR_D.join('') + '])', 'g'),
    SEPARATOR_E: new RegExp( '([' + SEPARATOR_MAP.SEPARATOR_E.join('') + '])', 'g'),
};

const SPLIT_REG = new RegExp('.{1,' + MAX_LEN + '}', 'g');

const punctuateByChars = function(text, separator) {
    let splits = text.split(REG_MAP[separator]);
    let len = splits.length;
    if (splits.length <= 1) {
        return splits;
    }

    let separatorArr = SEPARATOR_MAP[separator];
    let texts = [];
    for (let i = 1; i < len; i++) {
        if (separatorArr.indexOf(splits[i]) >= 0) {
            texts.push(splits[i - 1] + splits[i]);
            splits[i] = '';
            splits[i - 1] = '';
        }
    }

    if (splits[len - 1]) {
        texts.push(splits[len - 1]);
    }

    //separator === 'SEPARATOR_A' && console.log(texts);
    return texts;
};



const punctuateByCharWithMinLength = function(text, separator) {
    let texts = punctuateByChars(text, separator);
    let newtexts = [];
    let segStr = '';
    let segLen = 0;

    //console.log(texts);
    texts.forEach((t) => {
        let len = t.length;
        if (segLen + len <= MIN_LEN) {
            segStr += t;
            segLen += len;
        }
        else {
            if (len > MIN_LEN) {
                if (segLen > 0) {
                    newtexts.push(segStr);
                    segStr = '';
                    segLen = 0;
                }
                newtexts.push(t);
            }
            else {
                newtexts.push(segStr);
                segStr = t;
                segLen = len;
            }
        }
    });

    if (segLen) {
        newtexts.push(segStr);
    }

    for (let i = 0; i < newtexts.length - 1; i++) {
        newtexts[i] = newtexts[i].replace(/,$/, '');
    }

    return newtexts;
};



const punctuateByCharWithMaxLength = function(text, separator) {
    let texts = punctuateByChars(text, separator);
    let newtexts = [];
    let segStr = '';
    let segLen = 0;

    //console.log(texts);
    texts.forEach((t) => {
        let len = t.length;
        if (segLen + len <= MAX_LEN) {
            segStr += t;
            segLen += len;
        }
        else {
            if (len > MAX_LEN) {
                if (segLen > 0) {
                    newtexts.push(segStr);
                    segStr = '';
                    segLen = 0;
                }
                newtexts.push(t);
            }
            else {
                newtexts.push(segStr);
                segStr = t;
                segLen = len;
            }
        }
    });

    if (segLen) {
        newtexts.push(segStr);
    }

    for (let i = 0; i < newtexts.length - 1; i++) {
        newtexts[i] = newtexts[i].replace(/,$/, '');
    }

    return newtexts;
};

const _parse = function (text) {

    //level 1
    let texts = punctuateByChars(text, 'SEPARATOR_A');

    //level 2
    let newtexts = [];
    texts.forEach((t) => {
        if (t.length > MAX_LEN) {
            newtexts = newtexts.concat(punctuateByChars(t, 'SEPARATOR_B'));
        }
        else {
            newtexts.push(t);
        }
    });

    //console.log('l2', newtexts);

    let separators = ['SEPARATOR_C'];


    texts = newtexts;
    newtexts = [];
    texts.forEach((t) => {
        if (t.length > MAX_LEN) {
            newtexts = newtexts.concat(punctuateByCharWithMaxLength(t, 'SEPARATOR_D'));
        }
        else {
            newtexts.push(t);
        }
    });

    //console.log(newtexts);
    if (newtexts.indexOf('\n') < 0) {
        return newtexts;
    }

    let ret = [newtexts[0]];
    for (let i = 1; i < newtexts.length; i++) {
        if (newtexts[i] === '\n') {
            ret[ret.length - 1] += '\n';
        }
        else {
            ret.push(newtexts[i]);
        }
    }

    return ret;
};


const forceSplit = (text) => {
    let arr = punctuateByCharWithMaxLength(text, 'SEPARATOR_E');
    let ret = [];
    arr.forEach((str) => {
        if (str.length < MAX_LEN) {
            ret.push(str);
        }
        else {
            ret = ret.concat(str.match(SPLIT_REG));
        }
    });

    return ret;
};


const theParse = (text, isStrict) => {
    let list = [];
    let arr = text.split('\n');
    if (arr.length <= 1) {
        list = _parse(text);
    }
    else {
        if (arr[arr.length - 1] === '') {
            arr.pop();
        }

        arr.forEach(function (str) {
            let retArr = _parse(str);
            if (retArr.length === 0) {
                retArr = ['\n'];
            }
            else {
                retArr[retArr.length - 1] += '\n';
            }

            retArr.forEach(function (_str) {
                list.push(_str);
            });
        });
    }

    if (!isStrict) {
        return list;
    }

    let hasExceeded = false;
    for (let i = 0; i < list.length; i++) {
        if (list[i].length > MAX_LEN) {
            hasExceeded = true;
            list[i] = forceSplit(list[i]);
        }
    }

    if (!hasExceeded) {
        return list;
    }

    let ret = [];
    list.forEach((item) => {
        if (item instanceof Array) {
            ret = ret.concat(item);
        }
        else {
            ret.push(item);
        }
    });

    return ret;
};

const parse = (text, isStrict) => {
    const list = theParse(text, isStrict);
    //console.log(list.length);
    const ret = [];
    let tmp = '';
    for (let i = 0; i < list.length; i++) {
        list[i] = list[i].replace(/[()~<>\[\]{}\-+/\\@#$%^&*|:.,;?!。、\t“”‘’'"]/g, ' ').trim().toUpperCase();
        const len = list[i].length;
        if (len === 0) {
            continue;
        }

        if (len > MIN_LEN) {
            ret.push(tmp  ? tmp + ' ' + list[i] : list[i]);
            tmp = '';
            continue;
        }

        //console.log(list[i]);
        if (tmp) {
            ret.push(tmp + ',' + list[i]);
            tmp = '';
        }
        else if (i === 0) {
            tmp = list[i];
        }
        else if (i === list.length - 1) {
            ret[ret.length - 1] += ' ' + list[i];
        }
        else if (ret.length > 0 && ret[ret.length - 1].length < list[i+1].length) {
            ret[ret.length - 1] += ' ' + list[i];
        }
        else {
            tmp = list[i];
        }
    }
    tmp && ret.push(tmp);
    const arr = [];
    ret.forEach((str) => {
        str && arr.push(str);
    });
    //console.log(ret.length);
    return arr;
};

module.exports = {
    //parse: theParse
    parse
};
