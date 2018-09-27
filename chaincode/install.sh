#!/bin/bash
if [ -z "$GOPATH" ]; then
	export GOPATH=$HOME/go
fi

go get github.com/golang/protobuf/protoc-gen-go
go get github.com/digitorus/pkcs7
go get github.com/digitorus/timestamp
go get github.com/pierrre/geohash
go get github.com/shopspring/decimal

# go get github.com/hyperledger/fabric
# go get github.com/svenzik/hyperledger-fabric-case-study-proto

cp -r $GOPATH/src/github.com/golang .
cp -r $GOPATH/src/github.com/digitorus .
cp -r $GOPATH/src/github.com/pierrre .
cp -r $GOPATH/src/github.com/shopspring .
