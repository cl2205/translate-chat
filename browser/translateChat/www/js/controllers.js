//Synchronous XMLHttpRequest on the main thread is deprecated because of its detrimental effects to the end user's experience. For more help, check http://xhr.spec.whatwg.org/.

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
	$scope.loggedInUser = "John";
	
	Chats.getOtherUser($stateParams.chatId, $scope.loggedInUser).then(function(user) {
		$scope.otherUser = user;
	});
	// get chat
	Chats.get($stateParams.chatId).then(function(messages){
		$scope.messages = messages || [];
		// console.log("scope messages", $scope.messages);
	});

	var messagesRef = refFp.child('messages/' + $stateParams.chatId);

	messagesRef.on("child_added", function(snapshot, prevChildKey) {
		var newMessage = snapshot.val();
		// console.log("newMessage: ", newMessage);
		if ($scope.messages) {
			$scope.messages.push(newMessage);	// SUPER LAGGED - 10 mins?
			_.defer(function(){
				$scope.$apply();
			});
		}
	});

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
		// console.log("chattingwithuser", $scope.otherUser);
		$scope.loggedInUser = "John";
		var message = {
			content: $scope.input,
			from: $scope.loggedInUser,
			to: $scope.otherUser,
			translated: $scope.liveTranslateView
		};

		Chats.sendMessage(message, $stateParams.chatId)
		.then(function() {
			$scope.input = "";
			$scope.liveTranslateView = "";
		});
	};
})

.controller('AccountCtrl', function($scope) {
	$scope.settings = {
		enableFriends: true
	};
});
