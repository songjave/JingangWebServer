"use strict";

const jsonData = require('../../db/knowledgeGraph.json');

const getGraph = (input, cb) => {
    console.log(input);
    //给服务 input
    //返回json
    const result = {
        graphJson: jsonData
    };
    return cb(0, result);
};

module.exports = {
    getGraph
};
