angular.module('translate.factories', [])


.factory('Chats', function ($rootScope, $http, $q) {
	// seed users and chats
	var users = {

	    "John": { source_language: "en", contacts: { Obama: true, Fullstack: true, Kelly: true }, chats: [ "chat1", "chat2", "chat3" ], phoneNumber: 16467831204 },
	    "Kelly": { source_language: "zh-TW", contacts: { John: true, Obama: true, Fullstack: true }, chats: { chat1: true }, phoneNumber: 19172542078 },
	    "Obama": { source_language: "en", contacts: { John: true, Fullstack: true, Kelly: true }, chats: { chat2: true, chat4: true }, phoneNumber: 19172542078 },
	    "Fullstack": { source_language: "fr", contacts: { John: true, Obama: true, Kelly: true }, chats: { chat3: true, chat4: true }, phoneNumber: 19172542078 }
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
  	usersRefFb.set(users);
  	chatsRefFb.set(chats);
	messagesRefFb.set(messages);
	// Might use a resource here that returns a JSON array
	// var chatList = $firebase(ref.child('chats')).$asArray();

	return {

		all: function(user) {

		var usersChats = refFp.child('/users/' + user + '/chats');

		return usersChats.then(function(chatList_snapshot) {  // array of chatIds
				var chatIdArray = chatList_snapshot.val();
				return chatIdArray;
			})

			.then(function(chatIdArray) {
				var chatListRefs = chatIdArray.map(function(chatId) {
					var singleChatRef = refFp.child('/chats/' + chatId);
					return singleChatRef;
				});
				return chatListRefs;
			})

			.then(function(chatListRefs) {
					var chatList = Promise.all(chatListRefs.map(function(singleChatRef) {
						return singleChatRef.then(function(singleChat_snap) {

							return singleChat_snap.val();
						})
					}))

					return chatList;
			})

			.then(function(chatList) {
				return chatList;
			})

		},

		getLastTextOfChat: function(chatId) {
			var messagesRef = refFp.child('/messages/' + chatId);
			return messagesRef.limitToLast(1).then(function(messages_snap) {
		
				var lastText = messages_snap.val();
				if (!lastText) {
					return "No messages available.";
				} else {
				
					var content = _.pluck(lastText, 'content').toString();
					return content;
				}
			})
		},


		get: function(chatId) { 

			var messagesRef = refFp.child('messages/' + chatId);
 
			return messagesRef.limitToLast(5).then(function(messagesRef_snap) {
				var messages = messagesRef_snap.val();
				var messagesArray = _.values(messages);	// convert to array
     
				return messagesArray;
			});
		  
		},


		sendMessage: function(message, chatId) {
			var messagesRef = refFp.child('messages/' + chatId);

			messagesRef.push(message).then(function() {
				// console.log("saved sent Message");
			});


			var userRef = refFp.child('users/' + message.to);

			return userRef.then(function(user_snap) {
				var recipient = user_snap.val();
				return recipient.phoneNumber;
			})
			.then(function(recipientPhone) {
				var messageData = {
					phone: recipientPhone,
					message: message.translated
				};

				return $http.post('/api/sms/sendmsg', messageData).then(function(sentMsg) {

				});
			});
	
		},


		getOtherUser: function(chatId, user) {
			var chatRef = refFp.child('chats/' + chatId);
			return chatRef.then(function(chatRef_snap) {
				var chat = chatRef_snap.val();
				var otherUser = _.filter(chat.members, function(member) {
					return member !== user;
				});

				otherUser = otherUser.toString();
				return otherUser;
			});
		},

		translateWhileTyping: function(text, targetLanguage) {
			var queryParams = {
				language: targetLanguage,
				text: text
			};
		
			return $http.get('/api/translate', {
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
    
        	var userRef = refFp.child('/users/' + user);

        	return userRef.update({
        		"source_language": languageCode
        	}).then(function() {
        		return;
        	}).catch(function(err) {
        		console.log("Updated source language could not be saved: " + err);
        	})
        },

		remove: function(chat) {
			chats.splice(chats.indexOf(chat), 1);
		}


	};  // end object
})


// .factory('Auth', function ($firebaseAuth, $rootScope) {
//   //set global variable reference to our Firebase on $rootScope to make it available to every $scope 
//   var ref = new Firebase("https://fiery-torch-3361.firebaseio.com");
//   return $firebaseAuth(ref);
// })