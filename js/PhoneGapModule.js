angular.module('PhoneGap', []).factory('PhoneGap', function ($q, $rootScope, $window) {
    var deferred = $q.defer();

    $window.ionic.Platform.ready(function(){
          console.log("PhoneGap is ready!");
          $rootScope.$apply(deferred.resolve);
    });
    
    return {
        ready: function (resolve, reject, notify) {
            return deferred.promise.then(resolve, reject, notify);
        }
    };
}).run(function (PhoneGap) {});

angular.module('PhoneGap').factory('Notification', function ($q, $window, PhoneGap) {
    return {
        alert: function (message, alertCallback, title, buttonName) {
            PhoneGap.ready(function () {
                $window.navigator.notification.alert(message, alertCallback, title, buttonName);
            });
        },
        confirm: function (message, confirmCallback, title, buttonLabels) {
            PhoneGap.ready(function () {
                $window.navigator.notification.confirm(message, confirmCallback, title, buttonLabels);
            });
        },
        prompt: function (message, promptCallback, title, buttonLabels, defaultText) {
            PhoneGap.ready(function () {
                $window.navigator.notification.prompt(message, promptCallback, title, buttonLabels, defaultText);
            });
        },
        beep: function (times) {
            PhoneGap.ready(function () {
                $window.navigator.notification.beep(times);
            });
        },
        vibrate: function (milliseconds) {
            PhoneGap.ready(function () {
                $window.navigator.notification.vibrate(milliseconds);
            });
        }
    };
});

angular.module('PhoneGap').factory('Contacts', function ($q, $window, PhoneGap) {
    return {
        find: function(contactFields, contactSuccess, contactError, contactFindOptions) {
            PhoneGap.ready(function () {
                $window.navigator.contacts.find(contactFields, contactSuccess, contactError, contactFindOptions);
            });
        }
    };
});

angular.module('PhoneGap').factory('BusyIndicator', function ($q, $window, PhoneGap) {
    var busyIndicator = null;
    var getBusyIndicator = function() {
        if (busyIndicator == null)
            busyIndicator = new WL.BusyIndicator('載入中', {text : 'Loading...'});
        return busyIndicator;
    };
    return {
        show: function() {
            PhoneGap.ready(function () {
                getBusyIndicator().show();
            });
        },
        hide: function() {
            PhoneGap.ready(function () {
                getBusyIndicator().hide();
            });
        }
    };
});