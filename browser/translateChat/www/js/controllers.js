//Synchronous XMLHttpRequest on the main thread is deprecated because of its detrimental effects to the end user's experience. For more help, check http://xhr.spec.whatwg.org/.
// when I try to send a message from app and there are already previous messages add, doesn't treat $scope.messages as an array. Is it because of how I set my data?

// where there is already a message I added to scope.messages, and then i try to add another message, won't work. because it says I can't push on an object.
// the controller won't update when I hit the back button.
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
		console.log("this page is active");
	});

	$scope.loggedInUser = "John";
	$scope.targetLanguage = "zh-TW";

	$scope.$watchCollection('chats', function(newChats, oldChats) {
		console.log("updating chats");
		console.log("newChats", newChats);
		console.log("oldChats", oldChats);
			$scope.chats = newChats; // show live view

	});

	Chats.all($scope.loggedInUser).then(function(chatList) {
		console.log("getting all chats..");
		chatList.forEach(function(chat) {
			chat.members = _.filter(chat.members, function(member) {
				return member !== $scope.loggedInUser;
			})
		});

		return chatList;

	}).then(function(chatList) {

		chatList = Promise.all(chatList.map(function(chat) {
			console.log("chatid", chat.id);
			return Chats.getLastTextOfChat(chat.id).then(function(lastText) {
				console.log("getting last text..");
				if (lastText) {
					// chat.lastText = lastText.content;
					chat.lastText = lastText;
					console.log("chat", chat.lastText);
					return chat;
				} else {
					chat.lastText = "no messages available.";
					return chat;
				}
			})
		}));

		return chatList;
	}).then(function(arrayOfChats) {
		console.log("arrayOfChats", arrayOfChats);
		$scope.chats = arrayOfChats; 
		console.log("modified chats to show on scope", $scope.chats);
	});	

		// console.log("modified chatlist", chatList);
		// $scope.chats = chatList; 



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
		console.log("messages received are array", messages);
		// $scope.messages.push(messages);
		$scope.messages = messages;
		// $scope.messages = messages || [];	// messages becomes an object
		console.log("got scope.messages", $scope.messages);
	});


// scope not updating, only sometimes
// 	FIREBASE WARNING: Exception was thrown by user callback. TypeError: $scope.messages.push is not a function
//     at http://localhost:1337/js/controllers.js:79:20
//     at Fireproof.on.callbackHandler (http://localhost:1337/fireproof/dist/fireproof.js:1502:5)
//     at h.Ub (https://cdn.firebase.com/js/client/2.2.7/firebase.js:51:375)
//     at Cb (https://cdn.firebase.com/js/client/2.2.7/firebase.js:46:165)
//     at yb (https://cdn.firebase.com/js/client/2.2.7/firebase.js:22:216)
//     at zb (https://cdn.firebase.com/js/client/2.2.7/firebase.js:21:1259)
//     at Nh.h.Kb (https://cdn.firebase.com/js/client/2.2.7/firebase.js:204:440)
//     at U.set (https://cdn.firebase.com/js/client/2.2.7/firebase.js:244:165)
//     at U.push (https://cdn.firebase.com/js/client/2.2.7/firebase.js:250:236)
//     at Fireproof.push (http://localhost:1337/fireproof/dist/fireproof.js:2220:15) 
// firebase.js:46 Uncaught TypeError: $scope.messages.push is not a function

	var messagesRef = refFp.child('messages/' + $stateParams.chatId);

	messagesRef.on("child_added", function(snapshot, prevChildKey) {
		var newMessage = snapshot.val();
		console.log("newMessage: ", newMessage);
		console.log("$scope.messages is an array", Array.isArray($scope.messages), $scope.messages);
		if ($scope.messages) {
			$scope.messages.push(newMessage);
			console.log("pushed");
			_.defer(function(){
				console.log("apply called");
				$scope.$apply();
			});
		}
	});

	// on user input, translate text
	$scope.$watch('input', function(newText, oldText) {

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
