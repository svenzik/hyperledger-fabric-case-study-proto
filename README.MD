# Installation

Prequisites:
Install go, nodejs, npm and docker

This installation works on linux!

Install chaincode dependecies: go to directory ./chaincode and execute:
```./install.sh```

Go to ../parking-app, start Hypeledger Fabric network and deploy chaincode version 1.0
```./startFabric.sh```

Install client dependencies and run web server by executing:
```./install.sh```

Ctrl-c will exit 
To start web server use
```npm run start-dev```

open 
http://localhost:18000/

