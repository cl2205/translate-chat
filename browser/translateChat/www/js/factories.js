angular.module('translate.factories', [])

// .factory('Auth', function ($firebaseAuth, $rootScope) {
//   //set global variable reference to our Firebase on $rootScope to make it available to every $scope 
//   var ref = new Firebase("https://fiery-torch-3361.firebaseio.com");
//   console.log("ref", ref);
//   return $firebaseAuth(ref);
// })

.factory('Chats', function ($firebaseArray, $rootScope, $http) {

  var ref = new Firebase("https://fiery-torch-3361.firebaseio.com");
  chatsRef = $firebaseArray(ref.child('chats'));
  // chats.forEach(function(convo){
  //   chatsRef.push(convo);
  // })
  var users = {
    "john": { source_language: "en", contacts: { obama: true, fullstack: true, kelly: true } },
    "obama": { source_language: "en", contacts: { john: true, fullstack: true, kelly: true } },
    "fullstack": { source_language: "fr", contacts: { john: true, obama: true, kelly: true } },
    "kelly": { source_language: "zh-TW", contacts: { john: true, obama: true, kelly: true } }
  };

  usersRef = $firebaseArray(ref.child('users'));

  usersRef.push(users);


  var chats = [

  ];

  messagesRef = $firebaseArray(ref.child('messages'));
  // .limitToLast(10);
  
  var chatList = $firebaseArray(ref);

  console.log("chatlist", chatList);
  // Might use a resource here that returns a JSON array
  // var chatList = $firebase(ref.child('chats')).$asArray();

  // Some fake testing data
  // var chats = [{
  //   id: 0,
  //   members: {
  //     obama: true,
  //     fullstack: true
  //   },
  //   messages: {
  //     m1: true, 
  //     m2: true,
  //     m3: true
  //   }


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

  return {

    all: function() {
      return chatList;
    },

    remove: function(chat) {
      chats.splice(chats.indexOf(chat), 1);
    },

    get: function(chatId) { // get chat for 
      for (var i = 0; i < chatList.length; i++) {
        if (chatList[i].id === parseInt(chatId)) {
          console.log("CHAT", chats[i]);
          return chats[i];
        }
      }
      return null;
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
