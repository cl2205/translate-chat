var router = require('express').Router();
var request = require('request');
var requestPromise = require('request-promise');
var app = require('../../index');	// doing a fs read File
var apiKey = app.getValue('env').TRANSLATE.apiKey;

module.exports = router; // module.exports = function (app){ returns router}	// passing app into function

//api/translate

router.get('/', function (req, res) {
    var url = 'https://www.googleapis.com/language/translate/v2';
    console.log("REQ.QUERY.LANGUAGE", req.query.language);
    if (!req.query.language) req.query.language = 'zh-TW';
    var qs = {
        key: apiKey,
        target: req.query.language,
        q: req.query.text,
    };

    requestPromise({ url: url, qs: qs })

        .then(function(body) {
            body = JSON.parse(body);

            var translatedMsg = body.data.translations[0].translatedText;
            console.log("translatedMsg", translatedMsg);
            return translatedMsg;
        })

        .then(function(translatedMsg) {
            res.send(translatedMsg);
        })
        .catch(console.error);
});



		

	// request( url, function (error, response, body) {
	// 	if (error) console.log("error", error);
	// 	console.log("body: ", body);

	// 	body = JSON.parse(body);

	// 	var translatedMsg = body.data.translations[0].translatedText;
	// 	console.log("translatedMsg", translatedMsg);

	// 	return translatedMsg;
	// })
