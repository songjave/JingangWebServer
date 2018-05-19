/**
 * Created by peng on 16/11/28.
 */

"use strict";

const http = require('http');
const https = require('https');

const PROTOCOL = {
    http,
    https
};

const get = (params, cb) => {
    let options = {
        host: params.host,
        path: params.path,
        port: params.port || 80,
        method: 'GET',
        headers: params.headers || {}
    };

    let req = PROTOCOL[params.protocol || 'http'].request(options, (res) => {
        //res.setEncoding('utf8');
        let body = '';
        res.on('data', (chunk) => {
            body += chunk;
        });
        res.on('end', () => {
            if (params.noParse) {
                return cb(0, body);
            }

            let json ;
            try {
                console.log(body);
                json = JSON.parse(body);
            } catch (e) {
                console.error(e);
                return cb(-1);
            }

            return cb(0, json);
        });
    });

    req.on('error', (err) => {
        console.error(err);
        return cb(-1);
    });

    req.end();
};


const post = (params, data = {}, cb) => {

    let options = {
        host: params.host,
        path: params.path,
        port: params.port || 80,
        method: 'POST',
        headers: params.headers || {}
    };

    if (typeof data === 'object') {
        data = JSON.stringify(data);
        options.headers['Content-Type'] = 'application/json';
    }

    //console.log(options);
    let req = PROTOCOL[params.protocol || 'http'].request(options, (res) => {
        //res.setEncoding('utf8');
        let body = '';
        res.on('data', (chunk) => {
            body += chunk;
        });
        res.on('end', () => {
            if (params.noParse) {
                return cb(0, body);
            }

            try {
                //console.log(body);
                let json = JSON.parse(body);
                return cb(0, json);
            } catch (e) {
                console.error(e);
                return cb(-1);
            }
        });
    });

    req.on('error', (err) => {
        console.error(err);
        return cb(-1);
    });

    data && (req.write(data));
    req.end();
};

module.exports = {
    get,
    post
};