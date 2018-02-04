// SPDX-License-Identifier: Apache-2.0

'use strict';

var app = angular.module('application');

// Angular Controller
app.controller('parkingspotCtrl', function($scope, parkingspotService){
	// var vm = this;

	$scope.lastTransactionId = "-";
	$scope.userError = "";

	var suggestedEndDate = new Date();
	suggestedEndDate.setHours(suggestedEndDate.getHours() + 1);
	$scope.parkingspotQuery = {
		"x": 0,
		"y": 0,
		"startTime": new Date(),
		"endTime": suggestedEndDate
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

	$scope.showUser = function(id){
		// console.log("showUser:" + id);
		// $scope.selectedUser = {"id": id, "name":"show test"};
		parkingspotService.getUser(id, function(data){
			data.json = JSON.stringify(data);
			$scope.selectedUser = data;
		});
	}

	$scope.saveUser = function(user){
		console.log("Saving");
		console.log(user);
		// $scope.selectedUser = {"id": -1, "name":"save test"};
		try {
			parkingspotService.saveUser(user, function(transactionId, data){
				$scope.lastTransactionId = transactionId;
				$scope.allUsers.push(data);
			});
		} catch(err) { 
			$scope.lastTransactionId = err.toString();
		}
	}

});
