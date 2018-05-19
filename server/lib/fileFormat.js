/**
 * Created by pengfeixiang on 18/1/22.
 */
'use strict';

const spawn = require('child_process').spawn;

const isGbkTextFile = (filePath, cb) => {
    const cmd = spawn('file', [filePath]);
    const output = [];

    cmd.stdout.on('data', (data) => {
        output.push(data);
        console.log(`stdout: ${data}`);

    });

    cmd.stderr.on('data', (data) => {
        console.log(`stderr: ${data}`);
    });

    cmd.on('close', (code) => {
        //console.log(`child process exited with code ${code}`);
        if (code) {
            return cb(-1);
        }

        return cb(0, !(/UTF-8|data$/i.test(output.join(''))));
    });
};


module.exports = {
    isGbkTextFile
};
