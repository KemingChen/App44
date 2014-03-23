app.controller('HelloSQLiteCtrl', function($scope, DBManager, Notification, Contacts) {
	$scope.CREATE = 0;
	$scope.EDIT = 1;
	$scope.DELETE = 2;

	$scope.friendArray;
	$scope.model = {};
	$scope.selectedIndex;
	$scope.state = $scope.CREATE;
	
	$scope.init = function() {
		$scope.friendArray = [];
		DBManager.getFriends($scope.getFriendsSuccess);
    };
    
	$scope.getFriendsSuccess = function (tx, res) {
		for (var i = 0, max = res.rows.length; i < max; i++) {
			$scope.friendArray.push(res.rows.item(i));
		}
	};
	
	$scope.onCreateClick = function() {
		if (!$scope.model.name || !$scope.model.phone) {
			Notification.alert("請輸入姓名及電話", null, '警告', '確定');
			return;
		}
		var friend = {
			name: $scope.model.name,
			phone: $scope.model.phone,
			email: $scope.model.email,
			birthday: $scope.model.birthday
		};
		DBManager.addFriend(friend, function() {
			$scope.friendArray.push(friend);
	    });
		$scope.model = {};
	};
	
	$scope.onEditFriendClick = function(index) {
		$scope.state = $scope.EDIT;
		$scope.model = angular.copy($scope.friendArray[index]);
		$scope.selectedIndex = index;
	};
	
	$scope.onEditClick = function() {
		var friend = angular.copy($scope.model);
		DBManager.updateFriend(friend, function() {
			$scope.friendArray[$scope.selectedIndex] = friend;
		});
		$scope.model = {};
		$scope.state = $scope.CREATE;
	};
	
	$scope.onDeleteFriendClick = function(index) {
		$scope.state = $scope.DELETE;
		$scope.model = angular.copy($scope.friendArray[index]);
		$scope.selectedIndex = index;
	};
	
	$scope.onDeleteClick = function() {
		DBManager.deleteFriend($scope.model.id, function() {
			$scope.friendArray.splice($scope.selectedIndex, 1);
		});
		$scope.model = {};
		$scope.state = $scope.CREATE;
	};
	
	$scope.onCancelClick = function() {
		$scope.model = {};
		$scope.state = $scope.CREATE;
	};
	
	$scope.setFriendsFromContacts = function() {
        var options = new ContactFindOptions();
        options.multiple = true;
        options.filter = "";
        var fields = ["displayName", "phoneNumbers", "emails", "birthday"];
        Contacts.find(fields, $scope.onSetFriendsFromContactsSuccess, $scope.onSetFriendsFromContactsError, options);
	};

    $scope.onSetFriendsFromContactsSuccess = function(contactArray) {
        for (var i = 0, max = contactArray.length; i < max; i++) {
        	var contactName = contactArray[i].displayName;
        	if (!contactName)
        		continue;
        	var mobileNumber = getMobileNumber(contactArray[i].phoneNumbers);
        	if (!mobileNumber)
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
	
	var getMobileNumber = function(phoneNumbers) {
		if (!(phoneNumbers instanceof Array))
			return null;
		for (var i = 0, max = phoneNumbers.length; i < max; i++) {
			if (phoneNumbers[i].type == 'mobile')
				return phoneNumbers[i].value;
		}
		return null;
	};
    
    $scope.onSetFriendsFromContactsError = function(e) {
        console.log(e);
    };
	    
	$scope.newFriendsButton = [{
		type: 'button-positive',
		content: "<i class='icon ion-plus'></i>",
		tap: $scope.setFriendsFromContacts
	}];
});