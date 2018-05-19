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

const TARGET_DIR = '/data/deep_voice_library';

const createTargetDir = (state) => {
    return new Promise((resolve, reject) => {
        const fullDir = path.join(TARGET_DIR, state.date);
        return mkdirp(fullDir, function (err) {
            if (err) {
                return reject(err);
            }
            return resolve({ dir: fullDir });
        });
    });
};

const _doImport = (state, index, cb) => {
    const doc = state.docs[index];
    if (!doc) {
        return cb(0);
    }

    //console.log(index);
    tar.x({cwd: state.targetDir, file: path.join(state.dir, doc._id + '.tar.gz'), sync: true}, []);
    doc.uploadDir = path.join(state.targetDir, doc.taskId);
    delete doc.__v;
    db.insert(doc).then(() => {
        index++;
        return _doImport(state, index, cb);
    }).catch((err) => {
        return cb(err);
    });
};


const doImport = (state) => {
    return new Promise((resolve, reject) => {
        _doImport(state, 0, (err) => {
            err ? reject(err) : resolve(0);
        });
    });
};

const run = (input = {}) => {
    const state = require(path.join(input.dir, './readme.json'));
    state.dir = input.dir;
    state.docs = [];
    //console.log(path.join(input.dir,'./data.txt'));
    const docs = fs.readFileSync(path.join(input.dir,'./data.txt'), 'utf-8').split('\n');
    docs.forEach((doc) => {
        state.docs.push(JSON.parse(doc));
    });

    return createTargetDir(state).then((result) => {
        fs.writeFileSync(path.join(result.dir, './dump.json'), JSON.stringify(state));
        state.targetDir = result.dir;
        return doImport(state);
    }).then(()=> {
        const ret = {
            dir: state.dir,
            targetDir: state.targetDir,
            total: state.total,
            date: state.date,
            importDate: date.format(new Date(), 'YYYYMMDD'),
            checkedDuration: state.checkedDuration,
            totalDuration: state.totalDuration,
        };
        console.log(JSON.stringify(ret));
        process.exit(0);
    }).catch((err) => {
        console.error(JSON.stringify({ err }));
        process.exit(-1);
    });
};

let dir = process.argv[2] || process.env.PWD;

if(!/\//.test(dir)) {
    dir = path.join(process.env.PWD, dir);
}

// dir = '/Users/pengfeixiang/deep_speech_export/1111';
run({ dir : dir});

