'use strict';

const whiteList = require('../db/whiteList1.json');
const nlpServer = require('../lib/nlpServer');
const ERR = require('../config/error');

const isHave = (words, keyWord) => {
    return words.indexOf(keyWord) !== -1;
};

const groundCalc = (question, keyWord, type) => {
    const arr = question.match(/\d*\b高地/g);
    if (isHave(question, '高地') && isHave(question, keyWord) && arr && arr.length === 2) {
        const num1 = parseInt(arr[0].replace('高地', ''));
        const num2 = parseInt(arr[1].replace('高地', ''));
        console.log('parseC/D/E done');
        return {
            "type": type,
            "question": `高地${keyWord}`,
            "num1": num1,
            "num2": num2
        };
    }
};

//context
const parseA = (input) => {
    console.log('input:', input);
    if (input.context) {
        //console.log('input.context:', input.context);
        //console.log('input.question:', input.question);
        if (input.context === '东引岛情况' && input.question === '地理环境') {
            return {
                "type": "whiteList",
                "id": 19,
                "question": "东引岛地理情况"
            };
        }
        else if (isHave(input.context, '习总书记') && isHave(input.question, '习近平')) {
            input.question = `习近平${input.context}`;
        }
    }
};

//whiteList
const parseB = (input) => {
    if (input.image) {
        return {
            "type": "whiteList",
            "id": 20,
            "question": "image"
        };
    }
    const question = input.question;
    for (let val of whiteList.children) {
        let loop = 0;
        for (let i in val.keyWord) {
            if (!isHave(question, val.keyWord[i])) {
                loop = -1;
                if (val.keyWord[i] === "习近平" && ( isHave(question, '习主席') || isHave(question, '习近平总书记') ) ) {
                    loop = 0;
                }
                else if (val.keyWord[i] === "毛泽东" && isHave(question, '毛主席')) {
                    loop = 0;
                }
            }
        }
        //matched
        if (loop === 0) {
            console.log('parseB done');
            return {
                "type": "whiteList",
                "id": val.id,
                "question": question
            };
        }
    }
};

//ground calculate
const parseC = (input) => {
    const question = input.question;
    return groundCalc(question, '直线距离', 'lineCalc');
};

const parseD = (input) => {
    const question = input.question;
    return groundCalc(question, '地表距离', 'surfaceCalc');
};

const parseE = (input) => {
    const question = input.question;
    return groundCalc(question, '球面距离', 'sphericalCalc');
};

//highTide calculate
const parseF = (input) => {
    const question = input.question;

    const time = question.match(/\d+/g);
    if (isHave(question, '涨潮') && time) {
        console.log('parseF done');
        return {
            "type": "tideCalc",
            "question": `涨潮时间`,
            "time": time
        };
    }
};

//qa nlp
const parseG = (input) => {
    return {
        "type": "nlp",
        input
    }
};

const parse = (input) => {
    console.log('parse-input:', input);
    //let parseFunc = [parseA, parseB, parseC, parseD, parseE, parseF, parseG];
    let parseFunc = [parseG];
    for (let i in parseFunc) {
        const ret = parseFunc[i](input);
        if (ret) {
            console.log('ret:', ret);
            return ret;
        }
    }
};

const resWhiteList = (input, cb) => {
    console.log('input.question:', input.question);
    for (let val of whiteList.children) {
        if (input.id === val.id) {
            if (input.id === 48) { //习总书记上下文，需保留住上文的问题
                val.context = input.question;
                console.log('val.context:', val.context);
            }
            const result =  {
                "answer": val.answer,
                "option": val.option,
                "recommend": val.recommend,
                "file": val.file,
                "fileName": val.fileName,
                "img": val.img,
                "radio": val.radio,
                "detail": val.detail,
                "context": val.context
            };
            console.log(result);
            return cb(0, result);
        }
    }
};

const fakeGroundCalc = (input, cb) => {
    const num = Math.abs((input.num1 - input.num2) % 3 + Math.random() * 10);
    const calc = num.toFixed(4).toString();
    const result =  {"answer": calc};
    return cb(0, result);
};

const resLineCalc = (input, cb) => {
    return fakeGroundCalc(input, cb);
};

const resSurfaceCalc = (input, cb) => {
    return fakeGroundCalc(input, cb);
};

const resSphericalCalc = (input, cb) => {
    return fakeGroundCalc(input, cb);
};

const resTideCalc = (input, cb) => {
    const num = Math.random() * 10 + 15;
    const calc = num.toFixed(1).toString();
    const result =  {"answer": calc};
    return cb(0, result);
};

const resNlp = (input, cb) => {
    return nlpServer.query(input.input, (err, result = {}) => {
        if (err) {
            return cb(err);
        }

        console.log(result);
        const jsonData = result.jsonData || {};

        const data = {
            context: '',
            answer: jsonData.answer || '',
            links: jsonData.links || [],
            version: jsonData.version || ''
        };

        return cb(0, data);
    });
};

const response = (input, cb) => {
    const map = {
        whiteList: resWhiteList,
        lineCalc: resLineCalc,
        surfaceCalc: resSurfaceCalc,
        sphericalCalc: resSphericalCalc,
        tideCalc: resTideCalc,
        nlp: resNlp
    };
    if (!map[input.type]) {
        return cb(ERR.UNSUPPORTED);
    }
    return map[input.type](input, cb);
};

const match = (input, cb) => {
    const retJson = parse(input);
    return response(retJson, cb);
};

module.exports = {
    match,
    parse,
};

