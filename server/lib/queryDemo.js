/**
 * Created by daiuyanjun on 18/01/02.
 */

'use strict';

const ERROR = require('../config/error');
const jsonData = require('../db/whiteList.json');
const jsonContext = require('../db/context.json');
let frontQuest = [];


//matched answer json
const answerJson = (val) => {
    return {
        "id": val.id,
        "type": val.type,
        "answer": val.answer,
        "option": val.option,
        "recommend": val.recommend,
        "file": val.file,
        "fileName": val.fileName,
        "frontQuest": []
    };
};

const query = (input) => {

    console.log('input.question:', input.question);
    //匹配现有的两类上下文中的"问题上文"
    let question = JSON.parse(input.question);
    console.log('question:', question);
    if (question.indexOf('东引') !== -1 && question.indexOf('情况') !== -1
        && question.indexOf('地理') === -1 && question.indexOf('敌情') === -1) {
        question = `${question}add01`;
    }
    else if (question.indexOf('习总书记') !== -1 &&
        question.indexOf('习近平') === -1 && question.indexOf('习主席') === -1 && question.indexOf('习近平总书记') === -1) {
        question = `${question}replace01`;
    }

    console.log('请求开始\n');
    console.log("question"+question);
    console.log("context", input.context);
    //context => contextArr
    let contextArr = input.context.split(',');
    let isMatch = -1;

    //query "whiteList.josn"
    for (let val of jsonData.children) {
        let loop = 0;
        for (let i in val.keyWord) {
            if (question.indexOf(val.keyWord[i]) === -1) {
                loop = -1;
                if (val.keyWord[i] === "习近平" && (question.indexOf("习主席") !== -1 || question.indexOf("习近平总书记") !== -1)) {
                    loop = 0;
                }
                else if (val.keyWord[i] === "毛泽东" && (question.indexOf("毛主席") !== -1 || question.indexOf("习近平总书记") !== -1)) {
                    loop = 0;
                }
            }
        }
        //"whiteList.josn" matched
        if (loop === 0) {
            isMatch = 0;
            frontQuest = [];

            //calculate, id is String
            if (val.type === 'calculation' && val.id === '01') {
                if (question.match(/\d*\b高地/g)) {
                    const arr = question.match(/\d*\b高地/g);
                    const min = parseInt(arr[0].replace('高地', '') + "<br />");
                    const max = parseInt(arr[1].replace('高地', '') + "<br />");
                    let num = Math.abs((max - min) % 3 + Math.random() * 10);
                    val.answer = num.toFixed(4).toString();
                }
                else {
                    frontQuest = [];
                    console.log('请求结束\n');
                    return { disMatch: true};
                }

            } else if (val.type === 'calculation' && val.id === '02') {
                let num = Math.random() * 10 + 15;
                val.answer = num.toFixed(1).toString();
            }

            const result = answerJson(val);
            console.log(result);
            console.log('请求结束\n');
            return result;
        }
    }
    //"whiteList.josn" dismatch
    if (isMatch === -1) {
        frontQuest.push(question);

        //query "context.json"
        for (let val of jsonContext.children) {
            let loop = 0;
            for (let i in val.keyWord) {
                if (question.indexOf(val.keyWord[i]) === -1) {
                    loop = -1;
                    /*if (val.keyWord[i] === "习近平" && (question.indexOf("习主席") !== -1 || question.indexOf("习近平总书记") !== -1)) {
                        loop = 0;
                    }
                    else if (val.keyWord[i] === "毛泽东" && (question.indexOf("毛主席") !== -1 || question.indexOf("习近平总书记") !== -1)) {
                        loop = 0;
                    }*/
                    //console.log(loop);
                }
            }
            //"context.json" matched
            if (loop === 0) {
                isMatch = 0;
                console.log('上下文问题匹配成功frontQuest:', frontQuest);
                console.log('请求结束\n');
                return {
                    "id": val.id,
                    "type": val.type,
                    "answer": val.answer,
                    "option": val.option,
                    "recommend": val.recommend,
                    "frontQuest": frontQuest
                };
            }
        }

        //针对现有的两类上下文问题, DIY context work
        let lastContext = [];
        if (input.context) {
            contextArr = contextArr.slice(-1);
        }

        if (contextArr) {
            let contextStr = contextArr.toString();

            console.log('focus:',contextStr.match(/replace01/g));
            //指定上文提交后，输入了新问题
            if (contextStr.match(/replace01/g)) {
                contextStr = contextStr.replace(/replace01/, '');
                input.context = input.context.replace(/replace01/, '');
                input.question = contextStr.replace('习总书记', input.question);
                console.log("新问题：", input.question);
                return query(input);
            }
            //match context words (client makes)

            else if (contextStr.match(/add01/g)) {
                // important!!!
                input.context = '';

                contextArr[0] = contextStr.replace(/add01/, '');
                contextArr.push(question);
                input.question = contextArr.join('');
                //console.log('newQuest:', newQuest);
                console.log("新问题：", input.question);
                return query(input);
            }
            else {
                frontQuest = [];
                console.log('请求结束\n');
                return { disMatch: true};
            }
        }

    }
};

const match = (input, cb) => {
    const data = query(input);
    if (data.disMatch) {
        return cb(ERROR.UNSUPPORTED);
    }

    return cb(0, data);
};

module.exports = {
    match
};
