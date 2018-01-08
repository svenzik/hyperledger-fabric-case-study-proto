#!/bin/bash

#openssl rand -base64 32 > date.txt
date > date.txt
echo '#############'
echo Date:
echo '#############'
cat date.txt

openssl ts   -query -data date.txt -cert -sha256 -out date_request.tsq
echo
echo '#############'
echo TSP request:
echo '#############'
openssl ts   -query   -in date_request.tsq -text

curl -H "Content-Type: application/timestamp-query" --data-binary '@date_request.tsq' https://freetsa.org/tsr > date_response.tsr

echo
echo '#############'
echo TSP response:
echo '#############'
openssl ts -reply -in date_response.tsr -text

echo
echo '#############'
echo VERIFY:
echo '#############'
openssl ts -verify -in date_response.tsr -queryfile date_request.tsq -CAfile cacert.pem -untrusted tsa.crt

./bin2byte.exe date_response.tsr | sed -e 's/^/0x/;s/ /, 0x/g;s/^/tspResponse := []byte{/;s/$/}/' > date_response.go
cat date_response.go
