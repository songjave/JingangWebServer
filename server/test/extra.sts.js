const sts = require('../sts/splitWav');

const input = '/zhangsan';

sts.fileArr(input, (err, data)=> {
    console.log(data);
});
