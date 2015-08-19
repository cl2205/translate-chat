//Synchronous XMLHttpRequest on the main thread is deprecated because of its detrimental effects to the end user's experience. For more help, check http://xhr.spec.whatwg.org/.
// when I try to send a message from app and there are already previous messages add, doesn't treat $scope.messages as an array. Is it because of how I set my data?

// where there is already a message I added to scope.messages, and then i try to add another message, won't work. because it says I can't push on an object.
// the controller won't update when I hit the back button.
angular.module('translate.controllers', [])

.controller('LoginCtrl', function($scope) {

	$scope.signIn = function() {
		$state.go('tab.chats');
	};

})

.controller('DashCtrl', function($scope) {
	
})

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
	$scope.targetLanguage;

	$scope.$watchCollection('chats', function(newChats, oldChats) {

		$scope.chats = newChats; // show live view

	});

	Chats.all($scope.loggedInUser).then(function(chatList) {

		chatList.forEach(function(chat) {
			chat.members = _.filter(chat.members, function(member) {
				return member !== $scope.loggedInUser;
			})
		});

		return chatList;

	}).then(function(chatList) {

		chatList = Promise.all(chatList.map(function(chat) {

			return Chats.getLastTextOfChat(chat.id).then(function(lastText) {

				if (lastText) {
					// chat.lastText = lastText.content;
					chat.lastText = lastText;
	
					return chat;
				} else {
					chat.lastText = "no messages available.";
					return chat;
				}
			})
		}));

		return chatList;
	}).then(function(arrayOfChats) {
		$scope.chats = arrayOfChats; 
	});	


	$scope.remove = function(chat) {
		Chats.remove(chat);
	};
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats, $ionicModal) {
	$scope.loggedInUser = "John";
	
	Chats.getOtherUser($stateParams.chatId, $scope.loggedInUser).then(function(user) {
		$scope.otherUser = user;
	});
	// get chat
	Chats.get($stateParams.chatId).then(function(messages){
		
		$scope.messages = messages;
		
	});

	var messagesRef = refFp.child('messages/' + $stateParams.chatId);

	messagesRef.on("child_added", function(snapshot, prevChildKey) {
		var newMessage = snapshot.val();
	
		if ($scope.messages) {
			$scope.messages.push(newMessage);
			_.defer(function(){
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

	$scope.setLanguage = function(languageCode) {

		$scope.targetLanguage = languageCode;// selected language from select
		$scope.closeModal();
    };

	$ionicModal.fromTemplateUrl('templates/language-select.html', {
	    scope: $scope,
	    animation: 'slide-in-up'
	  }).then(function(modal) {
	    $scope.modal = modal;
	  });
	  $scope.openModal = function() {
	    $scope.modal.show();
	    // get supported languages list
    	Chats.getLanguages()
		.then(function(languageList) {
			$scope.list = languageList;	// array of objects { language: zh-CN, name: Chinese }
		});
	  };
	  $scope.closeModal = function() {
	    $scope.modal.hide();
	  };
	  //Cleanup the modal when we're done with it!
	  $scope.$on('$destroy', function() {
	    $scope.modal.remove();
	  });
	  // Execute action on hide modal
	  $scope.$on('modal.hidden', function() {
	    // Execute action
	  });
	  // Execute action on remove modal
	  $scope.$on('modal.removed', function() {
	    // Execute action
	  });

})

.controller('LanguageCtrl', function($scope, $ionicSideMenuDelegate) {
	$scope.toggleLeft = function() {
		$ionicSideMenuDelegate.toggleLeft();
    };
})

.controller('AccountCtrl', function($scope, $ionicModal, Chats) {
	$scope.loggedInUser = "John";

	$scope.settings = {
		enableFriends: true
	};

	$ionicModal.fromTemplateUrl('templates/language-select.html', {
	    scope: $scope,
	    animation: 'slide-in-up'
	  }).then(function(modal) {
	    $scope.modal = modal;
	  });

	  $scope.openModal = function() {
	    $scope.modal.show();
	    // get supported languages list
    	Chats.getLanguages()
		.then(function(languageList) {
			$scope.list = languageList;	// array of objects { language: zh-CN, name: Chinese }
		});
	  };

	  $scope.closeModal = function() {
	    $scope.modal.hide();
	  };

	  // set source language
	  $scope.setLanguage = function(languageCode) {
		$scope.sourceLanguage = languageCode;// selected language from select
	
		Chats.setSourceLanguage($scope.loggedInUser, languageCode)
		.then(function() {
			$scope.closeModal();
		}).catch(function(err) {
			console.log(err);
		})
		
    };

});
