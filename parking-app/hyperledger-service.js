//SPDX-License-Identifier: Apache-2.0

/*
	This code is based on code written by the Hyperledger Fabric community.
	Original code can be found here: https://github.com/hyperledger/fabric-samples/blob/release/fabcar/query.js
	and https://github.com/hyperledger/fabric-samples/blob/release/fabcar/invoke.js
 */

// call the packages we need
var express       = require('express');        // call express
// var app           = express();                 // define our app using express
var bodyParser    = require('body-parser');
var http          = require('http')
var fs            = require('fs');
var Fabric_Client = require('fabric-client');
var path          = require('path');
var util          = require('util');
var os            = require('os');

var Fabric_Client = require('fabric-client');
var Fabric_CA_Client = require('fabric-ca-client');

var HYPERLEDGER_APP_NAME='parking-app';
var HYPERLEDGER_APP_CHANNEL_NAME='mychannel';


module.exports = (function() {
return{
	get: function(methodName, params, res){
		console.log("HyperledgerService GET: %s(%s)", methodName, params);

		var fabric_client = new Fabric_Client();

		// setup the fabric network
		var channel = fabric_client.newChannel(HYPERLEDGER_APP_CHANNEL_NAME);
		var peer = fabric_client.newPeer('grpc://localhost:7051');
		channel.addPeer(peer);

		//
		var member_user = null;
		var store_path = path.join(os.homedir(), '.hfc-key-store');
		console.log(' + Store path:'+store_path);
		var tx_id = null;

		// create the key value store as defined in the fabric-client/config/default.json 'key-value-store' setting
		Fabric_Client.newDefaultKeyValueStore({ path: store_path
		}).then((state_store) => {
				// assign the store to the fabric client
				fabric_client.setStateStore(state_store);
				var crypto_suite = Fabric_Client.newCryptoSuite();
				// use the same location for the state store (where the users' certificate are kept)
				// and the crypto store (where the users' keys are kept)
				var crypto_store = Fabric_Client.newCryptoKeyStore({path: store_path});
				crypto_suite.setCryptoKeyStore(crypto_store);
				fabric_client.setCryptoSuite(crypto_suite);

				// get the enrolled user from persistence, this user will sign all requests
				return fabric_client.getUserContext('user1', true);
		}).then((user_from_store) => {
				if (user_from_store && user_from_store.isEnrolled()) {
						console.log(' + Successfully loaded %s from persistence', user_from_store.getName());
						member_user = user_from_store;
				} else {
						throw new Error('Failed to get '+user_from_store+'.... run registerUser.js');
				}

				var stringParams = params;
				if (params instanceof Array) {
					stringParams = params.map(el => {
						// console.log("Converting: ");
						// console.log(el);
						if(el instanceof Object) {
							// console.log("Converted: ");
							// console.log(JSON.stringify(el));
							return JSON.stringify(el);
						} else {
							return el;
						}
						
					});
				}
				console.log(" + Calling chaincode: " + methodName);
				console.log(stringParams);
				const request = {
						chaincodeId: HYPERLEDGER_APP_NAME,
						txId: tx_id,
						fcn: methodName,
						args: stringParams
				};

				// send the query proposal to the peer
				return channel.queryByChaincode(request);
		}).then((query_responses) => {
				console.log(" + Query has completed, checking results");
				// query_responses could have more than one  results if there multiple peers were used as targets
				if (query_responses && query_responses.length == 1) {
						if (query_responses[0] instanceof Error) {
								console.error("error from query = ", query_responses[0]);
								res.status(500).send({error: query_responses[0].toString()});
						
						} else {
								var resultJsonText = query_responses[0].toString();
								console.log(" + Response is:");
								console.log(resultJsonText);
								res.json(JSON.parse(resultJsonText));
								// res.json((query_responses[0].toString()));
						}
				} else {
						console.log(" + No payloads were returned from query");
				}
		}).catch((err) => {
				console.error('Failed to query successfully :: ' + err);
				res.status(500).send({error: err.toString()});
		});
	},
	put: function(methodName, id, model, res){
		var message_body = JSON.stringify(model);
		console.log("HyperledgerService PUT: %s(%s)", methodName, id);
		console.log(message_body);

		var fabric_client = new Fabric_Client();

		// setup the fabric network
		var channel = fabric_client.newChannel(HYPERLEDGER_APP_CHANNEL_NAME);
		var peer = fabric_client.newPeer('grpc://localhost:7051');
		channel.addPeer(peer);
		var order = fabric_client.newOrderer('grpc://localhost:7050')
		channel.addOrderer(order);

		var member_user = null;
		var store_path = path.join(os.homedir(), '.hfc-key-store');
		console.log(' + Store path:'+store_path);
		var tx_id = null;

		// create the key value store as defined in the fabric-client/config/default.json 'key-value-store' setting
		Fabric_Client.newDefaultKeyValueStore({ path: store_path
		}).then((state_store) => {
				// assign the store to the fabric client
				fabric_client.setStateStore(state_store);
				var crypto_suite = Fabric_Client.newCryptoSuite();
				// use the same location for the state store (where the users' certificate are kept)
				// and the crypto store (where the users' keys are kept)
				var crypto_store = Fabric_Client.newCryptoKeyStore({path: store_path});
				crypto_suite.setCryptoKeyStore(crypto_store);
				fabric_client.setCryptoSuite(crypto_suite);

				// get the enrolled user from persistence, this user will sign all requests
				return fabric_client.getUserContext('user1', true);
		}).then((user_from_store) => {
				if (user_from_store && user_from_store.isEnrolled()) {
						console.log(' + Successfully loaded %s from persistence', user_from_store.getName());
						member_user = user_from_store;
				} else {
						throw new Error('Failed to get '+user_from_store+'.... run registerUser.js');
				}

				// get a transaction id object based on the current user assigned to fabric client
				tx_id = fabric_client.newTransactionID();
				console.log(" + Assigning transaction_id: ", tx_id._transaction_id);

				// recordTuna - requires 5 args, ID, vessel, location, timestamp,holder - ex: args: ['10', 'Hound', '-12.021, 28.012', '1504054225', 'Hansel'],
				// send proposal to endorser
				const request = {
						//targets : --- letting this default to the peers assigned to the channel
						chaincodeId: HYPERLEDGER_APP_NAME,
						fcn: methodName,
						//args: [key, vessel, location, timestamp, holder, parkingspot],
						args: [id, message_body],
						chainId: HYPERLEDGER_APP_CHANNEL_NAME,
						txId: tx_id
				};

				// send the transaction proposal to the peers
				return channel.sendTransactionProposal(request);
		}).then((results) => {
				var proposalResponses = results[0];
				var proposal = results[1];
				let isProposalGood = false;
				if (proposalResponses && proposalResponses[0].response &&
						proposalResponses[0].response.status === 200) {
								isProposalGood = true;
								console.log(' + Transaction proposal was good');
						} else {
								console.error('Transaction proposal was bad');
								//throw new Error('Transaction proposal was bad: ' + proposalResponses[0].response.message);
								var resultJsonText = proposalResponses[0].toString();
								// console.log("================");
								// console.log(proposalResponses[0].toJson());
								// console.log("================");
								// console.error("Response is ", resultJsonText);
								// res.json(proposalResponses[0].response);
								res.status(501).send({error: proposalResponses[0].toString()});
								return;
						}
				if (isProposalGood) {
						console.log(util.format(
								' + Successfully sent Proposal and received ProposalResponse: Status - %s, message - "%s"',
								proposalResponses[0].response.status, proposalResponses[0].response.message));

						// build up the request for the orderer to have the transaction committed
						var request = {
								proposalResponses: proposalResponses,
								proposal: proposal
						};

						// set the transaction listener and set a timeout of 30 sec
						// if the transaction did not get committed within the timeout period,
						// report a TIMEOUT status
						var transaction_id_string = tx_id.getTransactionID(); //Get the transaction ID string to be used by the event processing
						var promises = [];

						var sendPromise = channel.sendTransaction(request);
						promises.push(sendPromise); //we want the send transaction first, so that we know where to check status

						// get an eventhub once the fabric client has a user assigned. The user
						// is required bacause the event registration must be signed
						let event_hub = fabric_client.newEventHub();
						event_hub.setPeerAddr('grpc://localhost:7053');

						// using resolve the promise so that result status may be processed
						// under the then clause rather than having the catch clause process
						// the status
						let txPromise = new Promise((resolve, reject) => {
								let handle = setTimeout(() => {
										event_hub.disconnect();
										resolve({event_status : 'TIMEOUT'}); //we could use reject(new Error('Trnasaction did not complete within 30 seconds'));
								}, 3000);
								event_hub.connect();
								event_hub.registerTxEvent(transaction_id_string, (tx, code) => {
										// this is the callback for transaction event status
										// first some clean up of event listener
										clearTimeout(handle);
										event_hub.unregisterTxEvent(transaction_id_string);
										event_hub.disconnect();

										// now let the application know what happened
										var return_status = {event_status : code, tx_id : transaction_id_string};
										if (code !== 'VALID') {
												console.error('The transaction was invalid, code = ' + code);
												resolve(return_status); // we could use reject(new Error('Problem with the tranaction, event status ::'+code));
										} else {
												console.log(' + The transaction has been committed on peer ' + event_hub._ep._endpoint.addr);
												resolve(return_status);
										}
								}, (err) => {
										//this is the callback if something goes wrong with the event registration or processing
										reject(new Error('There was a problem with the eventhub ::'+err));
								});
						});
						promises.push(txPromise);

						return Promise.all(promises);
				} else {
						console.error('Failed to send Proposal or receive valid response. Response null or status is not 200. exiting...');
						throw new Error('Failed to send Proposal or receive valid response. Response null or status is not 200. exiting...');
				}
		}).then((results) => {
				console.log(' + Send transaction promise and event listener promise have completed');
				// check the results in the order the promises were added to the promise all list
				if (results && results[0] && results[0].status === 'SUCCESS') {
						console.log(' + Successfully sent transaction to the orderer.');
						res.send(tx_id.getTransactionID());
				} else {
						console.error('Failed to order the transaction. Error code: ' + response.status);
				}

				if(results && results[1] && results[1].event_status === 'VALID') {
						console.log(' + Successfully committed the change to the ledger by the peer');
						res.send(tx_id.getTransactionID());
				} else {
						console.error('Transaction failed to be committed to the ledger due to ::'+results[1].event_status);
				}
		}).catch((err) => {
				console.error('Failed to invoke successfully :: ' + err);
				console.error(err);
				res.status(500).send({error: err.toString()});
		});
	},
	getById: function(methodName, key, res){

		var fabric_client = new Fabric_Client();

		// setup the fabric network
		var channel = fabric_client.newChannel(HYPERLEDGER_APP_CHANNEL_NAME);
		var peer = fabric_client.newPeer('grpc://localhost:7051');
		channel.addPeer(peer);

		//
		var member_user = null;
		var store_path = path.join(os.homedir(), '.hfc-key-store');
		console.log('Store path:'+store_path);
		var tx_id = null;

		// create the key value store as defined in the fabric-client/config/default.json 'key-value-store' setting
		Fabric_Client.newDefaultKeyValueStore({ path: store_path
		}).then((state_store) => {
				// assign the store to the fabric client
				fabric_client.setStateStore(state_store);
				var crypto_suite = Fabric_Client.newCryptoSuite();
				// use the same location for the state store (where the users' certificate are kept)
				// and the crypto store (where the users' keys are kept)
				var crypto_store = Fabric_Client.newCryptoKeyStore({path: store_path});
				crypto_suite.setCryptoKeyStore(crypto_store);
				fabric_client.setCryptoSuite(crypto_suite);

				// get the enrolled user from persistence, this user will sign all requests
				return fabric_client.getUserContext('user1', true);
		}).then((user_from_store) => {
				if (user_from_store && user_from_store.isEnrolled()) {
						console.log(' + Successfully loaded %s from persistence', user_from_store.getName());
						member_user = user_from_store;
				} else {
						throw new Error('Failed to get '+user_from_store+'.... run registerUser.js');
				}

				// queryTuna - requires 1 argument, ex: args: ['4'],
				const request = {
						chaincodeId: HYPERLEDGER_APP_NAME,
						txId: tx_id,
						fcn: methodName,
						args: [key]
				};

				// send the query proposal to the peer
				return channel.queryByChaincode(request);
		}).then((query_responses) => {
				console.log("Query has completed, checking results");
				// query_responses could have more than one  results if there multiple peers were used as targets
				if (query_responses && query_responses.length == 1) {
						if (query_responses[0] instanceof Error) {
								console.error("error from query = ", query_responses[0]);
								res.status(500).send({error: query_responses[0].toString()});
						
						} else {
								console.log("Response is ", query_responses[0].toString());
								res.send(query_responses[0].toString())
						}
				} else {
						console.log("No payloads were returned from query");
						res.send("Could not locate tuna")
				}
		}).catch((err) => {
				console.error('Failed to query successfully :: ' + err);
				res.status(500).send({error: err.toString()});
		});
	}, 
	createHyperledgerFabricUserContext : function(username, res){
		console.log("getHyperledgerFabricUserContext: " + username);
		var fabric_client = new Fabric_Client();
		var fabric_ca_client = null;
		var admin_user = null;
		var member_user = null;
		var store_path = path.join(os.homedir(), '.hfc-key-store');
		var adminUser = 'admin';
		console.log(' Store path:'+store_path);
					// create the key value store as defined in the fabric-client/config/default.json 'key-value-store' setting
		Fabric_Client.newDefaultKeyValueStore({ path: store_path
		}).then((state_store) => {
				// assign the store to the fabric client
				fabric_client.setStateStore(state_store);
				var crypto_suite = Fabric_Client.newCryptoSuite();
				// use the same location for the state store (where the users' certificate are kept)
				// and the crypto store (where the users' keys are kept)
				var crypto_store = Fabric_Client.newCryptoKeyStore({path: store_path});
				crypto_suite.setCryptoKeyStore(crypto_store);
				fabric_client.setCryptoSuite(crypto_suite);
				var	tlsOptions = {
					trustedRoots: [],
					verify: false
				};
				// be sure to change the http to https when the CA is running TLS enabled
				fabric_ca_client = new Fabric_CA_Client('http://localhost:7054', null , '', crypto_suite);
							// first check to see if the admin is already enrolled
				return fabric_client.getUserContext(username, true);
		}).then((user_from_store) => {
				if (user_from_store && user_from_store.isEnrolled()) {
					console.log(' + Successfully loaded %s from persistence', user_from_store.getName());
						member_user = user_from_store;
						return member_user;
				
				} else {
					console.log('Register, enroll and create user "'+username+'"');
					
					return fabric_client.getUserContext(adminUser, true)
					.then((user_from_store) => {
							if (user_from_store && user_from_store.isEnrolled()) {
									console.log(' + Successfully loaded %s from persistence', user_from_store.getName());
									admin_user = user_from_store;
							} else {
									throw new Error('Failed to get admin.... run registerAdmin.js');
							}
							// at this point we should have the admin user
							// first need to register the user with the CA server
							return fabric_ca_client.register({enrollmentID: username, affiliation: 'org1.department1'}, admin_user);
					}).then((secret) => {
							// next we need to enroll the user with CA server
							console.log('Successfully registered '+username+' - secret:'+ secret);

							return fabric_ca_client.enroll({
								enrollmentID: username, 
								enrollmentSecret: secret
							});
					}).then((enrollment) => {
						console.log('Successfully enrolled member user ' + username);
						return fabric_client.createUser(
							 {username: username,
							 mspid: 'Org1MSP',
							 cryptoContent: { privateKeyPEM: enrollment.key.toBytes(), signedCertPEM: enrollment.certificate }
							 });
					});
				}
		}).then((user) => {
				 member_user = user;
				 console.log('Found user: ' + user);
				 res.json(JSON.parse(user.toString()));
		}).catch((err) => {
				console.error('Failed to register: ' + err);
			if(err.toString().indexOf('Authorization') > -1) {
				console.error('Authorization failures may be caused by having admin credentials from a previous CA instance.\n' +
				'Try again after deleting the contents of the store directory '+store_path);
			}
				res.status(500).send({error: err.toString()});
		});
	}, 
	login : function(username, res){
		console.log("setHyperledgerFabricUserContext: " + username);
		var fabric_client = new Fabric_Client();
		var fabric_ca_client = null;
		var admin_user = null;
		var member_user = null;
		var store_path = path.join(os.homedir(), '.hfc-key-store');
		var adminUser = 'admin';
		console.log(' Store path:'+store_path);
					// create the key value store as defined in the fabric-client/config/default.json 'key-value-store' setting
		Fabric_Client.newDefaultKeyValueStore({ path: store_path
		}).then((state_store) => {
				// assign the store to the fabric client
				fabric_client.setStateStore(state_store);
				var crypto_suite = Fabric_Client.newCryptoSuite();
				// use the same location for the state store (where the users' certificate are kept)
				// and the crypto store (where the users' keys are kept)
				var crypto_store = Fabric_Client.newCryptoKeyStore({path: store_path});
				crypto_suite.setCryptoKeyStore(crypto_store);
				fabric_client.setCryptoSuite(crypto_suite);
				var	tlsOptions = {
					trustedRoots: [],
					verify: false
				};
				// be sure to change the http to https when the CA is running TLS enabled
				fabric_ca_client = new Fabric_CA_Client('http://localhost:7054', null , '', crypto_suite);
							// first check to see if the admin is already enrolled
				return fabric_client.getUserContext(username, true);
		}).then((user_from_store) => {
				if (user_from_store && user_from_store.isEnrolled()) {
						console.log(' + Successfully loaded %s from persistence', user_from_store.getName());
						member_user = user_from_store;
						return member_user;
				
				} else {
					throw new Error('Failed to find user ' + username);
				}
		}).then((user) => {
				 member_user = user;
				 console.log('fabric client setUserContext: ' + user);
				 fabric_client.setUserContext(user);
				 res.json(JSON.parse(user.toString()));
		}).catch((err) => {
				console.error('Failed to register: ' + err);
			if(err.toString().indexOf('Authorization') > -1) {
				console.error('Authorization failures may be caused by having admin credentials from a previous CA instance.\n' +
				'Try again after deleting the contents of the store directory '+store_path);
			}
				res.status(500).send({error: err.toString()});
		});
	}

}
})();
