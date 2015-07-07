
var topLevelRouteStack = app._router.stack;

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
            var parentPath = "/" + e.regexp.toString().slice(0, -1).match(/\w+/ig).join("/")
            console.log("pName", parentName);
            var route = {};
            route[parentName] = [];


            // allRoutes.push({path: parentName, method: "router"})
            var subRouterStack = e.handle.stack; // if route is in the handle's stack, retrieve those routes
            allRoutes.push(route);
    
            route[parentName].concat(retrieveRoutes(subRouterStack, parentName));

        } else {
            console.log("missed a case");
        }

    })

    // console.log("ALL ROUTES", allRoutes);
    return allRoutes
}



// var topLevelRouteStack = app._router.stack;

//     function retrieveRoutes (topLevelRouteStack) {
//         var allRoutes = [];

//         var routesArray = topLevelRouteStack.filter(function(stack){    // filter out middleware
//             return stack.route || stack.handle.stack;
//         });

//         routesArray.forEach(function(e){

//             if (e.route){
                
//                 var route = { path: e.route.path, method: e.route.stack.method };
//                 allRoutes.push(route);

//             } else if (e.handle.stack) {    // if subrouter exists
//                 //console.log(e.handle.stack);
//                 var subRouterStack = e.handle.stack; // if route is in the handle's stack, retrieve those routes
//                 allRoutes = allRoutes.concat(retrieveRoutes(subRouterStack));
    
//             } else {
//                 console.log("missed a case");
//             }

//         }

//         console.log("ALL ROUTES", allRoutes);
//         return allRoutes;
//     }



    