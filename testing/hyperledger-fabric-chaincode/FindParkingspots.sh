#!/bin/bash

./parkingspot-invoke FindParkingspot '"{\"name\": \".*\"}"'
./parkingspot-invoke FindParkingspot '"{\"name\": \".*\", \"ownerId\": 1}"'
