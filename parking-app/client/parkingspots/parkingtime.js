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

	$scope.showParkingspot = function(parkingtime){
		console.log("GetParkingspot " + parkingtime.parkingspot.id);
		parkingspotService.getParkingspot(parkingtime.parkingspot.id)
		.then(parkingspot => {
			console.log("found parkingspot");
			console.log(parkingspot);
			$scope.newParkingtime = {
				"id":"xxx",
				"parkingStart": $scope.parkingspotQuery.startTime,
				"parkingEnd":$scope.parkingspotQuery.endTime,
				"costPerMinute": parkingtime.costPerMinute,
				"parkingspot": parkingspot
			};
		}).catch(err => {
			$scope.$emit('errorMessage', "Internal error: " + err.message);
		});
	}
	
	$scope.saveParkingtime = function(parkingtime){
		parkingspotService.saveParkingtime(parkingtime)
		.then(parkingtimeResult => {
			$scope.search($scope.parkingspotQuery);
			// $scope.showParkingspotSchedule(parkingtime.parkingspot.id);
			// $scope.editSchedule({});
			$scope.lastTransactionId = parkingtimeResult;
		}).catch(err => {
			$scope.$emit('errorMessage', "Internal error: " + err.message);
		});
	}

	$scope.saveParkingtimeReservation = function(parkingtime){
		parkingspotService.saveParkingtimeReservation(parkingtime)
		.then(parkingtimeResult => {
			$scope.search($scope.parkingspotQuery);
			// $scope.showParkingspotSchedule(parkingtime.parkingspot.id);
			// $scope.editSchedule({});
			$scope.lastTransactionId = parkingtimeResult;
		}).catch(err => {
			$scope.$emit('errorMessage', "Internal error: " + err.message);
		});
	}
	
});
