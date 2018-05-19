
'use strict';

const request = require('./request');
const AK ='HHorthnoGTpyqXm1sradORkIUcqs3v2w';

const getXY = (input, cb) => {
    const params = {
        host: 'api.map.baidu.com',
        path: `/geocoder/v2/?address=${encodeURIComponent(input.addr)}&output=json&ak=${AK}`
    };

    request.get(params, (err, res = {}) => {
        if (err || res.status !== 0) {
            console.error(err, res);
            return cb(err);
        }

        console.log(res);

        return cb(0, {
            lat: res.result.location.lat,
            lng: res.result.location.lng
        });
    });
};

const getLocation = (input, cb) => {
    const params = {
        host: 'api.map.baidu.com',
        path: `/geocoder/v2/?location=${input.lat},${input.lng}&output=json&pois=1&ak=${AK}`
    };

    console.log(params.path);

    request.get(params, (err, res = {}) => {
        if (err || res.status !== 0) {
            console.error(err, res);
            return cb(err);
        }

        // console.log(res);

        const addr = res.result.addressComponent;
        const ret = {
            country     : addr.country,
            province    : addr.province,
            city        : addr.city,
            district    : addr.district,
        };

        return cb(0, ret)
    });
};



const getInfo = (input, cb) => {
    getXY(input, (err, data = {}) => {
        if (err) {
            return cb(err);
        }

        return getLocation(data, (err, data2 = {}) => {
            if (err) {
                return cb(err);
            }

            data2.identify = input.identify;
            data2.lng = data.lng;
            data2.lat = data.lat;
            return cb(0, data2);
        });
    });
};

getInfo({addr: '上海市张江高科技园区张东路1387号'}, (err, data) => {
    console.log(JSON.stringify(data));
});


module.exports = {
    getXY,
    getLocation,
    getInfo
};