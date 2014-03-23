angular.module('PhoneGap', []).factory('PhoneGap', function ($q, $rootScope, $document) {
    var deferred = $q.defer();

    $document.bind('deviceready', function () {
        $rootScope.$apply(deferred.resolve);
    });

    return {
        ready: function () {
            return deferred.promise;
        }
    };
}).run(function (PhoneGap) {});

angular.module('PhoneGap').factory('Notification', function ($q, $window, PhoneGap) {
    return {
        alert: function (message, alertCallback, title, buttonName) {
            PhoneGap.ready().then(function () {
                $window.navigator.notification.alert(message, alertCallback, title, buttonName);
            });
        },
        confirm: function (message, confirmCallback, title, buttonLabels) {
            PhoneGap.ready().then(function () {
                $window.navigator.notification.confirm(message, confirmCallback, title, buttonLabels);
            });
        },
        prompt: function (message, promptCallback, title, buttonLabels, defaultText) {
            PhoneGap.ready().then(function () {
                $window.navigator.notification.prompt(message, promptCallback, title, buttonLabels, defaultText);
            });
        },
        beep: function (times) {
            PhoneGap.ready().then(function () {
                $window.navigator.notification.beep(times);
            });
        },
        vibrate: function (milliseconds) {
            PhoneGap.ready().then(function () {
                $window.navigator.notification.vibrate(milliseconds);
            });
        }
    };
});

angular.module('PhoneGap').factory('Contacts', function ($q, $window, PhoneGap) {
    return {
        find: function(contactFields, contactSuccess, contactError, contactFindOptions) {
            console.log('contact rdy1');
            PhoneGap.ready().then(function () {
                console.log('contact rdy 2');
                $window.navigator.contacts.find(contactFields, contactSuccess, contactError, contactFindOptions);
            });
        }
    };
});

angular.module('PhoneGap').factory('BusyIndicator', function ($q, $window, PhoneGap) {
    var busyIndicator = null;
    var getBusyIndicator = function() {
        if (busyIndicator == null)
            busyIndicator = new WL.BusyIndicator('請稍後', {text : 'Loading...'});
        return busyIndicator;
    };
    return {
        show: function() {
            PhoneGap.ready().then(function () {
                getBusyIndicator().show();
            });
        },
        hide: function() {
            PhoneGap.ready().then(function () {
                getBusyIndicator().hide();
            });
        }
    };
});