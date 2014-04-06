var app = angular.module("Simple_App44", ['ionic', 'PhoneGap']);

app.config(function($stateProvider, $urlRouterProvider) {
	$stateProvider
	    .state('tab', {
	        url: "/tab",
	        abstract: true,
	        templateUrl: "templates/05_sms/tab.html"
	    })
        .state('tab.hellosms', {
            url: '/hellosms',
            views: {
                'tab-hellosms': {
                    templateUrl: 'templates/05_sms/helloSMS.html',
                    controller: 'HelloSMSCtrl'
                }
            }
        });

    $urlRouterProvider.otherwise("/tab/hellosms");
})
.run(function(){
    document.addEventListener('deviceready', function() {
        $rootScope.$apply(function() {
            $rootScope.myVariable = "variable value";
        });
    });
});

