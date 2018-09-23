#!/bin/bash

go get github.com/golang/protobuf/protoc-gen-go
go get github.com/digitorus/pkcs7
go get github.com/digitorus/timestamp
go get github.com/pierrre/geohash
go get github.com/shopspring/decimal

# go get github.com/hyperledger/fabric
# go get github.com/svenzik/hyperledger-fabric-case-study-proto

cp -r $HOME/go/src/github.com/golang .
cp -r $HOME/go/src/github.com/digitorus .
cp -r $HOME/go/src/github.com/pierrre .
cp -r $HOME/go/src/github.com/shopspring .
