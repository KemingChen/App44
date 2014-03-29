app.factory('DBManager', function($window, PhoneGap) {
	var db = null;
    PhoneGap.ready(function() {
        db = $window.sqlitePlugin.openDatabase({name: "BirthdayLineDB"});
        db.transaction(function(tx) {
            tx.executeSql("CREATE TABLE IF NOT EXISTS friends(id INTEGER PRIMARY KEY ASC, name TEXT, phone TEXT UNIQUE, email TEXT, birthday DATE)", []);
        });
    });
    
    return {
        addFriend: function (friend, onSuccess, onError) {
        	PhoneGap.ready(function() {
	            db.transaction(function(tx) {
	                tx.executeSql("INSERT INTO friends(name, phone, email, birthday) VALUES (?, ?, ?, ?)",
	                    [friend.name, friend.phone, friend.email, friend.birthday],
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
	                tx.executeSql("UPDATE friends SET name = ?, phone = ?, email = ?, birthday = ? where id = ?",
	                    [friend.name, friend.phone, friend.email, friend.birthday, friend.id],
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

app.factory('FriendManager', function(DBManager) {
	var friends = {};
	DBManager.getFriends(function(tx, res) {
		for (var i = 0, max = res.rows.length; i < max; i++) {
			friends[res.rows.item(i).id] = res.rows.item(i);
		}
	});
	return {
		add: function(friend) {
			DBManager.addFriend(friend, function() {
				friends[friend.id] = friend;
			});
		},
		edit: function(friend) {
			DBManager.updateFriend(friend, function() {
				friends[friend.id] = friend;
			});
		},
		remove: function(friend) {
			DBManager.deleteFriend(friend, function() {
				delete friends[friend.id];
			});
		},
		get: function(id) {
			return friends[id];
		},
		list: function() {
			return friends;
		},
		count: function() {
			return Object.keys(friends).length;
		}
	};
  
});