#!/bin/bash

#ID=$1
APP=$1
APP=${APP:=tuna-app}

echo Quering app: $APP

docker exec -e "CORE_PEER_LOCALMSPID=Org1MSP" -e "CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp" cli peer chaincode invoke -o orderer.example.com:7050 -C mychannel -n $APP -c '{"function":"recordTuna","Args":["13","b","c", "d", "f"]}'

