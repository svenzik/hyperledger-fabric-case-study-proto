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
			console.log("Got JSON: %s", output);
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
		console.log(data);
		$http.put(factory.getApiPath('/user/' + user.id), data)
			.success(function(output){
				callback(output)
			});
	}

	return factory;
});
