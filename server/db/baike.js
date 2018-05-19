'use strict';

const path = require('path');
const NAME = 'baike';
const mongo = require('../config/mongo');
const mongoosePaginate = require('mongoose-paginate');
const util = require('../tool/util');

// schema
const itemSchema = new mongo.Schema({
    wid         : {type: String, required: true},
    name        : {type: String, required: true},
    iUpdateAt   : {type: Date, default: Date.now},
    iStatus     : {type: Number, default: 0},
    iRemark     : {type: String, default: util.yyyymmdd}
} , {strict: false});

// 分页插件
itemSchema.plugin(mongoosePaginate);

// 海报背景图的 model
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
        wid: input.wid,
    };

    let options = {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true
    };

    return ItemsModel.findOneAndUpdate(query, input, options);
};

const getById = (id) => {
    return ItemsModel.findById(id).exec();
};

const deleteById = (id) => {
    return ItemsModel.findByIdAndRemove(id).exec();
};

const remove = (filter = {}) => {
    if (Object.keys(filter) === 0) {
        return Promise.reject('need filter');
    }
    return ItemsModel.remove(filter);
};

const updateById = (id, input) => {
    console.log(input);
    input.iUpdateAt = Date.now();
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
    enableById
};
