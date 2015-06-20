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

	$scope.goToChat = function(chat) {
		console.log("CHAT ID", chat.id);
		$state.go('tab.chat-detail', { chatId: chat.id });
	};

	$scope.remove = function(chat) {
		Chats.remove(chat);
	};
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
	// get chat
	$scope.messages = Chats.get($stateParams.chatId);

	
	// // $scope.messages

	// console.log("input field", $scope.input);
	// console.log("liveTranslate view", $scope.liveTranslateView);
	// // on user input, translate text
	// $scope.$watch('input', function(oldText, newText) {

	// 	Chats.translateWhileTyping(newText, $scope.targetLanguage)
	// 		.then(function(translatedText) {
	// 			$scope.liveTranslateView = translatedText; // show live view
	// 		})
	// 		.catch(function(err) {
	// 			console.log(err.message);
	// 		});
	// });

	// $scope.submitMessage = Chats.submitMessage()

	// .then(function() {
	// 	// calling $add on a synchronized array is like Array.push(),
	// 			// except that it saves the changes to our Firebase database!
	// 	$scope.messages.$add({
	// 		from: $scope.user,
	// 		content: $scope.input,
	// 		translatedContent: $scope.liveTranslateView
	// 	});
	// })

	// .then(function() {
	// 	$scope.input = ""; // clear the input field
	// });


})

.controller('AccountCtrl', function($scope) {
	$scope.settings = {
		enableFriends: true
	};
});
