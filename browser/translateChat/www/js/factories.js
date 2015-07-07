angular.module('translate.factories', [])

// .factory('Auth', function ($firebaseAuth, $rootScope) {
//   //set global variable reference to our Firebase on $rootScope to make it available to every $scope 
//   var ref = new Firebase("https://fiery-torch-3361.firebaseio.com");
//   console.log("ref", ref);
//   return $firebaseAuth(ref);
// })

.factory('Chats', function ($rootScope, $http, $q) {
	var users = {

	    "John": { source_language: "en", contacts: { Obama: true, Fullstack: true, Kelly: true }, chats: [ "chat1", "chat2", "chat3" ], phoneNumber: +16467831204 },
	    "Kelly": { source_language: "zh-TW", contacts: { John: true, Obama: true, Fullstack: true }, chats: { chat1: true }, phoneNumber: +13236329813 },
	    "Obama": { source_language: "en", contacts: { John: true, Fullstack: true, Kelly: true }, chats: { chat2: true, chat4: true } },
	    "Fullstack": { source_language: "fr", contacts: { John: true, Obama: true, Kelly: true }, chats: { chat3: true, chat4: true } }

	};

	var chats = {
	    "chat1": { id: "chat1", members: [ "John", "Kelly"] },
	    "chat2": { id: "chat2", members: [ "John", "Obama" ] },
	    "chat3": { id: "chat3", members: [ "John", "Fullstack"] },
	    "chat4": { id: "chat4", members: ["Fullstack", "Obama"] }
	};

	var messages = {
		"chat1": [ { from: "Kelly", content: "I'm hungry. Wanna grab a bite?", translated: "Je suis hungry. Wanna manger?"}, { from: "John", content: "Sure, let's go to McDonald's", translated: "Sure, let's mange"}],
		"chat2": [ { from: "John", content: "I'm bored.", translated: "Hola!"}, { from: "Obama", content: "Let's play some ball before I give the State of the Union tonight.", translated: "Gracias!"}],
		"chat3": [],
		"chat4": [],
	
	}


	var ref = new Firebase("https://fiery-torch-3361.firebaseio.com");
	refFp = new Fireproof(ref);
	Fireproof.bless($q);
	// refFp.remove();
	
	var messagesRefFb = ref.child('messages');
  	var chatsRefFb = ref.child('chats');
  	var usersRefFb = ref.child('users');
 //  	usersRefFb.set(users);
 //  	chatsRefFb.set(chats);
	// messagesRefFb.set(messages);
	// Might use a resource here that returns a JSON array
	// var chatList = $firebase(ref.child('chats')).$asArray();

	return {

		// getChatRefs: function(user) {
		// 	var usersChats = refFp.child('/users/' + user + '/chats');
		// 	return usersChats.then(function(chatList_snapshot) {  // array of chatIds
		// 		var chatIdArray = chatList_snapshot.val();
		// 		console.log("Chat refs array", chatIdArray);
		// 		return chatIdArray;
		// 	})
		// },

		all: function(user) {

		var usersChats = refFp.child('/users/' + user + '/chats');

		return usersChats.then(function(chatList_snapshot) {  // array of chatIds
				var chatIdArray = chatList_snapshot.val();
				console.log("Chat id array", chatIdArray);
				return chatIdArray;
			})

			.then(function(chatIdArray) {	// get reference (chatId) to eat chat in list
				var chatListRefs = chatIdArray.map(function(chatId) {
					var singleChatRef = refFp.child('/chats/' + chatId);
					singleChatRef.uid = chatId;
					console.log("singleChatRef", singleChatRef.uid);
					return singleChatRef;
				});
				return chatListRefs;
			})

			.then(function(chatListRefs) {	// get snapshot values of each chat and make that the chatlist to return
					var chatList = Promise.all(chatListRefs.map(function(singleChatRef) {
						return singleChatRef.then(function(singleChat_snap) {
							// console.log(singleChat_snap.val());
							return singleChat_snap.val();
						})
					}))
					// console.log("chatList", chatList);
					return chatList;
			})

			.then(function(chatList) {
				return chatList;
			})

		},

		getLastTextOfChat: function(chatId) {
			var messagesRef = refFp.child('/messages/' + chatId);
			return messagesRef.limitToLast(1).then(function(messages_snap) {
				console.log("last text snapshot", messages_snap.val());
		
				var lastText = messages_snap.val();
				if (!lastText) {
					console.log("if last text snap is undefined, should go here");
					return "No messages available.";
				} else {
					console.log("lasttext1", lastText["1"]);
					console.log("lasttext for 3rd", lastText[0]);
					var content = _.pluck(lastText, 'content').toString();
					console.log("will this work?", content);
					// return lastText["1"];
					return content;
				}
			})
		},


		get: function(chatId) { // get chat for 

			var messagesRef = refFp.child('messages/' + chatId);
      		// console.log("messagesRef", messagesRef);
			return messagesRef.limitToLast(5).then(function(messagesRef_snap) {
				var messages = messagesRef_snap.val();
				console.log("message snapshot in factory GET", messages);
				var messagesArray = _.values(messages);	// convert to array
        		// console.log("messages in fact", messages);
				return messagesArray;
			});
		  
		},

		// getMore: function(chatId) {

		// }

		sendMessage: function(message, chatId) {
			var messagesRef = refFp.child('messages/' + chatId);

			var newMessageRef = messagesRef.push(message);

			// create new msg, update with message ID
			var newMessageId = newMessageRef.key();
			var createdMsgRef = refFp.child('messages/' + newMessageId);
			createdMsgRef.update({ "id": newMessageId });
			console.log("saved sent Message, assigned new id");

			
			// find user, then get user's phone #
			var usersRef = refFp.child('users');
			return usersRef.then(function(users_snap) {
				var users = users_snap.val();
				console.log("user list", users);
				console.log("message.to", message.to);
				console.log("type of message.to", typeof message.to);
				message.to = Number(message.to);
				var foundUserId = _.pluck(_.where(users, { 'phoneNumber' : message.to }), 'id');
				// var foundUser = _.pluck(_.where(users, { 'phoneNumber': message.to }, );
				
				foundUserId = foundUserId.toString();
				console.log("found userId: ", foundUserId);
				var userRef = refFp.child('users/' + foundUserId);
				// var userRef = refFp.child('users/' + message.to);
				console.log("message.to", message.to);
				console.log("type of message.to", typeof message.to)

				// console.log("user snapshot", user_snap);
				return userRef.then(function(user_snap) {
					var recipient = user_snap.val();
					console.log("recipient to sent msg", recipient);
					return recipient.phoneNumber;
				})

				// send message (tranlate and send)

			}).then(function(recipientPhone) {
				// console.log('recipientPhone', recipientPhone);
				var messageData = {
					phone: recipientPhone,
					message: message.translated
				};

				return $http.post('/api/sms/sendmsg', messageData).then(function(sentMsg) {
				// console.log("sentMsg", sentMsg);
				});
			});
	
		},


		getOtherUser: function(chatId, user) {
			// console.log("user", user);
			var chatRef = refFp.child('chats/' + chatId);
			console.log("findnig other user");
			return chatRef.then(function(chatRef_snap) {
				var chat = chatRef_snap.val();
				// console.log("chat", chat);
				var otherUser = _.filter(chat.members, function(member) {
					return member !== user;
				});
				console.log("otherUser", otherUser);
				// console.log("otherUser", otherUser);
				otherUser = otherUser.toString();
				return otherUser;
			});
		},



		translateWhileTyping: function(text, targetLanguage) {
			var queryParams = {
				language: targetLanguage,
				text: text
			};
		
			return $http.get('/api/translate', {    // SERVER ROUTE
				params: queryParams
			})

			.then(function (response) {
					return response.data;
			});
		},

		getLanguages: function () {

            queryParams = {
                language: 'en'
            };

            return $http.get('/api/translate/languages', {
                params: queryParams
            })
            .then(function (response) {
                return response.data;
            });

        },

        setSourceLanguage: function(user, languageCode) {
        	console.log("user:", user);
        	console.log("languageCode", languageCode);
        	console.log("set source language");
        	var userRef = refFp.child('/users/' + user);

        	return userRef.update({
        		"source_language": languageCode
        	}).then(function() {
        		console.log("user with updated sourcelang");
        		return;
        	}).catch(function(err) {
        		console.log("Updated source language could not be saved: " + err);
        	})
        },

		remove: function(chat) {
			chats.splice(chats.indexOf(chat), 1);
		},


	};  // end object
})


	//   name: 'Ben Sparrow',
	//   lastText: 'You on your way?',
	//   face: 'https://pbs.twimg.com/profile_images/514549811765211136/9SgAuHeY.png'
	// }, {
	//   id: 1,
	//   name: 'Max Lynx',
	//   lastText: 'Hey, it\'s me',
	//   face: 'https://avatars3.githubusercontent.com/u/11214?v=3&s=460'
	// },{
	//   id: 2,
	//   name: 'Adam Bradleyson',
	//   lastText: 'I should buy a boat',
	//   face: 'https://pbs.twimg.com/profile_images/479090794058379264/84TKj_qa.jpeg'
	// }, {
	//   id: 3,
	//   name: 'Perry Governor',
	//   lastText: 'Look at my mukluks!',
	//   face: 'https://pbs.twimg.com/profile_images/598205061232103424/3j5HUXMY.png'
	// }, {
	//   id: 4,
	//   name: 'Mike Harrington',
	//   lastText: 'This is wicked good ice cream.',
	//   face: 'https://pbs.twimg.com/profile_images/578237281384841216/R3ae1n61.png'
	// }];
