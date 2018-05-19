/**
 * Created by pengfeixiang on 18/1/28.
 */

'use strict';
const fs = require('fs');
const path = require('path');
const ERROR = require('../../config/error');

const lib = require('../../lib/deep_speech/voice_export');
const db = require('../../db/manage/deep_speech_export');

const lib2 = require('../../lib/deep_speech/voice_import');
const db2 = require('../../db/manage/deep_speech_import');
const date = require('date-and-time');

const BUS_STATION_DIR = '/data/deep_voice_bus_station';

const doExport = (input = {}, cb) => {
    input.date = input.date || date.format(new Date(), 'YYYYMMDD');
    input.creator = input.creator || 'admin';

    let item = null;
    db.add(input).then((data) => {
        item = data;
        input.id = item._id;
        return lib.doExport(input);
    }).then((result = {}) => {
        result.date = input.date;
        result.creator = input.creator;
        result.status = 1;
        return db.updateById(item._id, result);
    }).then(() => {
        return cb(0);
    }).catch((err) => {
        return cb(err);
    });
};

const doImport = (input = {}, cb) => {
    input.dir = input.dir || '';
    input.creator = input.creator || 'admin';

    let item = null;
    db2.add(input).then((data) => {
        item = data;
        input.id = item._id;
        return lib2.doExport(input);
    }).then((result = {}) => {
        result.creator = input.creator;
        return db2.updateById(item._id, result);
    }).then(() => {
        return cb(0);
    }).catch((err) => {
        return cb(err);
    });
};

const getBusStationDirs = (input, cb) => {
    fs.readdir(BUS_STATION_DIR, (err, files) => {
        if (err) {
            console.error(err);
            return cb(-1);
        }
        const retArr = [];
        files.forEach((str) => {
            retArr.push({ path: path.join(BUS_STATION_DIR, str)});
        });

        return cb(0, {list: retArr});
    });
};


const delExportedRecordById = (input, cb) => {
    return db.deleteById(input.id).then(() => {
        return cb(0);
    }).catch((err) => {
        console.error(err);
        return cb(ERROR.UNKNOWN, {errMsg: '数据库错误'});
    });
};

const delImportedRecordById = (input, cb) => {
    return db2.deleteById(input.id).then(() => {
        return cb(0);
    }).catch((err) => {
        console.error(err);
        return cb(ERROR.UNKNOWN, {errMsg: '数据库错误'});
    });
};

const listExportedRecord = (input, cb) => {
    const data = input;
    let query = {};
    let options = {
        offset: +(data.offset) || 0,
        limit: +(data.limit) || 10,
        lean: true
    };

    if (data.sort_field) {
        options.sort = {};
        let sortFieldArray = data.sort_field.split(',');
        let sortOrderArray = (data.sort_order || '').split(',');
        for (let i = 0; i < sortFieldArray.length; i++) {
            options.sort[sortFieldArray[i]] = sortOrderArray[i] || 'desc';
        }
    }

    if (data.search_key && data.search_field) {
        let searchKeyArr = data.search_key.split(',');
        let searchFieldArr = data.search_field.split(',');

        for (let i = 0; i < searchFieldArr.length; i++) {
            (searchFieldArr[i] && searchKeyArr[i]) ? query[searchFieldArr[i]] = new RegExp(searchKeyArr[i], 'i') : null;
        }
    }

    return db.paginate(query, options).then((result) => {
        return cb(0, result);
    }).catch((err) => {
        console.error(err);
        return cb(ERROR.UNKNOWN, {errMsg: 'get list error'});
    });
};


const listImportedRecord = (input, cb) => {
    const data = input;
    let query = {};
    let options = {
        offset: +(data.offset) || 0,
        limit: +(data.limit) || 10,
        lean: true
    };

    if (data.sort_field) {
        options.sort = {};
        let sortFieldArray = data.sort_field.split(',');
        let sortOrderArray = (data.sort_order || '').split(',');
        for (let i = 0; i < sortFieldArray.length; i++) {
            options.sort[sortFieldArray[i]] = sortOrderArray[i] || 'desc';
        }
    }

    if (data.search_key && data.search_field) {
        let searchKeyArr = data.search_key.split(',');
        let searchFieldArr = data.search_field.split(',');

        for (let i = 0; i < searchFieldArr.length; i++) {
            (searchFieldArr[i] && searchKeyArr[i]) ? query[searchFieldArr[i]] = new RegExp(searchKeyArr[i], 'i') : null;
        }
    }

    return db2.paginate(query, options).then((result) => {
        return cb(0, result);
    }).catch((err) => {
        console.error(err);
        return cb(ERROR.UNKNOWN, {errMsg: 'get list error'});
    });
};

module.exports = {
    doExport,
    doImport,
    getBusStationDirs,
    delExportedRecordById,
    delImportedRecordById,
    listExportedRecord,
    listImportedRecord
};
