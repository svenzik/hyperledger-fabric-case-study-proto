// SPDX-License-Identifier: Apache-2.0

'use strict';

var app = angular.module('application');

// Angular Controller
app.controller('parkingspotAdminCtrl', function($scope, $routeParams, $location, parkingspotService, userService){
	// var vm = this;
	$scope.lastTransactionId = "-";
	
	var userId = $routeParams.id;

	$scope.allParkingspots = [];
	
	$scope.newParkingspot = {
		"id":"xxx",
		"name": "xxx",
		"location": {
			"x": 58.3785427,
			"y": 26.7143264
		},
		"costPerMinute": {
			"amount": 10,
			"currencyName": "EUR"
		}
	};


	$scope.search = function(userId){
		var result = parkingspotService.getUserParkingspots($scope.userId);
		result.then(parkingspotResult => {
			$scope.allParkingspots = parkingspotResult;
		}).catch(err => {
			$scope.$emit('errorMessage', "Internal error: " + err.message);
		});
		$scope.allParkingspots = [];		
		// $scope.newParkingspot = {};
	}
	
	$scope.editParkingspot = function(parkingspot){
		console.log("Selected parkingspot");
		console.log(JSON.stringify(parkingspot));
		$scope.newParkingspot = parkingspot;
	}
	
	$scope.saveParkingspot = function(parkingspot){
		parkingspot.owner = userService.getCurrentUser();
		parkingspotService.saveParkingspot(parkingspot)
		.then(parkingspotResult => {
			$scope.editParkingspot({});
			$scope.search();
			$scope.lastTransactionId = parkingspotResult;
		}).catch(err => {
			$scope.$emit('errorMessage', "Internal error: " + err.message);
		});
	}

	$scope.parkingspotParkingtimes = function(parkingspot){
		$location.path('/parkingtimes/user/' + parkingspot.owner.id);
	}
	
	// $scope.search();
	// var userId = 0;
	userService.login(userId)
		.then(user => {
			$scope.userId = user.id;
			// $scope.search(user.id);
			$scope.search($scope.userId);
		}).catch(err => console.log(err));
	// $scope.userId = userService.getCurrentUser().id;
});
