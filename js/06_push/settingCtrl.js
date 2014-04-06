app.controller('SettingCtrl',function($scope, $window, SettingManager, $ionicLoading, $http, Notification, iLabMember){
	$scope.UNREGISTERED = 0;
	$scope.REGISTERED = 1;
	$scope.DELETE = 2;
	
	$scope.state = $scope.UNREGISTERED;
	
	$scope.init = function() {
		$scope.host = SettingManager.getHost();
		if ($scope.host.registered) {
			$scope.state = $scope.REGISTERED;
		}
	};	
	
	$scope.onActionClick = function(STATE) {
    	$scope.state = STATE;
    };
    
    $scope.onRegisterClick = function() {
    	if(!$scope.host.phone) {
    		Notification.alert('請輸入電話', null, "通知");
    		return;
    	}
    	$scope.show();
    	iLabMember.register($scope.host,
     		   function() {
 				$scope.hide();
     			$scope.host.registered = true;
     			Notification.alert('註冊成功', null, "通知");
     			SettingManager.setHost($scope.host);
     			$scope.state = $scope.REGISTERED;
     		}, function() {
     			$scope.hide();
     			Notification.alert('註冊失敗', null, "警告");
 		});
    };
	
	$scope.onDeleteClick = function() {
		$scope.show();
		iLabMember.unregister($scope.host.phone, function(response) {
			$scope.host.name = "";
			$scope.host.phone = "";
			$scope.host.email = "";
			$scope.host.birthday = "";
			$scope.host.registered = false;
			SettingManager.setHost($scope.host);
			$scope.hide();
			$scope.state = $scope.UNREGISTERED;
			}, function() {
				$scope.hide();
    			Notification.alert('刪除失敗', null, "警告");
    		});
	};
	
	$scope.onCancelClick = function() {
		$scope.state = $scope.REGISTERED;
	};
	
	$scope.getNetwork = function() {
		if (SettingManager.getHost().type == '0')
			return "GCM";
		return "APNS";
	};

    $scope.show = function() {
        $scope.loading = $ionicLoading.show({
          content: "<i class='ion-loading-b'></i>",
          animation: 'fade-in',
          showBackdrop: true,
          maxWidth: 200,
          showDelay: 500
        });
    };
    
    $scope.hide = function() {
    	$scope.loading.hide();
    };
});