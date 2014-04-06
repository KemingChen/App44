angular.module('iLabBirthdayLine', []).factory('iLabMessage', function ($http) {
	var iLabServiceUrl = 'http://140.124.183.158:7828/api/Message';
	
	return {
    	sendMessage: function(senderPhone, receiverPhone, message) {
    		var messageData = {
                SenderPhone: senderPhone,
                ReceiverPhone: receiverPhone,
                Message: message
            };
    		
    		var send = $http({
                method: 'POST',
                url: iLabServiceUrl,
                data: messageData
            });
    		
    		send.success(function(response, status, headers, config){
    			console.log("發送成功");
    		});
    		
    		send.error(function(response, status, headers, config) {
    		    console.log("發送失敗，原因:"+response);
    		});
        }
    };
});

angular.module('iLabBirthdayLine').factory('iLabMember', function ($rootScope, $window, $http) {
	var iLabServiceUrl = 'http://140.124.183.158:7828/api/Member';
	
	return {
        isMember: function(phone, onSuccess, onError) {
			var check = $http({
				method: 'GET',
				url: iLabServiceUrl,
				params: {phone: phone}
			});
			check.success(function(response, status, headers, config){
    			(onSuccess || angular.noop)(response);
    		});
			check.error(function (response, status, headers, config){
    			(onError || angular.noop)(false);
    		});
        },
	    
	    register: function(host, onSuccess, onError) {
	    	var hostData = {
    			Phone: host.phone,
    			DeviceType: host.type,
    			DeviceToken: host.token
    		};
	        	
    		var add = $http({
    			method: 'POST',
    			url: iLabServiceUrl,
    			data: hostData
    		});
	    		
    		add.success(function(response, status, headers, config){
    			(onSuccess || angular.noop)(response);
    		});
	    		
    		add.error(function (response, status, headers, config){
    			(onError || angular.noop);
    		});
	    },
	    
	    unregister: function(phone, onSuccess, onError) {
        	var remove = $http({
    			method: 'DELETE',
    			url: iLabServiceUrl,
    			params: {
    				phone: phone
    			}
    		});
        	remove.success(function(response, status, headers, config){
    			(onSuccess || angular.noop)(response);
    		});
        	remove.error(function (response, status, headers, config){
    			(onError || angular.noop)(false);
    		});
        }
	};
});