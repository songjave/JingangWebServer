/**
 * Created by pengfeixiang on 18/1/7.
 */

'use strict';

const core = require('../core/sync');

core.syncToFaceServer({}, (err, data) => {
    console.log(err, data);
});
