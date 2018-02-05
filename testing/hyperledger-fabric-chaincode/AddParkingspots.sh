#!/bin/bash

./parkingspot-invoke SaveParkingspot '"1", "{\"name\": \"Selver-1\", \"costPerMinute\": {\"amount\": 3, \"currencyName\": \"EUR\"}, \"owner\": {\"id\": \"1\", \"name\": \"Selver\"}}"'       
./parkingspot-invoke SaveParkingspot '"2", "{\"name\": \"Selver-2\", \"costPerMinute\": {\"amount\": 12, \"currencyName\": \"EUR\"}, \"owner\": {\"id\": \"1\", \"name\": \"Selver\"}}"'      
                                                                                                                                                                                              
./parkingspot-invoke SaveParkingspot '"3", "{\"name\": \"Joe-parkingspot-1\", \"costPerMinute\": {\"amount\": 3, \"currencyName\": \"EUR\"}, \"owner\": {\"id\": \"2\", \"name\": \"Joe\"}}"' 
                                                                                                                                                                                              