angular.module('translate.controllers', [])

.controller('LoginCtrl', function($scope) {

	console.log('Login Controller initialized');

	$scope.signIn = function() {
		$state.go('tab.chats');
	};

})

.controller('DashCtrl', function($scope) {})

.controller('ChatsCtrl', function($scope, Chats, $rootScope, $firebaseArray, $stateParams, $state) {
	// With the new view caching in Ionic, Controllers are only called
	// when they are recreated or on app start, instead of every page change.
	// To listen for when this page is active (for example, to refresh data),
	// listen for the $ionicView.enter event:
	//
	$scope.$on('$ionicView.enter', function(e) {
	});

	$scope.loggedInUser = "John";
	$scope.targetLanguage = "zh-TW";


	Chats.all($scope.loggedInUser).then(function(chatList) {
	
		chatList.forEach(function(chat) {
			chat.members = _.filter(chat.members, function(member) {
				return member !== $scope.loggedInUser;
			})
		});

		$scope.chats = chatList; 

	});

	$scope.remove = function(chat) {
		Chats.remove(chat);
	};
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats, $firebaseArray) {

	// get chat
	Chats.get($stateParams.chatId).then(function(messages){
		$scope.messages = messages;
		console.log("scope messages", $scope.messages);
	});

	var messagesRef = refFp.child('messages/' + $stateParams.chatId);

	messagesRef.on("child_added", function(snapshot, prevChildKey) {
		var newMessage = snapshot.val();
		console.log("newMessage: ", newMessage);
		if ($scope.messages) {
			$scope.messages.push(newMessage);
		}
	})
	// $scope.$watch("messages", function() {

	// })

	console.log("input field", $scope.input);
	console.log("liveTranslate view", $scope.liveTranslateView);
	// on user input, translate text
	$scope.$watch('input', function(oldText, newText) {

		if (oldText) {
			Chats.translateWhileTyping(newText, $scope.targetLanguage)
			.then(function(translatedText) {
				$scope.liveTranslateView = translatedText; // show live view
			})
			.catch(function(err) {
				console.log(err.message);
			});
		}
	});

	$scope.submitMessage = function() {
		$scope.loggedInUser = "John";
		// calling $add on a synchronized array is like Array.push(),
				// except that it saves the changes to our Firebase database!
		var messagesRef = refFp.child('messages/' + $stateParams.chatId);
		messagesRef.push({
			content: $scope.input,
			from: $scope.loggedInUser,
			translated: $scope.liveTranslateView
		})
		.then(function() {
			$scope.input = "";
			$scope.liveTranslateView = "";
		});

		// $scope.messages.push({
		// 	from: $scope.loggedInUser,
		// 	content: $scope.input,
		// 	translatedContent: $scope.liveTranslateView
		// });

		// $scope.messages.$add({
		// 	from: $scope.loggedInUser,
		// 	content: $scope.input,
		// 	translatedContent: $scope.liveTranslateView
		// })
		// .then(function() {
		// 	$scope.input = ""; // clear the input field
		// });
	};
})

.controller('AccountCtrl', function($scope) {
	$scope.settings = {
		enableFriends: true
	};
});
