// SPDX-License-Identifier: Apache-2.0

'use strict';

var app = angular.module('application', [
		'ngRoute', 
		'ui.bootstrap.datetimepicker',
		'leaflet-directive',
		'angular-geohash'
	]
);

var API_PATH = '/api';

// Angular Controller
app.controller('AppController', function($scope, appFactory){
	$scope.hasErrors = false;
	$scope.errors = [];
	$scope.closeAlert = function (index) {
			$scope.errors.splice(index, 1);
			if ($scope.errors.size() < 1) {
				$scope.hasErrors = false;
			}
	}
	$scope.showError = function (errorMessage) {
			$scope.errors.push(errorMessage);
			$scope.hasErrors = true;
	}
	
	$scope.$on("errorMessage", function (evnt, errorMessage) {
		$scope.showError(errorMessage);
	});
});

// Angular Factory
app.factory('appFactory', function($http){

	var factory = {};

	factory.getApiPath = function(restEndpoint){
			return API_PATH + restEndpoint;
	}

	factory.queryAllTuna = function(callback){

			$http.get(factory.getApiPath('/get_all_tuna/')).then(function(output){
			callback(output)
		});
	}

	factory.queryTuna = function(id, callback){
			$http.get(factory.getApiPath('/get_tuna/'+id)).then(function(output){
			callback(output)
		});
	}

	factory.recordTuna = function(data, callback){

		// data.location = data.longitude + ", "+ data.latitude;
		/*
		var tuna = data.id + "-" + data.location + "-" + data.timestamp + "-" + data.holder + "-" + data.vessel + "-" + data.parkingspot;
		$http.get('/add_tuna/'+tuna).then(function(output){
			callback(output)
		});
		*/
		var tuna = JSON.stringify(data);

		$http.post(factory.getApiPath('/add_tuna/'), tuna)
			.then(function(output){
				callback(output)
			});
	}

	factory.changeHolder = function(data, callback){

		var holder = data.id + "-" + data.name;

			$http.get(factory.getApiPath('/change_holder/'+holder)).then(function(output){
			callback(output)
		});
	}

	return factory;
});

app.config(function($routeProvider) {
			$routeProvider
			.when("/", {
								templateUrl : "users/user.html",
								controller : "userCtrl"
						})
			.when("/parkingspots/user/:id", {
								templateUrl : "parkingspots/parkingspot-admin.html",
								controller : "parkingspotAdminCtrl"
						})
			.when("/parkingtimes/user/:id", {
								templateUrl : "parkingspots/parkingspot-management.html",
								controller : "parkingspotCtrl"
						})
			.when("/search", {
								templateUrl : "parkingtime/parkingspot-reservation.html",
								controller : "parkingtimeCtrl"
						})
			.when("/user", {
								templateUrl : "users/user.html",
								controller : "userCtrl"
						})
			.when("/about", {
								template : "About Parking app."
						})
			.otherwise({templateUrl: 'todo.html'});;
});
