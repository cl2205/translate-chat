'use strict';
var path = require('path');
var express = require('express');
var app = express();
var _ = require('lodash');
module.exports = app;

// Pass our express application pipeline into the configuration
// function located at server/app/configure/index.js
// require('./routes')(app);
require('./configure')(app);


var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
 
    next();
};

app.use(allowCrossDomain);

// Routes that will be accessed via AJAX should be prepended with
// /api so they are isolated from our GET /* wildcard.
app.use('/api', require('./routes'));


/*
    This middleware will catch any URLs resembling a file extension
    for example: .js, .html, .css
    This allows for proper 404s instead of the wildcard '/*' catching
    URLs that bypass express.static because the given file does not exist.
*/
app.use(function (req, res, next) {

    if (path.extname(req.path).length > 0) {
        res.status(404).end();
    } else {
        next(null);
    }

});

app.get('/*', function (req, res) {
    res.sendFile(app.get('indexHTMLPath'));
});


// console.log("APP ROUTER STACK LENGTH", JSON.stringify(app._router.stack.length));
// console.log("FLATTENED", _.flatten(app._router.stack));
// console.log("APP._ROUTER.STACK:");
require('./document')(app._router.stack, 'express');


// Error catching endware.
app.use(function (err, req, res) {
    // console.error(err);
    res.status(err.status || 500).send(err.message || 'Internal server error.');
});
