var app = angular.module("Simple_App44", ['ionic', 'PhoneGap','iLabBirthdayLine']);

app.config(function($stateProvider, $urlRouterProvider) {
	$stateProvider
	    .state('tab', {
	        url: "/tab",
	        abstract: true,
	        templateUrl: "templates/06_push/tab.html"
	    })
        .state('tab.friends', {
            url: '/friends',
            views: {
                'tab-friends': {
                    templateUrl: 'templates/06_push/friends.html',
                    controller: 'FriendsCtrl'
                }
            }
        })
        .state('tab.setting', {
            url: '/setting',
            views: {
                'tab-setting': {
                    templateUrl: 'templates/06_push/setting.html',
                    controller: 'SettingCtrl'
                }
            }
        });

    $urlRouterProvider.otherwise("/tab/friends");
});

app.run(function(SettingManager, PushNotificationsFactory) {
	var GCMSENDERID = '325215294371';
	
	PushNotificationsFactory(GCMSENDERID, function(token, type) {
		var host = SettingManager.getHost();
		host.token = token;
		if (type == "GCM")
			host.type = 0;
		else if (type == "APNS")
			host.type = 1;
		SettingManager.setHost(host);
	});
});