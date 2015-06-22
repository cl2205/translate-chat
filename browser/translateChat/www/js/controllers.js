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
		console.log("updating chats");
		console.log("newChats", newChats);
		console.log("oldChats", oldChats);
		// newChats[newChats.length-1]
			$scope.chats = newChats; // show live view

	});
		var ref = new Firebase("https://fiery-torch-3361.firebaseio.com");
		// var chatsRef = refFp.child('/chats');
		var messagesRef = ref.child('/messages');

		messagesRef.on('child_added', function(snapshot, prevChildKey) {
			var newMessage = snapshot.val();
			// var newMessageId = snapshot.key();
			console.log("new Message", newMessage);
			var newMessageId = _.pluck(newMessage, 'chatId')
			var newMessageContent = _.pluck(newMessage, 'content').toString();
			console.log("plucked msg id", newMessageId);
	
		
			var chatRef = ref.child('/chats/' + newMessageId);
			chatRef.once('value', function(data) {
					console.log("data value", data.val());
					var newChat = data.val();
					console.log("newChat", newChat);
					var recipient = getRecipient(newChat.members);
					newChat.members = recipient;
					newChat.lastText = newMessageContent;
				console.log("newchat content", newChat.lastText);
				if ($scope.chats) {
					$scope.chats.push(newChat);	// push new chat with recipient
					console.log("$scope.chats after adding new chat", $scope.chats);
					_.defer(function(){
						console.log("apply called");
						$scope.$apply();
					})
				}
			})
			
			// // var messageRef = refFp.child('/messages/' + newChatId);

			// var messageRef = ref.child('/messages/' + newChatId);
			// // var messageRef = ref.child('/messages/' + '-JsR_7mj-e6TmFGX-TFE');
			// console.log("MessageRef.then", messageRef.then);

			// messageRef.once('value', function(snapshot) {
			// 	console.log("snapshot", snapshot.val());
			// })
			// messageRef.then(function(snapshot) {
			// 	console.log("msg snapshot", snapshot.val());
			// 	newChat.lastText = snapshot.val().content;
			// 	console.log("newchat content", newChat.lastText);
			// 	if ($scope.chats) {
			// 		$scope.chats.push(newChat);	// push new chat with recipient
			// 		console.log("$scope.chats after adding new chat", $scope.chats);
			// 		_.defer(function(){
			// 			console.log("apply called");
			// 			$scope.$apply();
			// 		})
			// 	}
			// })
		})

			// .catch(function(err) {
			// 	console.log("couldn't find message ref", err);
			// })
			// newChat.lastText = newChat.content;
			// });

	// get all chats with recipients

	function getRecipient(membersArr) {
		var recipient = _.filter(membersArr, function(member) {
				return member !== $scope.loggedInUser;
		});
		recipient = recipient.toString();
		return recipient;
	}



	Chats.all($scope.loggedInUser).then(function(chatList) {
		console.log("getting all chats. for John...");
		console.log("chatlist", chatList);

		chatList.forEach(function(chat) {
			chat.members = _.filter(chat.members, function(member) {
				return member !== $scope.loggedInUser;
			})
			chat.members = chat.members.toString();
		});

		return chatList;

	}).then(function(chatList) {	// get last texts of each Chat
		var chatsRef = refFp.child('/chats');

		chatList = Promise.all(chatList.map(function(chat) {
			return chatsRef.then(function(snap) {
				var chats = snap.val();
				console.log("otherUser", chat.members);
				console.log("user", $scope.loggedInUser);
				var chatId = _.findKey(chats, { 'members': [ chat.members, $scope.loggedInUser ] } );
				console.log("found chatID, chatID", chatId);
				return Chats.getLastTextOfChat(chatId).then(function(lastText) {
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
			})

		}));
		
		return chatList;

		// // _.findKey(chatList, { 'members': [ $scope.loggedInUser, chat ]})

		// chatList = Promise.all(chatList.map(function(chat) {
		// 	console.log("full chat object", chat);
		// 	// console.log("chatid by name()", chat.name());
		// 	// var chatId = _.findKey(chat, { 'phoneNumber' : +req.body.From });
		// 	// console.log("chatid by key()", chat.key());
		// 	// var chatRef = refFp.child('/chats/' + )
		// 	// var chatId = chat.key();

		// 	return Chats.getLastTextOfChat(chatId).then(function(lastText) {
		// 		console.log("getting last text..");
		// 		if (lastText) {
		// 			// chat.lastText = lastText.content;
		// 			chat.lastText = lastText;
		// 			console.log("chat", chat.lastText);
		// 			return chat;
		// 		} else {
		// 			chat.lastText = "no messages available.";
		// 			return chat;
		// 		}
		// 	})
		// }));

		// return chatList;
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

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats, $ionicModal) {
	$scope.loggedInUser = "John";
	
	Chats.getOtherUser($stateParams.chatId, $scope.loggedInUser).then(function(user) {
		$scope.otherUser = user;
		console.log("set scope.otherUser", $scope.otherUser);
	});
	// get chat
	Chats.get($stateParams.chatId).then(function(messages){
		console.log("messages received are array", messages);
		// $scope.messages.push(messages);
		$scope.messages = messages;
		// $scope.messages = messages || [];	// messages becomes an object
		console.log("got scope.messages", $scope.messages);
	});

	var messagesRef = refFp.child('messages/' + $stateParams.chatId);

	messagesRef.on("child_added", function(snapshot, prevChildKey) {
		var newMessage = snapshot.val();
		console.log("newMessage: ", newMessage);
		// if (!Array.isArray($scope.messages)
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

	$scope.setLanguage = function(languageCode) {
		console.log("set language called");
		$scope.targetLanguage = languageCode;// selected language from select
		console.log("$scope targetLanguage", $scope.targetLanguage);
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
	  	console.log("open modal");
	    $scope.modal.show();
	    console.log("open modal");
	    // get supported languages list
    	Chats.getLanguages()
		.then(function(languageList) {
			console.log("got language list");
			$scope.list = languageList;	// array of objects { language: zh-CN, name: Chinese }
		});
	  };

	  $scope.closeModal = function() {
	    $scope.modal.hide();
	  };

	  // set source language
	  $scope.setLanguage = function(languageCode) {
		console.log("set language called");
		console.log("logged in user", $scope.loggedInUser);
		$scope.sourceLanguage = languageCode;// selected language from select
		console.log("$scope sourceLanguage", $scope.sourceLanguage);
		Chats.setSourceLanguage($scope.loggedInUser, languageCode)
		.then(function() {
			console.log("source language updated");
			$scope.closeModal();
		}).catch(function(err) {
			console.log(err);
		})
		
    };

});
