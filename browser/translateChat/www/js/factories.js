angular.module('translate.factories', [])

// .factory('Auth', function ($firebaseAuth, $rootScope) {
//   //set global variable reference to our Firebase on $rootScope to make it available to every $scope 
//   var ref = new Firebase("https://fiery-torch-3361.firebaseio.com");
//   console.log("ref", ref);
//   return $firebaseAuth(ref);
// })

.factory('Chats', function ($rootScope, $http, $q) {
		// var users = {

	//     "John": { source_language: "en", contacts: { Obama: true, Fullstack: true, Kelly: true }, chats: [ "chat1", "chat2", "chat3" ], phoneNumber: 9172542078 },
	//     "Obama": { source_language: "en", contacts: { John: true, Fullstack: true, Kelly: true }, chats: { chat2: true, chat4: true }, phoneNumber: 9172542078 },
	//     "Fullstack": { source_language: "fr", contacts: { John: true, Obama: true, Kelly: true }, chats: { chat3: true, chat4: true }, phoneNumber: 9172542078 },
	//     "Kelly": { source_language: "zh-TW", contacts: { John: true, Obama: true, Kelly: true }, chats: { chat1: true } }
	// };

	var chats = {
	    "chat1": { id: "chat1", members: [ "John", "Kelly"], lastText: "Where are you?"},
	    "chat2": { id: "chat2", members: [ "John", "Obama" ], lastText: "I'm so pumped!!!" },
	    "chat3": { id: "chat3", members: [ "John", "Fullstack"], lastText: "I have big news for you..." },
	    "chat4": { id: "chat4", members: ["Fullstack", "Obama"], lastText: "I have a big news..." }
	};

var messages = {
	"chat1": [ { from: "Kelly", content: "Je suis hungry. Wanna grab a bite?", translated: "I'm hungry. Wanna grab a bite?"}, { from: "John", content: "Sure, let's go to McDonald's", translated: "Sure, let's mange"}],
	"chat2": [],
	"chat3": [],
	"chat4": []
}



	// usersRef.set(users);  
	// chatsRef.set(chats);

	var ref = new Firebase("https://fiery-torch-3361.firebaseio.com");
	refFp = new Fireproof(ref);
	Fireproof.bless($q);
	
	var messagesRefFb = ref.child('messages');
  var chatsRefFb = ref.child('chats');
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
								console.log(singleChat_snap.val());
								return singleChat_snap.val();
							})
						}))
						console.log("chatList", chatList);
						return chatList;
				})

				.then(function(chatList) {
					return chatList;
				})

		},


		remove: function(chat) {
			chats.splice(chats.indexOf(chat), 1);
		},


		get: function(chatId) { // get chat for 
			var messagesRef = refFp.child('messages/' + chatId);
      console.log("messagesRef", messagesRef);
			return messagesRef.then(function(messagesRef_snap) {
				var messages = messagesRef_snap.val();
        console.log("messages in fact", messages);
				return messages;
			});
		  
		},



		translateWhileTyping: function(text, targetLanguage) {
			var queryParams = {
				language: targetLanguage,
				text: text
			};
		
			return $http.get('/api/members/translate', {    // SERVER ROUTE
				params: queryParams
			})

			.then(function (response) {
					return response.data;
			});
		},

		// submitMessage: function() {
		//   var tanslatedMsg =  
		// },

		submitMessage: function(to, text) {

			var messageData = {
				to: to,
				text: text
			};


			return $http.post('/', messageData).then(function(sentMsg) {
				console.log(sentMsg);
			});
		}

	};  // end object
})


.factory('Translate', function ($http) {

	var queryParams;

});



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
