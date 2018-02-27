// SPDX-License-Identifier: Apache-2.0

'use strict';

var app = angular.module('application');

// Angular Controller
app.controller('parkingtimeCtrl', function($scope, moment, geohash, parkingspotService){
	// var vm = this;

	
	$scope.lastTransactionId = "-";

	$scope.parkingspotQuery = {
		"x": 58.3642546,
		"y": 26.7413746,
		"zoom": 14,
		"startTime": moment().toISOString(true),
		"endTime": moment().add(1, 'hour').toISOString(true)
	}
	$scope.parkingspotQueryResults = [];

	angular.extend($scope, {
				center: {
						lat: 58.3642546,
						lng: 26.7413746,
						zoom: 14
				},
				defaults: {
						scrollWheelZoom: false
				},
        events: {
            map: {
                enable: ['zoomstart', 'drag'],
                logic: 'emit'
            }
        }
		});

	$scope.search = function(parkingspotQuery){
		parkingspotQuery.x = $scope.center.lat;
		parkingspotQuery.y = $scope.center.lng;
		parkingspotQuery.zoom = 2;

		var result = parkingspotService.searchParkingspot(parkingspotQuery);
		result.then(parkingspotResult => {
			console.log(parkingspotResult);
			$scope.parkingspotQueryResults.splice(0, $scope.parkingspotQueryResults.length);
			$scope.parkingspotQueryResults = parkingspotResult;
			
			var data = [];
			var geoHash = geohash.encode(parkingspotQuery.x, parkingspotQuery.y, parkingspotQuery.zoom);
			var bboxArr = geohash.decode_bbox(geoHash);
			var bbox = {
				minlat: bboxArr[0],
				minlon: bboxArr[1],
				maxlat: bboxArr[2],
				maxlon: bboxArr[3],
			};
			console.log(geoHash);
			console.log(bbox);
			//[minlat, minlon, maxlat, maxlon]
			data.push(
				{
					"type": "Feature",
					"geometry": {
						"type": "Polygon",
						"coordinates": [[
							[bbox.minlon, bbox.minlat],
							[bbox.minlon, bbox.maxlat],
							[bbox.maxlon, bbox.maxlat],
							[bbox.maxlon, bbox.minlat],
							[bbox.minlon, bbox.minlat]
						]]
					},
					"properties": {
						"name": "SEARCHAREA"
					}
				}
			);

			parkingspotResult.forEach(function(item){
				var location = item.parkingspot.location;
			  data.push(
					{
					  "type": "Feature",
					  "geometry": {
					    "type": "Point",
					    "coordinates": [location.y, location.x]
					  },
						"properties": {
					    "name": item.parkingspot.name
					  }
					}
				);
			});
			var gJson = { 
				"type": "FeatureCollection",
    		"features": data
			};
			console.log("GeoJSON: %s", JSON.stringify(gJson));
		angular.extend($scope, {
											geojson: {
													data: gJson,
													style: {
														radius: 8,
												    fillColor: "#ff7800",
												    color: "#000",
												    weight: 1,
												    opacity: 1,
												    fillOpacity: 0.1
													}
											}
									});
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
