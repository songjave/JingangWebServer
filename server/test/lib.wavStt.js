const wavStt = require('../lib/wavStt');

wavStt.wavToText('/sts/1516356428277_3_3/1.wav', (err, data) => {
    console.log(err, data);
});
