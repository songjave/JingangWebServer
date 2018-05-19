'use strict';
const db = require('../../db/videoInfo');
const ERROR = require('../../config/error');

const insert = (input, cb) => {
    return db.add(input).then((data) => {
        console.log(data);
        return cb(0, data);
    }).catch((err) => {
        console.error(err);
        return cb(ERROR.UNKNOWN);
    });
};

const update = (input, cb) => {
    if (!input.id) {
        return cb(ERROR.PARAMS_MISSING);
    }

    const id = input.id;

    return db.updateById(id, input).then((data) => {
        return cb(0, data);
    }).catch((err) => {
        console.error(err);
        return cb(ERROR.UNKNOWN);
    });
};


const list = (input, cb) => {
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

    console.log(query, options);
    return db.paginate(query, options).then((result) => {
        return cb(0, result);
    }).catch((err) => {
        console.error(err);
        return cb(ERROR.UNKNOWN, {errMsg: 'get activity error'});
    });
};



const getById = (input, cb) => {
    if (!input.id) {
        return cb(ERROR.PARAMS_MISSING);
    }

    return db.getById(input.id).then((result) => {
        return cb(0, result);
    }).then((err) => {
        console.error(err);
        return cb(ERROR.UNKNOWN);
    });
};


const delById = (input, cb) => {
    if (!input.id) {
        return cb(ERROR.PARAMS_MISSING, {errMsg : "missing id"});
    }

    return db.deleteById(input.id).then(() => {
        return cb(0);
    }).catch( (err) => {
        console.error(err);
        return cb(ERROR.UNKNOWN);
    });
};


module.exports = {
    insert,
    delById,
    update,
    getById,
    list
};
