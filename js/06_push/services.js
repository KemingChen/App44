app.factory('DBManager', function($window, PhoneGap) {
	var db = null;
    PhoneGap.ready(function() {
        db = $window.sqlitePlugin.openDatabase({name: "BirthdayLineDB"});
        db.transaction(function(tx) {
            tx.executeSql("CREATE TABLE IF NOT EXISTS friends(id INTEGER PRIMARY KEY ASC, name TEXT, phone TEXT UNIQUE, email TEXT, birthday DATE, isMember BOOLEAN)", []);
        });
    });
    
    return {
        addFriend: function (friend, onSuccess, onError) {
        	PhoneGap.ready(function() {
	            db.transaction(function(tx) {
	                tx.executeSql("INSERT INTO friends(name, phone, email, birthday, isMember) VALUES (?, ?, ?, ?, ?)",
	                    [friend.name, friend.phone, friend.email, friend.birthday, friend.isMember],
	                    function(tx, res) {
	                		friend.id = res.insertId;
	                        (onSuccess || angular.noop)();
	                    }, function (e) {
	                        console.log('新增朋友失敗，原因: ' + e.message);
	    	            	console.log(JSON.stringify(friend));
	                        (onError || angular.noop)(e);
	                    }
	                );
	            });
        	});
        },
        
        updateFriend: function (friend, onSuccess, onError) {
        	PhoneGap.ready(function() {
	            db.transaction(function (tx) {
	                tx.executeSql("UPDATE friends SET name = ?, phone = ?, email = ?, birthday = ?, isMember = ? where id = ?",
	                    [friend.name, friend.phone, friend.email, friend.birthday, friend.isMember, friend.id],
	                    onSuccess,
	                    onError
	                );
	            });
        	});
        },
        
        deleteFriend: function (friend, onSuccess, onError) {
        	PhoneGap.ready(function() {
	            db.transaction(function(tx) {
	                tx.executeSql("delete from friends where id = ?", [friend.id],
	                	onSuccess,
	                    onError
	                );
	            });
        	});
        },
        
        getFriends: function (onSuccess, onError) {
        	PhoneGap.ready(function() {
        		db.transaction(function(tx) {
        			tx.executeSql("SELECT * FROM friends", [],
	        			onSuccess,
        				onError
    				);
            	});
            });
        }
    };
});

app.factory('FriendManager', function(DBManager, iLabMember) {
	var idIndexedFriends = {};
	var phoneIndexedFriends = {};
	DBManager.getFriends(function(tx, res) {
		for (var i = 0, max = res.rows.length; i < max; i++) {
			idIndexedFriends[res.rows.item(i).id] = res.rows.item(i);
			console.log(idIndexedFriends[res.rows.item(i).id].isMember);
		}
	});
	return {
		add: function(friend) {
			iLabMember.isMember(friend.phone, function(response) {
				friend.isMember = JSON.parse(response) ? 1 : 0;
				DBManager.addFriend(friend, function() {
					idIndexedFriends[friend.id] = friend;
				});
			}, function() {
				friend.isMember = 0;
				DBManager.addFriend(friend, function() {
					idIndexedFriends[friend.id] = friend;
				});
			});
		},
		edit: function(friend) {
			iLabMember.isMember(friend.phone, function(response) {
				friend.isMember = response ? 1 : 0;
				DBManager.updateFriend(friend, function() {
					idIndexedFriends[friend.id] = friend;
					phoneIndexedFriends[friend.phone] = friend;
				});
			}, function() {
				friend.isMember = 0;
				DBManager.updateFriend(friend, function() {
					idIndexedFriends[friend.id] = friend;
					phoneIndexedFriends[friend.phone] = friend;
				});
			});
		},
		remove: function(friend) {
			DBManager.deleteFriend(friend, function() {
				delete idIndexedFriends[friend.id];
			});
		},
		getById: function(id) {
			return idIndexedFriends[id];
		},
		getByPhone: function(phone) {
			if (phoneIndexedFriends[phone] == undefined) {
				for (var id in idIndexedFriends) {
					if (idIndexedFriends[id].phone == phone) {
						phoneIndexedFriends[phone] = idIndexedFriends[id];
						break;
					}
				}
			}
			return phoneIndexedFriends[phone];
		},
		list: function() {
			return idIndexedFriends;
		},
		count: function() {
			return Object.keys(idIndexedFriends).length;
		}
	};
  
});

app.factory('SettingManager', function($window) {
	if (!$window.localStorage['host'])
		$window.localStorage['host'] = "{}";
	return {
		setHost: function(host) {
			$window.localStorage['host'] = JSON.stringify(host);
		},
		getHost: function() {
			return JSON.parse($window.localStorage['host']);
		}
	};
});