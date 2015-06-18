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

module.exports = router;

// api/sms/sendmsg
// Submitting SMS // send SMS to a number
router.post('/sendmsg', function(req, res, next) {
	// extract info from req body
	var toNumber = req.body.phone;
	var message = req.body.message;
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
