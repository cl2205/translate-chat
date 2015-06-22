var router = require('express').Router(),
	twilio = require('twilio'),
	request = require('request'),
	requestPromise = require('request-promise'),
	app = require('../../index'),	// doing a fs read File
	translateApiKey = app.getValue('env').TRANSLATE.apiKey,
	twilioId = app.getValue('env').TWILIO.sId,
	twilioAuth = app.getValue('env').TWILIO.authToken,
	twilioNum = app.getValue('env').TWILIO.num,
	client = new twilio.RestClient(twilioId, twilioAuth), // create a Twilio REST client
	Firebase = require('firebase'),
	Fireproof = require('fireproof'),
	Q = require('q'),
	_ = require('lodash');

Fireproof.bless(Q);

module.exports = router;
// api/sms
// getting an SMS at my twilio number

function translate(msg, targetLang) {
	var url = 'https://www.googleapis.com/language/translate/v2';
 
    if (!targetLang) targetLang = 'en';

    var qs = {
        key: translateApiKey,
        target: targetLang,
        q: msg,
    };

    return requestPromise({ url: url, qs: qs })
        .then(function(body) {
            body = JSON.parse(body);
            var translatedMsg = body.data.translations[0].translatedText;
            // console.log("translatedMsg", translatedMsg);
            return translatedMsg;
        })
        .catch(function(err) {
        	console.log(err.message);
 		});
}

// api/sms
router.post('/', function(req, res, next) {
	console.log("hit post route");

 	var ref = new Firebase("https://fiery-torch-3361.firebaseio.com");

 	var refFp = new Fireproof(ref);
 	var usersRef = refFp.child('/users');
 	var chatsRef = refFp.child('/chats');
 	var recipientLanguage;
 	var message = {};
 	message.content = req.body.Body;
 	
 	usersRef.then(function(usersRef_snap) {	// find users that match phone #s
 		var users = usersRef_snap.val();
 		var sender = _.findKey(users, { 'phoneNumber' : +req.body.From }) // convert to # with +
 		var recipient = _.findKey(users, { 'phoneNumber' : +req.body.To } )
 		

 		// if sender is undefined, create a new user, and create a new chat with the recipient and sender
 		if (!sender) {
 			var newUser = {
 				phoneNumber: +req.body.From
 			};

 			var newUserRef = usersRef.push(newUser);
 			var newUserId = newUserRef.key();
 			var createdUserRef = refFp.child('/users/' + newUserId);
 			createdUserRef.update({ "id": newUserId });

 			sender = newUserRef.key();
 			console.log("new user created, new user/sender ID: ", sender);
 			sender = newUser.phoneNumber;
 			console.log("sender identified by phoneNumber", sender);

 			var newChat = {	// create new chat
 				members: [ sender, recipient]
 			};

 			var newChatRef = chatsRef.push(newChat);
 			var newChatId = newChatRef.key();

 			var createdChatRef = refFp.child('/chats/' + newChatId);
 			createdChatRef.update({ "id": newChatId });
 	
 			console.log("new chat with id assigned", newChat);
 			console.log("new chat created, chat Id: ", newChatId);
 		}
 		// if foreign number  -- end
	
 		message.from = sender;
 		message.to = recipient;
 		recipientLanguage = users[recipient].source_language;
 		console.log("recipientLanguage", recipientLanguage);
 		console.log("sender", sender);
 		console.log("recipient", recipient);
 		var chatMembers = [ sender, recipient ];
 		console.log("chatMembers", chatMembers);
 		return chatMembers;
 	}).then(function(chatMembers) {	// find chats where members contain those users
 		var chatsRef = refFp.child('/chats');
 		return chatsRef.then(function(chats_snap){
 			var chats = chats_snap.val();
 			console.log('chats', chats);
 			var chatId = _.findKey(chats, { members: [ chatMembers[0], chatMembers[1] ] });
 			console.log("found chatId", chatId);
 			return chatId;
 		})
 	}).then(function(chatId) {
 		var messagesRef = refFp.child('/messages/' + chatId);
 		
 		return translate(message.content, recipientLanguage) // translate message
 			.then(function(translatedMsg) {
 				message.translated = translatedMsg;
 				message.chatId = chatId;
 				console.log("translated message", message.translated); // translate message
 				return messagesRef.push(message).then(function() { // use Twilo client.messages?
 					console.log("saved");
 				})
 		});	
 	}).catch(function(err) {
 		console.log(err.message);
 	});
});
 	// var messagesRef = refFp.child('/messages');



// api/sms/sendmsg
// sending SMS from my twilio number
router.post('/sendmsg', function(req, res, next) {
	// extract info from req body
	var toNumber = req.body.phone;
	var message = req.body.message;
	// var from = req.body.from;
	// var mediaUrl = req.body.url;

	// Send the message
	client.sendMessage({
		to: toNumber,
		body: message,
		from: twilioNum
	}).then(function(messageData) {
		res.send('Message sent! SID: ' + messageData.sid);
	}).catch(function(err) {
		console.log(err);
		throw new Error(err.message);
	});

});

// hard coded way
// router.post('/', function(req, res, next) {
// 	console.log("req Body", req.body.Body);
// 	console.log("req.From", req.body.From)
// 	console.log("hit route");

//  	var message = {
//  		from: 'Kelly',
// 		content: req.body.Body,
// 		to: 'John'
//  	}

//  	var ref = new Firebase("https://fiery-torch-3361.firebaseio.com");

//  	var refFp = new Fireproof(ref);

//  	// var usersRef = refFp.child('/users');
//  	var userRef = refFp.child('/users/John');
//  	var messagesRef = refFp.child('/messages/chat1');

//  	var url = 'https://www.googleapis.com/language/translate/v2';
 
//     if (!req.query.language) req.query.language = 'en';
//     var qs = {
//         key: translateApiKey,
//         target: req.query.language,
//         q: req.body.Body,
//     };

//     requestPromise({ url: url, qs: qs })
//         .then(function(body) {
//             body = JSON.parse(body);
//             var translatedMsg = body.data.translations[0].translatedText;
//             console.log("translatedMsg", translatedMsg);
//             return translatedMsg;
//         })
//         .then(function(translatedMsg) {
//            	message.translated = translatedMsg;
//            	messagesRef.push(message).then(function() { // use Twilo client.messages?
//  			console.log("saved");
//  			});
//         })
//         .catch(console.error);
//  });
