// SPDX-License-Identifier: Apache-2.0

'use strict';

var app = angular.module('application');

// Angular Controller
app.controller('parkingspotCtrl', function($scope, $routeParams, parkingspotService, userService){
	// var vm = this;
	$scope.lastTransactionId = "-";
	
	var userId = $routeParams.id;

	$scope.allParkingspots = [];
	$scope.parkingSpotParkingTimes = [];
	$scope.selectedParkingspot = {
		"id": 0,
		"name": "-",
		"location" : {
			"x": 58.3784358,
			"y": 26.7144926,
		},
		"costPerMinute": {
			"amount": 0,
			"currencyName": "EUR"
		},
		"owner" : userService.getCurrentUser()
	}
	
	$scope.newParkingtime = {
		"id":"201",
		"parkingEnd": new Date().toISOString(),
		"parkingStart": new Date().toISOString(),
		"costPerMinute": 10
	};

	$scope.search = function(){
		var result = parkingspotService.getUserParkingspots($scope.userId);
		result.then(parkingspotResult => {
			$scope.allParkingspots = parkingspotResult;
		}).catch(err => {
			$scope.$emit('errorMessage', "Internal error: " + err.message);
		});
		$scope.parkingSpotParkingTimes = [];		
		$scope.newParkingtime = {};
	}

	$scope.showParkingspotSchedule = function(parkingspot){
		parkingspotService.getParkingtimes(parkingspot.id)
		.then(parkingtimesList => {
			parkingtimesList.sort(function(a, b) {
				return new Date(b.parkingStart) -  new Date(a.parkingStart);
			});
			$scope.parkingSpotParkingTimes = parkingtimesList;
		}).catch(err => {
			$scope.$emit('errorMessage', "Internal error: " + err.message);
		});
		$scope.editSchedule({
			"id":"xxx",
			"parkingStart": new Date().toISOString(),
			"parkingEnd": new Date().toISOString(),
			"costPerMinute": parkingspot.costPerMinute.amount,
			"parkingspot": parkingspot
		});
	}
	
	$scope.editSchedule = function(parkingtime){
		console.log("Selected parkingtime");
		console.log(JSON.stringify(parkingtime));
		$scope.newParkingtime = parkingtime;
	}
	
	$scope.saveParkingtime = function(parkingtime){
		parkingspotService.saveParkingtime(parkingtime)
		.then(parkingtimeResult => {
			$scope.showParkingspotSchedule(parkingtime.parkingspot);
			$scope.editSchedule({});
			$scope.lastTransactionId = parkingtimeResult;
		}).catch(err => {
			$scope.$emit('errorMessage', "Internal error: " + err.message);
		});
	}
	
	$scope.saveParkingtimeReservation = function(parkingtime){
		parkingspotService.saveParkingtimeReservation(parkingtime)
		.then(parkingtimeResult => {
			$scope.showParkingspotSchedule(parkingtime.parkingspot);
			$scope.editSchedule({});
			$scope.lastTransactionId = parkingtimeResult;
		}).catch(err => {
			$scope.$emit('errorMessage', "Internal error: " + err.message);
		});
	}

	$scope.saveParkingspotOpenHours = function(parkingtime){
		parkingspotService.saveParkingspotOpenHours(parkingtime)
		.then(parkingtimeResult => {
			$scope.showParkingspotSchedule(parkingtime.parkingspot);
			$scope.editSchedule({});
			$scope.lastTransactionId = parkingtimeResult;
		}).catch(err => {
			$scope.$emit('errorMessage', "Internal error: " + err.message);
		});
	}

	// $scope.search();
	// var userId = 0;
	userService.login(userId)
		.then(user => {
			$scope.userId = user.id;
			// $scope.search(user.id);
			$scope.search(userService.getCurrentUser().id);
		}).catch(err => console.log(err));
	// $scope.userId = userService.getCurrentUser().id;
});
