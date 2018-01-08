// SPDX-License-Identifier: Apache-2.0

/*
  Sample Chaincode based on Demonstrated Scenario

 This code is based on code written by the Hyperledger Fabric community.
  Original code can be found here: https://github.com/hyperledger/fabric-samples/blob/release/chaincode/fabcar/fabcar.go
*/

package main

/* Imports
* 4 utility libraries for handling bytes, reading and writing JSON,
formatting, and string manipulation
* 2 specific Hyperledger Fabric specific libraries for Smart Contracts
*/
import (
	"encoding/json"
	"fmt"

	. "github.com/parking/model"

	"github.com/hyperledger/fabric/core/chaincode/shim"
	sc "github.com/hyperledger/fabric/protos/peer"
)

// Define the Smart Contract structure
type SmartContract struct {
}

/*
 * The Init method *
 called when the Smart Contract "tuna-chaincode" is instantiated by the network
 * Best practice is to have any Ledger initialization in separate function
 -- see initLedger()
*/
func (s *SmartContract) Init(APIstub shim.ChaincodeStubInterface) sc.Response {
	return shim.Success(nil)
}

/*
 * The Invoke method *
 called when an application requests to run the Smart Contract "tuna-chaincode"
 The app also specifies the specific smart contract function to call with args
*/
func (s *SmartContract) Invoke(APIstub shim.ChaincodeStubInterface) sc.Response {

	// Retrieve the requested Smart Contract function and arguments
	function, args := APIstub.GetFunctionAndParameters()
	// Route to the appropriate handler function to interact with the ledger
	if function == "GetCurrentTime" {
		return s.GetCurrentTime(APIstub, args)
	} else if function == "SetCurrentTime" {
		return s.SetCurrentTime(APIstub, args)
	} else if function == "initLedger" {
		return s.initLedger(APIstub)
	}

	return shim.Error(fmt.Sprintf("Invalid Smart Contract function name: %s", function))
}

func (s *SmartContract) GetCurrentTime(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {

	if len(args) != 0 {
		return shim.Error("Incorrect number of arguments. Expecting 0")
	}

	resultAsBytes, _ := APIstub.GetState("current-time")
	if resultAsBytes == nil {
		return shim.Error("Could not locate current-time")
	}
	return shim.Success(resultAsBytes)
}

func (s *SmartContract) SetCurrentTime(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {

	if len(args) != 1 {
		return shim.Error("Incorrect number of arguments. Expecting 1")
	}

	timestamp := HyperledgerFabricTimestamp{}
	err := json.Unmarshal([]byte(args[0]), &timestamp)
	if err != nil {
		return shim.Error(fmt.Sprintf("Failed to unmarshal timestamp: %s", err))
	}

	result, err := s.put(APIstub, "current-time", timestamp)
	if err != nil {
		return shim.Error(fmt.Sprintf("Failed to persist reservation: %s", err))
	}
	return shim.Success(result)
}

/*
 * The initLedger method
 */
func (s *SmartContract) initLedger(APIstub shim.ChaincodeStubInterface) sc.Response {
	s.SetCurrentTime(APIstub, []string{"{\"currentTime\": \"2018-01-07T22:55:57.410017541Z\"}"})
	return shim.Success(nil)
}

func (s *SmartContract) get(APIstub shim.ChaincodeStubInterface, id string) (HyperledgerFabricTimestamp, error) {
	resultAsBytes, err := APIstub.GetState(id)
	timestamp := HyperledgerFabricTimestamp{}
	if err != nil {
		return timestamp, err
	}
	if resultAsBytes == nil {
		return timestamp, nil
	}
	err = json.Unmarshal(resultAsBytes, &timestamp)
	if err != nil {
		return timestamp, err
	}

	return timestamp, nil
}

func (s *SmartContract) put(APIstub shim.ChaincodeStubInterface, id string, timestamp HyperledgerFabricTimestamp) ([]byte, error) {
	resultAsBytes, err := json.Marshal(timestamp)
	if err != nil {
		return resultAsBytes, err
	}
	err = APIstub.PutState(id, resultAsBytes)
	return resultAsBytes, err
}

/*
 * main function *
calls the Start function
The main function starts the chaincode in the container during instantiation.
*/
func main() {

	// Create a new Smart Contract
	err := shim.Start(&SmartContract{})
	if err != nil {
		fmt.Printf("Error creating new Smart Contract: %s", err)
	} else {
		fmt.Println("SVENZIK Time chaincode successfully started")
	}
}
