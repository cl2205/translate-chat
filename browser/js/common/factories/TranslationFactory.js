'use strict';



app.factory('TranslationFactory', function ($http) {

    var queryParams;

    return {

        translate: function (text, targetLanguage) {

            queryParams = {
                language: targetLanguage,
                text: text
            };
    
            return $http.get('/api/members/translate', {    // SERVER ROUTE
                params: queryParams
            })
            .then(function (response) {
                console.log("FACTORY - RESPONSE DATA", response.data);
                return response.data;
            });
        },

        getLanguages: function () {

            queryParams = {
                language: 'en'
            };

            return $http.get('/api/members', {
                params: queryParams
            })
            .then(function (response) {
                return response.data;
            });

        }


    };

});



// 'use strict';



// app.factory('TranslationFactory', function ($http) {


//     var queryParams;

//     return {

//         translate: function (text) {

//             queryParams = {
//                 target: 'zh-TW',    // how to get specified language?
//                 q: text
//             };
    
//             return $http.get('https://www.googleapis.com/language/translate/v2?', {
//                 params: queryParams
//             }).then(function (response) {
//                 console.log("factory data to return to controller", response.data.data.translations[0].translatedText);
//                 return response.data.data.translations[0].translatedText;
//             });
//         },

//         getLanguages: function () {

//             queryParams = {
//                 key: apiKey,
//                 target: 'en'
//             };

//             return $http.get('https://www.googleapis.com/language/translate/v2/languages?parameters', {
//                 params: queryParams
//             }).then(function (response) {
//                 console.log("factory languages data to return to controller", response.data.data.languages);
//                 return response.data.data.languages;
//             });

//         }


//     };

// });





