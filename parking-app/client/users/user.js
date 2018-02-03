// SPDX-License-Identifier: Apache-2.0

'use strict';

var app = angular.module('application');

// Angular Controller
app.controller('userCtrl', function($scope, userService){
	// var vm = this;

	$scope.lastTransactionId = "-";

	$scope.getAllUsers = function(){
		// console.log("getAllUsers");
		$scope.allUsers = [];
		userService.getAllUsers(function(data){
			var array = data;
			// var array = [];
			// for (var i = 0; i < data.length; i++){
				// parseInt(data[i].Key);
				// data[i].Record.Key = parseInt(data[i].Key);
				// array.push(data[i].Record);
			// }
			array.sort(function(a, b) {
					return parseFloat(a.Key) - parseFloat(b.Key);
			});
			$scope.allUsers = array;
		});
	}

	$scope.showUser = function(id){
		// console.log("showUser:" + id);
		// $scope.selectedUser = {"id": id, "name":"show test"};
		userService.getUser(id, function(data){
			data.json = JSON.stringify(data);
			$scope.selectedUser = data;
		});
	}

	$scope.saveUser = function(user){
		// $scope.selectedUser = {"id": -1, "name":"save test"};
		userService.saveUser(user, function(data){
			$scope.lastTransactionId = data;
			$scope.showUser(user.id)
		});
	}

	$scope.getAllUsers();
});
