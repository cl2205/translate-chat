'use strict';
var chalk = require('chalk');
 

// Requires in ./db/index.js -- which returns a promise that represents
// mongoose establishing a connection to a MongoDB database.
var startDb = require('./db');

// Create a node server instance! cOoL!
var server = require('http').createServer();

var createApplication = function () {
    var app = require('./app');
    server.on('request', app); // Attach the Express application.

    

function generateRouteTree(app) {
    var topLevelRouteStack = app._router.stack;
    return retrieveRoutes(topLevelRouteStack);
}

 function retrieveRoutes (topLevelRouteStack, parentPath) {
    // var topLevelRouteStack = app._route.stack;
    var allRoutes = [];
    var pPath = ""
    if(parentPath) pPath = parentPath

    var routesArray = topLevelRouteStack.filter(function(stack){    // filter out middleware
        return stack.route || stack.handle.stack;
    });

    routesArray.forEach(function(e){

        if (e.route){   // if no subrouter, just direct route
        
            // console.log("ROUTE PATH:", e.route.path, "ROUTE STACK", e.route.stack, "ROUTE STACK[0] METHOD", e.route.stack[0].method);
            var route = { path: pPath + e.route.path, method: e.route.stack[0].method };
            allRoutes.push(route);

        } else if (e.handle.stack) {    // if subrouter exists
            //console.log(e.handle.stack);
            //{path: grab pathname from the regex exp, method: router}
            // test/api

            var parentName = e.regexp.toString().slice(0, -1).match(/\w+/ig).join("/");
            var parentPath = pPath + "/" + e.regexp.toString().slice(0, -1).match(/\w+/ig).join("/");
            console.log("pName", parentName);
            var route = {};
            route[parentName] = [];


            // allRoutes.push({path: parentName, method: "router"})
            var subRouterStack = e.handle.stack; // if route is in the handle's stack, retrieve those routes
            
            
            route[parentName] = retrieveRoutes(subRouterStack, parentPath);
            // console.log("SUBROUTES", subRoutes);
            // allRoutes.push(subRoutes)
            allRoutes.push(route);
        } else {
            console.log("missed a case");
        }

    })

    return allRoutes
}

    var routeTree = generateRouteTree(app); 
    console.log("routeTree", routeTree);
    console.log("subroutes", routeTree[3]);
    console.log("subroutes-object", routeTree[3].api[0]);

};

var startServer = function () {

    var PORT = process.env.PORT || 1337;


    server.listen(PORT, function () {
    	var app = require('./app');
        console.log(chalk.blue('Server started on port', chalk.magenta(PORT)));
        // require('./app/document')(app._router.stack, 'express');
    });

};

startDb.then(createApplication).then(startServer).catch(function (err) {
    console.error('Initialization error:', chalk.red(err.message));
    console.error('Process terminating . . .');
    process.kill(1);
});