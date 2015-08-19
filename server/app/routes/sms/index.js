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


router.post('/', function(req, res, next) {
	console.log("hit post route");

 	var ref = new Firebase("https://fiery-torch-3361.firebaseio.com");

 	var refFp = new Fireproof(ref);
 	var usersRef = refFp.child('/users');
 	var recipientLanguage;
 	var message = {};
 	message.content = req.body.Body;
 	
 	usersRef.then(function(usersRef_snap) {	// find users that match phone #s
 		var users = usersRef_snap.val();
 		var sender = _.findKey(users, { 'phoneNumber' : +req.body.From }) // convert to # with +
 		// if sender is undefined, create a new user, and create a new chat with the recipient and sender
 		var recipient = _.findKey(users, { 'phoneNumber' : +req.body.To } )
 		message.from = sender;
 		message.to = recipient;
 		recipientLanguage = users[recipient].source_language;
 	
 		var chatMembers = [ sender, recipient ];
 	
 		return chatMembers;
 	}).then(function(chatMembers) {	// find chats where members contain those users
 		var chatsRef = refFp.child('/chats');
 		return chatsRef.then(function(chats_snap){
 			var chats = chats_snap.val();
 			
 			var chatId = _.findKey(chats, { members: [ chatMembers[0], chatMembers[1] ] });
 
 			return chatId;
 		})
 	}).then(function(chatId) {
 		var messagesRef = refFp.child('/messages/' + chatId);
 		return translate(message.content, recipientLanguage) // translate message
 			.then(function(translatedMsg) {
 				message.translated = translatedMsg;
 
 				return messagesRef.push(message).then(function() { // use Twilo client.messages?
 
 				})
 		});	
 	}).catch(function(err) {
 		console.log(err.message);
 	});
});


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

