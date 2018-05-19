"use strict";

const search = require('../lib/pediaContent');

const input = {
    bookName: '军事法',
    entryName: '《日内瓦第二公约》'
};

search.searchContent(input, (err, data) => {
    if (err) {
        console.log(err);
        return err;
    }
    console.log(data);
    return data;
});
