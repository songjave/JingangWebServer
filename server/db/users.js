'use strict';

const path = require('path');
const NAME = 'user';
const mongo = require('../config/mongo');
const mongoosePaginate = require('mongoose-paginate');
const util = require('../tool/util');

// schema
const itemSchema = new mongo.Schema({
    uid      :  {type: String, required: true},
    name     :  {type: String, required: true},
    role     :  {type: String, required: true},
    password :  {type: String, required: true},
    createAt :  {type: Date, default: Date.now},
    updateAt :  {type: Date, required: true},
    face     :  {type: Buffer},
    voice    :  {type: Buffer},
} , {strict: false});

// 分页插件
itemSchema.plugin(mongoosePaginate);

// 海报背景图的 model
const ItemsModel = mongo.model(NAME, itemSchema);

const find = (input) => {
    let query = {
        uid: input.uid
    };

    return ItemsModel.find(query);
};

const add = (input) => {
    input.updateAt = Date.now();
    let item = new ItemsModel(input);
    return item.save();
};

const paginate = (query, options) => {
    return ItemsModel.paginate(query, options);
};

const getById = (id) => {
    return ItemsModel.findById(id).exec();
};

const getByUid = (uid) => {
    return ItemsModel.findOne({ uid }).exec();
};

const deleteById = (id) => {
    return ItemsModel.findByIdAndRemove(id).exec();
};

const remove = (filter = {}) => {
    if (Object.keys(filter).length === 0) {
        return Promise.reject('need filter');
    }
    return ItemsModel.remove(filter);
};

const updateById = (id, input) => {
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
    find,
    add,
    paginate,
    getById,
    getByUid,
    deleteById,
    remove,
    updateById,
    disableById,
    enableById,
};
