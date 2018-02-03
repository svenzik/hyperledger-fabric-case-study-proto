// SPDX-License-Identifier: Apache-2.0

'use strict';

var app = angular.module('application');

// Angular Factory
app.factory('userService', function($http){

	var factory = {};

	factory.getApiPath = function(restEndpoint){
		var API_PATH = '/api';
		return API_PATH + restEndpoint;
	}

	factory.getAllUsers = function(callback){
			$http.get(factory.getApiPath('/users/')).success(function(output){
			callback((output))
		});
	}

	factory.getUser = function(id, callback){
			$http.get(factory.getApiPath('/user/'+id)).success(function(output){
			callback(output)
		});
	}

	factory.saveUser = function(user, callback){
		var data = JSON.stringify(user);
		console.log("SaveUser:" + data);
		Promise.all([
			$http.get(factory.getApiPath('/huser/' + user.name), data), 
			$http.put(factory.getApiPath('/user/' + user.id), data),
			$http.get(factory.getApiPath('/user/' + user.id))
		]).then(results => {
			console.log("Adding user: " + user);
			results.forEach(
				function(httpResponse,status){
					console.log(`${JSON.stringify(status)} -> ${JSON.stringify(httpResponse.data)}`);
				}
			)
			var txIdAndUser = results.slice(-2);
			var user = txIdAndUser.pop().data;
			var txId = txIdAndUser.pop().data;
			callback(txId, user);
	}).catch(err => { 
		console.log(err);
		throw err;
	});
	// $http.put(factory.getApiPath('/user/' + user.id), data)
	// 	.success(function(output){
	// 		callback(output)
	// 	});
	}
	
	return factory;
});
