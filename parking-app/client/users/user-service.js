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
			callback(output)
		});
	}

	factory.getUser = function(id, callback){
    	$http.get(factory.getApiPath('/user/'+id)).success(function(output){
			callback(output)
		});
	}

	factory.saveUser = function(data, callback){
		var user = JSON.stringify(data);
		$http.post(factory.getApiPath('/user/'), user)
			.success(function(output){
				callback(output)
			});
	}

	return factory;
});
