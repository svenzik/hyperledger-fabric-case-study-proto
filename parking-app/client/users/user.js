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
			var array = [];
			for (var i = 0; i < data.length; i++){
				parseInt(data[i].Key);
				data[i].Record.Key = parseInt(data[i].Key);
				array.push(data[i].Record);
			}
			array.sort(function(a, b) {
			    return parseFloat(a.Key) - parseFloat(b.Key);
			});
			$scope.allUsers = array;
		});
		$scope.allUsers.push({"id": 1, "name":"AAA"});
		$scope.allUsers.push({"id": 2, "name":"BBB"});
	}

	$scope.showUser = function(id){
		// console.log("showUser:" + id);
		$scope.selectedUser = {"id": id, "name":"show test"};
		// userService.getUser(id, function(data){
		// 	data.json = JSON.stringify(data);
		// 	$scope.selectedUser = data;
    //
		// 	if ($scope.query_tuna == "Could not locate tuna"){
		// 		console.log()
		// 		$("#error_query").show();
		// 	} else{
		// 		$("#error_query").hide();
		// 	}
		// });
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
