// SPDX-License-Identifier: Apache-2.0

'use strict';

var app = angular.module('application');

// Angular Factory
app.factory('apiService', function($http){

	var factory = {};

	factory.getApiPath = function(restEndpoint){
		var API_PATH = '/api';
		return API_PATH + restEndpoint;
	}

	factory.get = function(restEndpoint){
			return $http.get(factory.getApiPath(restEndpoint));
	}

	factory.put = function(restEndpoint, body){
		return $http.put(factory.getApiPath(restEndpoint), body);
	}
	
	factory.post = function(restEndpoint, body){
		return $http.post(factory.getApiPath(restEndpoint), body);
	}
	
	return factory;
});
