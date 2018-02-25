// SPDX-License-Identifier: Apache-2.0

'use strict';

var app = angular.module('application');

// Angular Controller
app.controller('parkingtimeCtrl', function($scope, moment, parkingspotService){
	// var vm = this;

	$scope.lastTransactionId = "-";

	$scope.parkingspotQuery = {
		"x": 0,
		"y": 0,
		"startTime": moment().toISOString(true),
		"endTime": moment().add(1, 'hour').toISOString(true)
	}
	$scope.parkingspotQueryResults = [];

	$scope.search = function(parkingspotQuery){
		var result = parkingspotService.searchParkingspot(parkingspotQuery);
		result.then(parkingspotResult => {
			console.log(parkingspotResult);
			$scope.parkingspotQueryResults.splice(0, $scope.parkingspotQueryResults.length);
			$scope.parkingspotQueryResults = parkingspotResult;
		}).catch(err => {
			$scope.$emit('errorMessage', "Internal error: " + err.getMessage());
		});
	}

	$scope.showParkingspot = function(parkingtime){
		console.log("GetParkingspot " + parkingtime.parkingspot.id);
		parkingspotService.getParkingspot(parkingtime.parkingspot.id)
		.then(parkingspot => {
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
		if (parkingtime.id === "xxx") {
			$scope.$emit('errorMessage', "Error: Change id from xxx to actual value");
			return;
		}
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
		if (parkingtime.id === "xxx") {
			$scope.$emit('errorMessage', "Error: Change id from xxx to actual value");
			return;
		}
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
