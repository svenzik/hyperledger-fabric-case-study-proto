'use strict';

var app = angular.module('application');

// Angular Factory
app.factory('moment', function($window){

	// if(!$window.moment){
  //   $window.moment = {};
  // } 
	// $window.moment.toISOZString = function(dateString) {
	// 	var utcDateString = new Date(Date.parse(dateString)).toUTCString();
	// 	return new Date(Date.parse(utcDateString)).toISOString()
	// }
  
	return $window.moment;
	
});
