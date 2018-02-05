// SPDX-License-Identifier: Apache-2.0

'use strict';

var app = angular.module('application');

// Angular Controller
app.controller('parkingtimeCtrl', function($scope, parkingspotService){
	// var vm = this;

	$scope.lastTransactionId = "-";

	var suggestedEndDate = new Date();
	suggestedEndDate.setHours(suggestedEndDate.getHours() + 1);
	$scope.parkingspotQuery = {
		"x": 0,
		"y": 0,
		"startTime": new Date().toISOString(),
		"endTime": suggestedEndDate.toISOString()
	}
	$scope.parkingspotQueryResults = [];

	$scope.search = function(parkingspotQuery){
		var result = parkingspotService.searchParkingspot(parkingspotQuery);
		result.then(parkingspotResult => {
			console.log(parkingspotResult);
			$scope.parkingspotQueryResults = parkingspotResult;
		}).catch(err => {
			$scope.$emit('errorMessage', "Internal error: " + err.getMessage());
		});
	}

});
