var router = require('express').Router();
var twilio = require('twilio');
var request = require('request');
var requestPromise = require('request-promise');
var app = require('../../index');	// doing a fs read File
var translateApiKey = app.getValue('env').TRANSLATE.apiKey;
var twilioId = app.getValue('env').TWILIO.sId;
var twilioAuth = app.getValue('env').TWILIO.authToken;
var twilioNum = app.getValue('env').TWILIO.num;
var client = new twilio.RestClient(twilioId, twilioAuth); // create a Twilio REST client
var Firebase = require('firebase');
var Fireproof = require('fireproof');
var Q = require('q');

Fireproof.bless(Q);

module.exports = router;

// getting an SMS at my twilio number
router.post('/', function(req, res, next) {
	console.log("req Body", req.body.Body);
	console.log("req.From", req.body.From)
	console.log("hit route");

 	var message = {
 		from: 'Kelly',
		content: req.body.Body,
		to: 'John'
 	}

 	var ref = new Firebase("https://fiery-torch-3361.firebaseio.com");

 	var refFp = new Fireproof(ref);

 	// var usersRef = refFp.child('/users');
 	var userRef = refFp.child('/users/John');
 	var messagesRef = refFp.child('/messages/chat1');

 	var url = 'https://www.googleapis.com/language/translate/v2';
 
    if (!req.query.language) req.query.language = 'en';
    var qs = {
        key: translateApiKey,
        target: req.query.language,
        q: req.body.Body,
    };

    requestPromise({ url: url, qs: qs })
        .then(function(body) {
            body = JSON.parse(body);
            var translatedMsg = body.data.translations[0].translatedText;
            console.log("translatedMsg", translatedMsg);
            return translatedMsg;
        })
        .then(function(translatedMsg) {
           	message.translated = translatedMsg;
           	messagesRef.push(message).then(function() { // use Twilo client.messages?
 			console.log("saved");
 			});
        })
        .catch(console.error);



 	
 	
 });



// router.get('/', function (req, res) {
//     var url = 'https://www.googleapis.com/language/translate/v2';
//     console.log("REQ.QUERY.LANGUAGE", req.query.language);
//     if (!req.query.language) req.query.language = 'zh-TW';
//     var qs = {
//         key: apiKey,
//         target: req.query.language,
//         q: req.query.text,
//     };

//     requestPromise({ url: url, qs: qs })

//         .then(function(body) {
//             body = JSON.parse(body);

//             var translatedMsg = body.data.translations[0].translatedText;
//             console.log("translatedMsg", translatedMsg);
//             return translatedMsg;
//         })

//         .then(function(translatedMsg) {
//             res.send(translatedMsg);
//         })
//         .catch(console.error);
// });



 	// 	userRef.then(function(userRef_snap) {	// find user
 	// 	var user = userRef_snap.val();
 	// 	console.log("user", user.chats);
 	// 	var sender = _.where(users, { 'phoneNumber': req.body.From });
 	// 	var receiver = _.where(users, { 'phoneNumber': req.body.To });
 	// 	var chatMembers = [ sender, receiver ];
 	// 	console.log("chatMembers", chatMembers);
 	// 	return chatMembers;
 	// }).then(function(chatMembers) {
 	// 	var chatsRef = refFp.child('/chats');
 	// 	return chatsRef.then(function(chats_snap){
 	// 		var chats = chats_snap.val();
 	// 		console.log('chats', chats);
 	// 		var chatId = _.where(chats, { members: [ req.body.From, req.body.To] })
 	// 		return chatId;
 	// 	})
 	// }).then(function(chatId) {
 	// 	var messagesRef = refFp.child('/messages/' + chatId);
 	// 	messagesRef.push(message).then(function() { // use Twilo client.messages?
 	// 	console.log("saved");
 	// 	})
 	// })


 	// usersRef.then(function(usersRef_snap) {	// find user
 	// 	var users = usersRef_snap.val();
 	// 	console.log("users", users);
 	// 	var sender = _.where(users, { 'phoneNumber': req.body.From });
 	// 	var receiver = _.where(users, { 'phoneNumber': req.body.To });
 	// 	var chatMembers = [ sender, receiver ];
 	// 	console.log("chatMembers", chatMembers);
 	// 	return chatMembers;
 	// }).then(function(chatMembers) {
 	// 	var chatsRef = refFp.child('/chats');
 	// 	return chatsRef.then(function(chats_snap){
 	// 		var chats = chats_snap.val();
 	// 		console.log('chats', chats);
 	// 		var chatId = _.where(chats, { members: [ req.body.From, req.body.To] })
 	// 		return chatId;
 	// 	})
 	// }).then(function(chatId) {
 	// 	var messagesRef = refFp.child('/messages/' + chatId);
 	// 	messagesRef.push(message).then(function() { // use Twilo client.messages?
 	// 	console.log("saved");
 	// 	})
 	// })

 	// var messagesRef = refFp.child('/messages');

 
   


	// var twiml = new twilio.TwimlResponse();

 //    res.type('text');
    // res.send(twiml.toString());
	//Validate that this request really came from Twilio...
    // if (twilio.validateExpressRequest(req, twilioAuth)) {
    	
    //     var twiml = new twilio.TwimlResponse();

    //     res.type('text/xml');
    //     res.send(twiml.toString());
    // }
    // else {
    //     res.send('you are not twilio.  Buzz off.');
    // }
// });

	

// api/sms/sendmsg
// sending SMS from my twilio number
router.post('/sendmsg', function(req, res, next) {
	console.log("req body phone", req.body.phone);
	console.log("typeof phone", typeof req.body.phone);
	// extract info from req body
	var toNumber = req.body.phone;
	var message = req.body.message;
	// var from = req.body.from;
	// var mediaUrl = req.body.url;
	console.log("twilioNum", twilioNum);
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


	// var resp = {};

	// if (!msg || !msg.to || !msg.text) {
	// 	resp.status = "error";
	// 	resp.message = "invalid data";
	// 	res.send(resp);
	// }
