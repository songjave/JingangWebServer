/**
 * Created by pengfeixiang on 18/1/28.
 */

'use strict';
const NAME = 'deep_speech_import';
const mongo = require('../../config/mongo');
const mongoosePaginate = require('mongoose-paginate');
const util = require('../../tool/util');

// schema
const itemSchema = new mongo.Schema({
    creator     : {type: String, required: true},
    createAt   : {type: Date, default: Date.now},
    status     : {type: Number, default: 0},
    remark     : {type: String, default: util.yyyymmdd}
} , {strict: false});

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

const getById = (id) => {
    return ItemsModel.findById(id).lean().exec();
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
    input.updateAt = Date.now();
    return ItemsModel.where({_id: id}).update(input).exec();
};

module.exports = {
    add,
    paginate,
    getById,
    deleteById,
    remove,
    updateById
};
