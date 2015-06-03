'use strict';

app.controller('ChatMsgController', function ($scope, $state) {

    var myDataRef = new Firebase('https://fiery-torch-3361.firebaseio.com');
    console.log("myDataRef", myDataRef);

	// var obj = $firebase(myDataRef).$asObject(); // obj returned from Firebase
	// obj.$bindTo($scope, "data"); // bind to scope as scope.data
	$scope.data = obj;
	console.log("scope data: ", $scope.data);
    // $scope = {};
    // $scope.error = null;

    $scope.getMessages = function () {
    };

});