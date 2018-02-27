// SPDX-License-Identifier: Apache-2.0

'use strict';

var app = angular.module('application');

// Angular Factory
app.factory('parkingspotService', function(apiService){

	var factory = {};

	factory.getApiPath = function(restEndpoint, moment){
		var API_PATH = '/api';
		return API_PATH + restEndpoint;
	}

	factory.searchParkingspot = function(parkingspotQuery){
		var s = parkingspotQuery;
		// s.startTime = moment(s.startTime).toISOString();
		// s.endTime = moment(s.endTime).toISOString();

		return apiService.get(`/parkingspot/search/reservation/x/${s.x}/y/${s.y}/zoom/${s.zoom}/startTime/${s.startTime}/endTime/${s.endTime}/`)
		.then(result => {
			return result.data;
		});
	}

	factory.getParkingspot = function(parkingspotId) {
		return apiService.get(`/parkingspot/${parkingspotId}`)
		.then(result => {
			return result.data;
		}).catch(err => {
			throw new Error(err.data.error);
		});
	}

	factory.saveParkingspot = function(parkingspot, callback){
		return apiService.post(`/parkingspot/${parkingspot.id}`, parkingspot)
		.then(result => {
			return result.data;
		}).catch(err => {
			throw new Error(err.data.error);
		});
	}
	
	factory.getUserParkingspots = function(ownerId) {
		return apiService.get(`/parkingspot/owner/${ownerId}`)
		.then(result => {
			return result.data;
		});
	}
	
	factory.getParkingtimes = function(parkingspotId) {
		return apiService.get(`/parkingspot/${parkingspotId}/parkingtimes`)
		.then(result => {
			return result.data;
		}).catch(err => {
			throw new Error(err.data.error);
		});
	}

	factory.saveParkingtime = function(parkingtime) {
		parkingtime.parkingStart = moment(parkingtime.parkingStart).toISOString();
		parkingtime.parkingEnd =  moment(parkingtime.parkingEnd).toISOString();

		return apiService.post(`/parkingtime/${parkingtime.id}`, parkingtime)
		.then(result => {
			return result.data;
		}).catch(err => {
			throw new Error(err.data.error);
		});
	}
	
	factory.saveParkingtimeReservation = function(parkingtime) {
		parkingtime.parkingStart = moment(parkingtime.parkingStart).toISOString();
		parkingtime.parkingEnd =  moment(parkingtime.parkingEnd).toISOString();
console.log(parkingtime);
		return apiService.post(`/parkingtime/${parkingtime.id}/reserve`, parkingtime)
		.then(result => {
			return result.data;
		}).catch(err => {
			throw new Error(err.data.error);
		});
	}

	factory.saveParkingspotOpenHours = function(parkingtime) {
		parkingtime.parkingStart = moment(parkingtime.parkingStart).toISOString();
		parkingtime.parkingEnd =  moment(parkingtime.parkingEnd).toISOString();
		
		// return apiService.post(`/parkingspot/${parkingtime.parkingspot.id}/open`, parkingtime)
		return apiService.post(`/parkingspot/${parkingtime.id}/open`, parkingtime)
		.then(result => {
			return result.data;
		}).catch(err => {
			throw new Error(err.data.error);
		});
	}

	return factory;
});
