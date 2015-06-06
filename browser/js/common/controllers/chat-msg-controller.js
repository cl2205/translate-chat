'use strict';
// https://cloud.google.com/translate/v2/getting_started
// https://cloud.google.com/translate/v2/using_rest#target
// https://developers.google.com/console/help/new/#apikeybestpractices
// https://cloud.google.com/translate/v2/faq

// seeding data? 
// how to delete data in Firebase in bulk??

// see who's online
// sign up through Facebook or Gmail
// login state, who's online state, chat window state 

  // we pass our new chatMessages factory into the controller
app.controller("ChatMsgController", function ($scope, chatMessages, TranslationFactory) {

    $scope.user = "Guest " + Math.round(Math.random() * 100);

    // we add chatMessages array to the scope to be used in our ng-repeat
    $scope.messages = chatMessages;

	// get supported languages list
    TranslationFactory.getLanguages()
		.then(function(languageList) {
			console.log("lanagueslist", languageList);
			// console.log("a language", languageList[0].name)
			$scope.list = languageList;	// array of objects { language: zh-CN, name: Chinese }
		});


	$scope.setLanguage = function(languageCode) {
		$scope.selectedLanguage = languageCode;// selected language from select
    };


	// a method to create new messages; called by ng-submit
    $scope.addMessage = function() {

		var text = $scope.message;
		console.log("$scope.language", $scope.selectedLanguage);
		var targetLanguage = $scope.selectedLanguage;

		TranslationFactory.translate(text, targetLanguage)	// make Translate API ajax call 

			.then(function (translatedMessage) {

				$scope.translated = translatedMessage;

				console.log("scope message", $scope.message);
				console.log("translated", $scope.translated);
			})

			.then(function() {
				// calling $add on a synchronized array is like Array.push(),
				// except that it saves the changes to our Firebase database!
				$scope.messages.$add({
					from: $scope.user,
					content: $scope.message,
					translated: $scope.translated
				});

			})

			.then(function() {
				// reset the message input
				$scope.message = ""; // ASYNC
			});
	};

    // if the messages are empty, add something for fun!
    $scope.messages.$loaded(function () {
		if ($scope.messages.length === 0) {
			$scope.messages.$add({
				from: "Firebase Docs",
				content: "Hello world!"
			});
		}
    });

});

		





