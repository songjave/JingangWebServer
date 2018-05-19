/**
 * Created by pengfeixiang on 18/1/26.
 */

'use strict';
const fs = require('fs');
const path = require('path');
const db = require('../db/deep_speech');
const date = require('date-and-time');
const mkdirp = require('mkdirp');
const tar = require('tar');

const getDbItems  = (input = {}) => {
    const query = {
        remark: input.date || date.format(new Date(), 'YYYYMMDD'),
        'result.0': { '$exists': true }
    };

    //console.log(query);

    const options = {
        sort: {updateAt: 'asc'},
        limit: 10000,
        lean: true
    };

    return db.paginate(query, options);
};

const writeJsonTxt = (input = {}) => {
    return new Promise((resolve, reject) => {
        const jsonFile = path.join(input.dir, 'data.txt');
        const lines = [];
        input.docs.forEach((obj) => {
            lines.push(JSON.stringify(obj));
        });
        return fs.writeFile(jsonFile, lines.join('\n'), (err) => {
            err ? reject(err) : resolve({ jsonFile });
        });
    });
};

const createDir = () => {
    return new Promise((resolve, reject) => {
        const dir = date.format(new Date(), 'YYYYMMDD') + '_' + Date.now();
        const fullDir = path.join(process.env.HOME, 'deep_speech_export/' + dir);
        return mkdirp(fullDir, function (err) {
            if (err) {
                return reject(err);
            }
            return resolve({ dir: fullDir });
        });
    });
};

const createTar = (input = {}) => {
    const targetList = [];
    let totalDuration = 0;
    let checkedDuration = 0;

    input.docs.forEach((item) => {
        const target = path.join(input.dir, item._id + '.tar.gz');
        totalDuration += +(item.duration) || 0;
        checkedDuration += item.result[item.result.length - 1].duration || 0;
        targetList.push(target);
        tar.c({cwd: path.join(item.uploadDir, '../'), gzip: true, file: target, sync: true}, [path.basename(item.uploadDir)]);
        // tar.c({ gzip: true, file: target, sync: true}, [item.uploadDir]);
    });
    return Promise.resolve({ targetList, totalDuration, checkedDuration });
};

const run = (input = {}) => {
    const state = {};
    state.date = input.date || date.format(new Date(), 'YYYYMMDD'); //不填则默认当天

    return createDir().then((result) => {
        //console.log(result);
        state.dir = result.dir;
        return getDbItems(state);
    }).then((result = {}) => {
        // console.log(result);
        state.total = result.total;
        state.docs = result.docs;
        return createTar(state);
    }).then((result = {}) => {
        // console.log(result);
        state.checkedDuration = result.checkedDuration || 0;
        state.totalDuration = result.totalDuration || 0;
        return writeJsonTxt(state); //等待tar包全部生成完成，才进行写入json的操作
    }).then((result) => {
        const ret = {
            dir: state.dir,
            total: state.total,
            date: state.date,
            checkedDuration: state.checkedDuration,
            totalDuration: state.totalDuration,
        };

        state.taskId = input.taskId || '';
        state.docs = null;
        state.createAt = date.format(new Date(), 'YYYY/MM/DD HH:mm:ss');
        fs.writeFileSync(path.join(state.dir, './readme.json'), JSON.stringify(state, null, 4));
        console.log(JSON.stringify(ret));
        process.exit(0);
    }).catch((err) => {
        console.error(JSON.stringify({err: err}));
        process.exit(-1);
    });
};

run({ date: process.argv[2] || '', taskId: process.argv[3] });
