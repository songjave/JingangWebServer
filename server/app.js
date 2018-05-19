
"use strict";

const httpServer = require("./http/server.js");

if (!process.env.NODE_ENV) {
    process.env.NODE_ENV = 'testing';
}
console.log(process.env.NODE_ENV);

httpServer.start();

process.umask(0);
process.on('uncaughtException', function(err) {
    console.error('catch exception:', err);
});
