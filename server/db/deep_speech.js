'use strict';

const path = require('path');
const NAME = 'deep_speech';
const mongo = require('../config/mongo');
const mongoosePaginate = require('mongoose-paginate');
const util = require('../tool/util');

// schema
const itemSchema = new mongo.Schema({
    taskId      : {type: String, required: true},
    docId       : {type: String, required: true},
    userId      : {type: String, required: true},
    originText  : {type: String, required: true},
    updateAt   : {type: Date, default: Date.now},
    status     : {type: Number, default: 0},
    remark     : {type: String, default: util.yyyymmdd}
} , {strict: false});


// docId, userId, splitedTextList, rawWav, splitedWavList, wavDuration, tag, creator, result { timestamp{ textList, wavList, duration, editor, }}

// 分页插件
itemSchema.plugin(mongoosePaginate);

const ItemsModel = mongo.model(NAME, itemSchema);

const add = (obj) => {
    let item = new ItemsModel(obj);
    return item.save();
};

const paginate = (query, options) => {
    //console.log(query, options);
    return ItemsModel.paginate(query, options);
};

const insert = (input) => {
    let query = {
        taskId: input.taskId,
    };

    let options = {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true
    };

    return ItemsModel.findOneAndUpdate(query, input, options);
};

const getById = (id) => {
    return ItemsModel.findById(id).lean().exec();
};

const deleteById = (id) => {
    console.log(id);
    return ItemsModel.findByIdAndRemove(id).exec();
};

const remove = (filter = {}) => {
    if (Object.keys(filter) === 0) {
        return Promise.reject('need filter');
    }
    return ItemsModel.remove(filter);
};

const updateById = (id, input) => {
    //console.log(input);
    input.updateAt = Date.now();
    return ItemsModel.where({_id: id}).update(input).exec();
};

const disableById = (id) => {
    return ItemsModel.where({_id: id}).update({status: 1}).exec();
};

const enableById = (id) => {
    return ItemsModel.where({_id: id}).update({status: 0}).exec();
};

module.exports = {
    add,
    paginate,
    insert,
    getById,
    deleteById,
    remove,
    updateById,
    disableById,
    enableById,
};
