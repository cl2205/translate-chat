'use strict';
app.directive('chatWindow', function () {
    return {
        restrict: 'E',
        templateUrl: 'js/common/directives/chat-window/chat-window.html',
        controller: 'ChatMsgController'
    };
});