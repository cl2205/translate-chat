// this factory returns a synchronized array of chat messages
app.factory("chatMessages", ["$firebaseArray",
  function($firebaseArray) {
    // create a reference to the Firebase database where we will store our data
    // var randomRoomId = Math.round(Math.random() * 100000000);
    // var ref = new Firebase("https://fiery-torch-3361.firebaseio.com" + randomRoomId);
    var ref = new Firebase("https://fiery-torch-3361.firebaseio.com").limitToLast(10);
    console.log("ref", ref);
    // this uses AngularFire to create the synchronized array
    return $firebaseArray(ref);
  }
]);