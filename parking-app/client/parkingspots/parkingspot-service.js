// SPDX-License-Identifier: Apache-2.0

'use strict';

var app = angular.module('application');

// Angular Factory
app.factory('parkingspotService', function(apiService){

	var factory = {};

	factory.getApiPath = function(restEndpoint){
		var API_PATH = '/api';
		return API_PATH + restEndpoint;
	}

	factory.searchParkingspot = function(parkingspotQuery){
		var s = parkingspotQuery;
		return apiService.get(`/parkingspot/search/reservation/x/${s.x}/y/${s.y}/startTime/${s.startTime.toISOString()}/endTime/${s.endTime.toISOString()}/`)
		.then(result => {
			return result.data;
		});
	}

	factory.saveParkingspot = function(user, callback){
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
