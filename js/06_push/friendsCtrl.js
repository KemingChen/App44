app.controller('FriendsCtrl', function($scope, $ionicModal, FriendManager, Notification, Contacts, $window, BusyIndicator){
	var clickTime = new Date();
	$scope.states = {
		CREATE: {
			confirm: {
				click: function(){
					if (!$scope.model.name || !$scope.model.phone) {
						Notification.alert("請輸入姓名及電話", null, '警告', '確定');
						return;
					}
					FriendManager.add($scope.model);
					$scope.modal.hide();
				},
				name: "新增",
			},
			cancel: {
				click: function(){
					clickTime = new Date();
					$scope.modal.hide();
				},
				name: "取消",
			},
			title: "新增朋友",
			footer: false,
			inputDisable: false,
		},
		EDIT: {
			confirm: {
				click: function(){
					FriendManager.edit($scope.model);
					$scope.modal.hide();
				},
				name: "修改",
			},
			cancel: {
				click: function(){
					$scope.onFriendClick($scope.states.LOOK, $scope.friends[$scope.model.id]);
				},
				name: "取消",
			},
			title: "編輯朋友",
			footer: false,
			inputDisable: false,
		},
		DELETE: {
			confirm: {
				click: function(){
					FriendManager.remove($scope.model);
					$scope.modal.hide();
				},
				name: "刪除",
			},
			cancel: {
				click: function(){
					clickTime = new Date();
					$scope.modal.hide();
				},
				name: "取消",
			},
			title: "刪除朋友",
			footer: false,
			inputDisable: true,
		},
		LOOK: {
			confirm: {
				click: function(){
					$scope.onFriendClick($scope.states.EDIT, $scope.model);
				},
				name: "編輯",
			},
			cancel: {
				click: function(){
					clickTime = new Date();
					$scope.modal.hide();
				},
				name: "返回",
			},
			title: "朋友",
			footer: true,
			inputDisable: true,
		},
	}
	
	$scope.loading = false;
	$scope.friends = FriendManager.list();
	$scope.getCount = FriendManager.count;
	//$scope.friends = {1: {id: 1, name: "keming", phone: "0961276368", birthday: "80-09-12", email: "believe75467@gmail.com"}};
	//$scope.getCount = function(){return Object.keys($scope.friends).length};
	
	$scope.model = {};
	$scope.state = $scope.states.CREATE;
	
	$ionicModal.fromTemplateUrl('Friend.html', function(modal) {
    	$scope.modal = modal;
	}, {
		scope: $scope,
		animation: 'slide-in-up'
	});

	$scope.rightButtons = [{
		type: 'button-positive',
		content: "<i class='icon ion-plus'></i>",
		tap: function(){
			$scope.preventDefault();
			$scope.onFriendClick($scope.states.CREATE, {});
		},
	}];

	$scope.leftButtons = [{
		type: 'button-positive',
		content: "<i class='icon ion-refresh'></i>",
		tap: function(){
			$scope.preventDefault();
			$scope.loading = true;
			setFriendsFromContacts();
		}
	}];
	
	function setFriendsFromContacts() {
        var options = new ContactFindOptions();
        options.multiple = true;
        options.filter = "";
        var fields = ["displayName", "phoneNumbers", "emails", "birthday"];
        Contacts.find(fields, onSetFriendsFromContactsSuccess, onSetFriendsFromContactsError, options);
	};

    function onSetFriendsFromContactsSuccess(contactArray) {
        for (var i = 0, max = contactArray.length; i < max; i++) {
        	var contactName = contactArray[i].displayName;
        	var mobileNumber = getMobileNumber(contactArray[i].phoneNumbers);
        	if (!contactName || !mobileNumber)
        		continue;

            var friend = {
                name: contactName,
                phone: mobileNumber.replace(/-/g, "").replace(/ /g, ""),
                email: (contactArray[i].emails && contactArray[i].emails.length > 0) ? contactArray[i].emails[0].value : "",
                birthday: contactArray[i].birthday,
            };
			$scope.loading = false;
            FriendManager.add(friend);
        }
    };
	
	function getMobileNumber(phoneNumbers) {
		if (!(phoneNumbers instanceof Array))
			return null;
		for (var i = 0, max = phoneNumbers.length; i < max; i++) {
			if (phoneNumbers[i].type == 'mobile')
				return phoneNumbers[i].value;
		}
		return null;
	};
    
    function onSetFriendsFromContactsError(e) {
		$scope.loading = false;
        console.log(JSON.stringify(e));
    };

	$scope.onFriendClick = function(state, friend){
		clickTime = new Date();
		$scope.state = state;
		$scope.model = friend;
		$scope.modal.show();
	};
	
	$scope.onPhoneClick = function() {
		$window.open("tel:"+ $scope.model.phone);
	};

	$scope.onSMSClick = function() {
		var message = $scope.model.name + "：真高興，你又長了一歲。祝你生日快樂，永遠快樂！";
		$window.sms.send($scope.model.phone, message, "INTENT");
		//$window.open("sms:"+ $scope.model.phone + "?body=" + message);
	};
	
	$scope.onEmailClick = function() {
		var subject = "生日快樂！";
		var message = $scope.model.name + "：真高興，你又長了一歲。祝你生日快樂，永遠快樂！";
		$window.plugins.emailComposer.showEmailComposer(subject, message, [$scope.model.email], [], [], true, []);
		//$window.open('mailto:' + $scope.model.email + '?subject=' + subject + '&body=' + message);
	};

	$scope.preventDefault = function(){
		if((new Date()) - clickTime < 1000 || $scope.loading){
			throw "click too short!!!";
		}
	};
});