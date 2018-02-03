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
    hyperledgerService.get('GetUser', req.params.id, res);
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
}
