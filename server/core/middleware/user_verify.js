/**
 * Created by pengfeixiang on 18/2/3.
 */

'use strict';

module.exports = (req, res, next) => {
    if (!req.session.uid) {
        return res.json({errCode: ERROR.NOT_LOGIN});
        //return res.redirect(`/login.html?from=${encodeURIComponent(req.originalUrl)}`);
    }

    req.longma = req.longma || {};
    req.longma.uid = req.session.uid;

    return next();
};


