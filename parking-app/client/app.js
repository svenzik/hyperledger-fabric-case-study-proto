// SPDX-License-Identifier: Apache-2.0

'use strict';

var app = angular.module('application', ['ngRoute']);
var API_PATH = '/api';

// Angular Controller
app.controller('appController', function($scope, appFactory){

});

// Angular Factory
app.factory('appFactory', function($http){

	var factory = {};

	factory.getApiPath = function(restEndpoint){
			return API_PATH + restEndpoint;
	}

  factory.queryAllTuna = function(callback){

    	$http.get(factory.getApiPath('/get_all_tuna/')).success(function(output){
			callback(output)
		});
	}

	factory.queryTuna = function(id, callback){
    	$http.get(factory.getApiPath('/get_tuna/'+id)).success(function(output){
			callback(output)
		});
	}

	factory.recordTuna = function(data, callback){

		// data.location = data.longitude + ", "+ data.latitude;
		/*
		var tuna = data.id + "-" + data.location + "-" + data.timestamp + "-" + data.holder + "-" + data.vessel + "-" + data.parkingspot;
		$http.get('/add_tuna/'+tuna).success(function(output){
			callback(output)
		});
		*/
		var tuna = JSON.stringify(data);

		$http.post(factory.getApiPath('/add_tuna/'), tuna)
			.success(function(output){
				callback(output)
			});
	}

	factory.changeHolder = function(data, callback){

		var holder = data.id + "-" + data.name;

    	$http.get(factory.getApiPath('/change_holder/'+holder)).success(function(output){
			callback(output)
		});
	}

	return factory;
});

app.config(function($routeProvider) {
	    $routeProvider
	    .when("/", {
		        templateUrl : "main.html",
		    		controller : "mainController"
		        })
	    .when("/main", {
		        templateUrl : "main.html",
		    		controller : "mainController"
		        })
	    .when("/search", {
		            templateUrl : "search.html"
		        })
			.when("/user", {
		            templateUrl : "user.html",
								controller : "userCtrl"
		        })
	    .when("/parkingtime", {
		            templateUrl : "parkingtime.html"
		        })
	    .when("/about", {
		            template : "About Parking app."
		        })
	    .otherwise({templateUrl: 'todo.html'});;
});
