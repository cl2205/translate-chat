angular.module('translate.factories', [])

// .factory('Auth', function ($firebaseAuth, $rootScope) {
//   //set global variable reference to our Firebase on $rootScope to make it available to every $scope 
//   var ref = new Firebase("https://fiery-torch-3361.firebaseio.com");
//   console.log("ref", ref);
//   return $firebaseAuth(ref);
// })

.factory('Chats', function ($rootScope, $http) {

  // var ref = new Firebase("https://fiery-torch-3361.firebaseio.com");
  // chatsRef = ref.child('chats');
  // usersRef = ref.child('users');
  // messagesRef = ref.child('messages');

  // var users = {

  //   "john": { source_language: "en", contacts: { obama: true, fullstack: true, kelly: true }, chats: { chat1: true, chat2: true, chat3: true }, phoneNumber: 9172542078 },
  //   "obama": { source_language: "en", contacts: { john: true, fullstack: true, kelly: true }, chats: { chat2: true, chat4: true }, phoneNumber: 9172542078 },
  //   "fullstack": { source_language: "fr", contacts: { john: true, obama: true, kelly: true }, chats: { chat3: true, chat4: true }, phoneNumber: 9172542078 },
  //   "kelly": { source_language: "zh-TW", contacts: { john: true, obama: true, kelly: true }, chats: { chat1: true } }
  // };

  // var chats = {
  //   "chat1": { id: 1, members: { john: true, kelly: true } },
  //   "chat2": { id: 2, members: { john: true, obama: true } },
  //   "chat3": { id: 3, members: { john: true, fullstack: true } },
  //   "chat4": { id: 4, members: { fullstack: true, obama: true} }
  // };


  // usersRef.set(users);  
  // chatsRef.set(chats);
  
  // .limitToLast(10);
  

  // Might use a resource here that returns a JSON array
  // var chatList = $firebase(ref.child('chats')).$asArray();

  return {

    // all: function(user) {
    //   var chatList = ref.child('chats');

    //   chatList.once('value', function(snapshot) {
    //     var chatSnapshot = snapshot.val();
    //     console.log("snapshot", chatSnapshot);
    //     var usersChats = _.where(chatSnapshot, { members: { john: true } });
    //     console.log("usersChats", usersChats);
    //   });

    //   // return usersChats;
    // },

    remove: function(chat) {
      chats.splice(chats.indexOf(chat), 1);
    },

    // get: function(chatId) { // get chat for 
    //   for (var i = 0; i < usersChats.length; i++) {
    //     if (usersChats[i].id === parseInt(chatId)) {
    //       console.log("CHAT", usersChats[i]);
    //       return usersChats[i];
    //     }
    //   }
    //   return null;
    // },

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

    sendMsg: function(to, text) {

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
