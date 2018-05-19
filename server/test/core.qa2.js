"use strict";
const qa2 = require('../core/qa2');

const question = {
    "json": '{"question": "地理环境"}'
};
//qa2.parse(question);

qa2.match(question, (err, data = {}) => {
    if (!err) {
        return res.json({
            errCode: err,
            errMsg: '',
            data
        });
    }
});
