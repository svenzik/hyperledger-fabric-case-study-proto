//SPDX-License-Identifier: Apache-2.0

var tuna = require('./controller.js');
var hyperledgerService = require('./hyperledger-service.js');

module.exports = function(app){

	app.get('/api/get_tuna/:id', function(req, res){
		tuna.get_tuna(req, res);
	});
	app.get('/api/add_tuna/:tuna', function(req, res){
		tuna.add_tuna(req, res);
	});
	app.get('/api/get_all_tuna', function(req, res){
		tuna.get_all_tuna(req, res);
	});
	app.get('/api/change_holder/:holder', function(req, res){
		tuna.change_holder(req, res);
	});

	app.get('/api/users/', function(req, res){
		hyperledgerService.get('GetUsers', [], res);
	});
	app.get('/api/user/:id', function(req, res){
		hyperledgerService.get('GetUser', [req.params.id], res);
	});
	app.put('/api/user/:id', function(req, res){
		hyperledgerService.put('SetUser', req.params.id, req.body, res);
	});
	app.get('/api/huser/:username', function(req, res){
		hyperledgerService.createHyperledgerFabricUserContext(req.params.username, res);
	});
	app.get('/api/login/:username', function(req, res){
		hyperledgerService.login( req.params.username, res);
	});

	// parkingspot
	app.get('/api/parkingspot/:id', function(req, res){
		hyperledgerService.get('GetParkingspot', [req.params.id], res);
	});
	app.post('/api/parkingspot/:id/open', function(req, res){
		hyperledgerService.put('saveParkingtimeOpenTime', req.params.id, req.body, res);
	});
	app.get('/api/parkingspot/owner/:ownerId', function(req, res){
		var searchQuery = {
			"name": ".*",
			"ownerId": req.params.ownerId
		};
		hyperledgerService.get('FindParkingspot', [searchQuery], res);
	});
	app.get('/api/parkingspot/:id/parkingtimes', function(req, res){
		hyperledgerService.get('getParkingtimesForParkingspot', [req.params.id], res);
	});
	app.put('/api/parkingspot/:id/endparking', function(req, res){
		hyperledgerService.get('EndParking', [req.params.id], res);
	});

	app.get('/api/parkingspot/search/reservation/x/:x/y/:y/startTime/:startTime/endTime/:endTime/', function(req, res){
		// "x": req.params.x,
		// "y": req.params.y,
		var searchParameter = {
			"parkingStart": req.params.startTime,
			"parkingEnd": req.params.endTime
		};
		// hyperledgerService.get('findByQuery', searchParameter , res);
		hyperledgerService.get('findBetweenTime', [searchParameter.parkingStart, searchParameter.parkingEnd] , res);
		// hyperledgerService.get('FindParkingspot', searchParameter, res);
		// hyperledgerService.get('FindParkingspot', searchParameter, res);
	});
	

	app.post('/api/parkingtime/:id', function(req, res){
		hyperledgerService.put('saveParkingtime', req.params.id, req.body, res);
	});
	app.post('/api/parkingtime/:id/reserve', function(req, res){
		hyperledgerService.put('saveReservation', req.params.id, req.body, res);
	});
}
