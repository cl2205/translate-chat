'use strict';
var router = require('express').Router();
var mongoose = require('mongoose');
var User = mongoose.model('User');
module.exports = router;
var _ = require('lodash');
var requestPromise = require('request-promise');
var app = require('../../index');   // doing a fs read File
var apiKey = app.getValue('env').TRANSLATE.apiKey;


var ensureAuthenticated = function (req, res, next) {
    if (req.isAuthenticated()) {
        next();
    } else {
        res.status(401).end();
    }
};

// router.post('/login', function (req, res, next) {
//     User.findOne({ email: req.body.email }).exec().then(function (user) {
//         if (!user) throw new Error('not found');
//         else if (!user.authenticate(req.body.password)) console.log("Invalid credentials");
//         else req.session.userId = user._id;
//         return req.session;
//     });
// });

