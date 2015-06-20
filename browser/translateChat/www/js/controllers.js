angular.module('translate.controllers', [])

.controller('LoginCtrl', function($scope) {

	console.log('Login Controller initialized');

	$scope.signIn = function() {
		$state.go('tab.chats');
	};

})

.controller('DashCtrl', function($scope) {})

.controller('ChatsCtrl', function($scope, Chats, $rootScope, $firebaseArray) {
	// With the new view caching in Ionic, Controllers are only called
	// when they are recreated or on app start, instead of every page change.
	// To listen for when this page is active (for example, to refresh data),
	// listen for the $ionicView.enter event:
	//
	$scope.$on('$ionicView.enter', function(e) {
	});

	var ref = new Firebase("https://fiery-torch-3361.firebaseio.com");
	  chatsRef = ref.child('chats');
	  usersRef = ref.child('users');
	  messagesRef = ref.child('messages');

	var users = {

	    "John": { source_language: "en", contacts: { Obama: true, Fullstack: true, Kelly: true }, chats: [ "chat1", "chat2", "chat3" ], phoneNumber: 9172542078 },
	    "Obama": { source_language: "en", contacts: { John: true, Fullstack: true, Kelly: true }, chats: { chat2: true, chat4: true }, phoneNumber: 9172542078 },
	    "Fullstack": { source_language: "fr", contacts: { John: true, Obama: true, Kelly: true }, chats: { chat3: true, chat4: true }, phoneNumber: 9172542078 },
	    "Kelly": { source_language: "zh-TW", contacts: { John: true, Obama: true, Kelly: true }, chats: { chat1: true } }
	};

	var chats = {
	    "chat1": { id: 1, members: [ "John", "Kelly"], lastText: "Where are you?"},
	    "chat2": { id: 2, members: [ "John", "Obama" ], lastText: "I'm so pumped!!!" },
	    "chat3": { id: 3, members: [ "John", "Fullstack"], lastText: "I have big news for you..." },
	    "chat4": { id: 4, members: ["Fullstack", "Obama"], lastText: "I have a big news..." }
	};


	usersRef.set(users);  
	chatsRef.set(chats);

	$scope.loggedInUser = "John";
	$scope.targetLanguage = "zh-TW";
	// $scope.chats = Chats.all($scope.loggedInUser);


	// $scope.all = function(user) {
	//       var chatList = ref.child('chats');
	//       var userChats;
	//       chatList.once('value', function(snapshot) {
	//         var chatSnapshot = snapshot.val();
	//         console.log("snapshot", chatSnapshot);
	//         usersChats = _.where(chatSnapshot, { members: { john: true } });
	//         console.log("usersChats", usersChats);
	//         $scope.chats = userChats;
	//       });
	      
	// 	};

	// var johnsChats = ref.child('users/' + $scope.loggedInUser + '/chats' )
	$scope.chatList = [];

	// _.pluck(_.where(usersChats, { 'john': 36, 'active': false }), 'user');
	// var usersChats = $firebaseArray(ref.child('users/' + $scope.loggedInUser + '/chats'));
	// console.log("usersChats", usersChats);
	// console.log("foreach");
	// usersChats.forEach(function(chatId) {
	// 	console.log("chatId", chatId);
	// 	var members = $firebaseArray(ref.child('chats/' + chatId + '/members'));
	// 	members.forEach(function(member) {
	// 		console.log("member", member);
	// 		if (member !== $scope.loggedInUser) {

	// 			$scope.chattingWith = member;
	// 			console.log("scope.chattingiwth", $scope.chattingWith);
	// 		}
	// 	});
	// });
	var usersChats = ref.child('/users/' + $scope.loggedInUser + '/chats');

    usersChats.once('value', function(chatId_snapshot) {	// array of chatIds
    	var chatIdArray = chatId_snapshot.val();
  
    	chatIdArray.forEach(function(chatId) { // for each chatId
    		var otherUser;
    		$scope.chat = ref.child('chats/' + chatId);

    		var oneChat = ref.child('/chats/' + chatId);
    		oneChat.once('value', function(snap) {
    			console.log("snapval", snap.val());
    			var oneChatObj = snap.val();
    			oneChatObj.lastText
    			oneChatObj.members.forEach(function(member) {
    				if (member !== $scope.loggedInUser) {
    					otherUser = member;
    				}
    			})
    			$scope.chatList.push({ chattingWith: otherUser, lastText: oneChatObj.lastText});
    		});

    		// var chats = ref.child('chats/' + chatId + '/members'); // check that chat's members
    		// chats.once('value', function(members_snap) { // array of members
    		// 	var members = members_snap.val();
    	
    		// 	members.forEach(function(member) {	// for each member
    				
    		// 		if (member !== $scope.loggedInUser) {
    					
    		// 			$scope.chatList.push(member);
    				
    		// 		};

    		// 	});
    		// })
    	})
    })

	// chatList.once('value', function(snapshot) {
 //        var chatSnapshot = snapshot.val();	// array of chats

 //        })

 //        if (snapshot.val() !== null) {
 //        	usersChats.push()
 //        }

 //        if ()
 //        console.log("snapshot", chatSnapshot);
 //        usersChats = _.where(chatSnapshot, { members: { john: true } });
 //        console.log("usersChats", usersChats);
	  
	//     $scope.chats = usersChats;


	//     for (var i = 0; i <  usersChats.length; i++) {
	//     	var keys = _.keys(usersChats[i].members); // get keys of each chat's members object
	//     	var recipient = _.remove(keys, function(name) {
 //        		return name !== "john";
 //        	});
	//     	console.log("recipient", recipient);
 //        	$scope.recipient = recipient;
	//     }
        	
        // $scope.recipient = recipient;
        
       

	// });

	// $scope.all($scope.loggedInUser);
	// console.log("SCOPE.CHATS", $scope.chats);

	$scope.remove = function(chat) {
		Chats.remove(chat);
	};
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
	// get chat
	$scope.chat = Chats.get($stateParams.chatId);
	
	// $scope.messages

	console.log("input field", $scope.input);
	console.log("liveTranslate view", $scope.liveTranslateView);
	// on user input, translate text
	$scope.$watch('input', function(oldText, newText) {

		Chats.translateWhileTyping(newText, $scope.targetLanguage)
			.then(function(translatedText) {
				$scope.liveTranslateView = translatedText; // show live view
			})
			.catch(function(err) {
				console.log(err.message);
			});
	});

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
