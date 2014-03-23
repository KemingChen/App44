app.controller('HelloSQLiteCtrl', function($scope, $ionicModal, DBManager, Notification, Contacts) {
	$scope.CREATE: 0;
	$scope.EDIT: 1;
	$scope.DELETE: 2;

	$scope.friendArray = [];
	$scope.model = {};
	$scope.selectedIndex;
	$scope.state = state.CREATE;
	
	$scope.rightButtons = [{
		type: 'button-positive',
		content: "<i class='icon ion-plus'></i>",
		tap: setFriendsFromContacts
	}];

	$ionicModal.fromTemplateUrl('EditFriend.html', function(modal) {
    	$scope.modal = modal;
	}, {
		scope: $scope,
		animation: 'slide-in-up'
	});

	function getFriendsSuccess(tx, res) {
		for (var i = 0, max = res.rows.length; i < max; i++) {
			$scope.friendArray.push(res.rows.item(i));
		}
	};
	
	function setFriendsFromContacts() {
        var options = new ContactFindOptions();
        options.multiple = true;
        options.filter = "";
        var fields = ["displayName", "phoneNumbers", "emails", "birthday"];
        Contacts.find(fields, onSetFriendsFromContactsSuccess, showError, options);
	};

    function onSetFriendsFromContactsSuccess(contactArray) {
    	//console.log(JSON.stringify(contactArray));
        for (var i = 0, max = contactArray.length; i < max; i++) {
        	var contactName = contactArray[i].displayName;
        	var mobileNumber = getMobileNumber(contactArray[i].phoneNumbers);
        	if (!contactName || !mobileNumber)
        		continue;

            var friend = {
                name: contactName,
                phone: mobileNumber,
                email: (contactArray[i].emails && contactArray[i].emails.length > 0) ? contactArray[i].emails[0].value : "",
                birthday: contactArray[i].birthday
            };
            DBManager.addFriend(friend);
        }
        $scope.init();
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
    
    function showError(e) {
        console.log(JSON.stringify(e));
    };

    $scope.init = function(){
    	$scope.friendArray = [];
    	DBManager.getFriends(getFriendsSuccess);
    };

    $scope.onCreateClick = function() {
		if (!$scope.model.name || !$scope.model.phone) {
			Notification.alert("請輸入姓名及電話", null, '警告', '確定');
			return;
		}

		var friend = angular.copy($scope.model);
		$scope.model = {};

		DBManager.addFriend(friend, function() {
			$scope.friendArray.push(friend);
	    });
		$scope.modal.hide();
	};
	
	$scope.onEditClick = function() {
		var friend = angular.copy($scope.model);
		$scope.model = {};
		$scope.state = state.CREATE;

		DBManager.updateFriend(friend, function() {
			$scope.friendArray[$scope.selectedIndex] = friend;
		});
		$scope.modal.hide();
	};
	
	$scope.onDeleteFriendClick = function(index) {
		$scope.state = state.DELETE;
		$scope.model = angular.copy($scope.friendArray[index]);
		$scope.selectedIndex = index;
		$scope.modal.show();
	};
	
	$scope.onEditFriendClick = function(index) {
		$scope.state = state.EDIT;
		$scope.model = angular.copy($scope.friendArray[index]);
		$scope.selectedIndex = index;
		$scope.modal.show();
	};
	
	$scope.onDeleteClick = function() {
		DBManager.deleteFriend($scope.model.id, function(){
			$scope.friendArray.splice($scope.selectedIndex, 1);
		});
		$scope.model = {};
		$scope.state = state.CREATE;
		$scope.modal.hide();
	};
	
	$scope.onCancelClick = function() {
		$scope.model = {};
		$scope.state = $scope.CREATE;
		$scope.modal.hide();
	};
});