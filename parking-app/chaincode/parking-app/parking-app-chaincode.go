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
	"bytes"
	"encoding/json"
	"fmt"
	"strconv"
	"time"

	. "github.com/parking/model"

	"github.com/hyperledger/fabric/core/chaincode/shim"
	sc "github.com/hyperledger/fabric/protos/peer"
	"github.com/parking/parkingservice"
)

// Define the Smart Contract structure
type SmartContract struct {
	ParkingspotService parkingservice.ParkingspotService
	ParkingTimeService parkingservice.ParkingTimeService
	UserService parkingservice.UserService
	ParkingCommonService parkingservice.ParkingCommonService //TESTING
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
	if function == "getParkingTime" {
		return s.getParkingTimeC(APIstub, args)
	} else if function == "getParkingTimeC" {
		return s.getParkingTimeC(APIstub, args)
	} else if function == "getParkingTimeK" {
		return s.getParkingTime(APIstub, args)
	} else if function == "findParkingTime" {
		return s.findParkingTime(APIstub, args)
	} else if function == "findBetweenTime" {
		return s.findBetweenTime(APIstub, args)
	} else if function == "save" { //GENERIC save for debugging
		return s.saveCD(APIstub, args)
	} else if function == "saveC" { //GENERIC save for debugging
		return s.saveC(APIstub, args)
	} else if function == "saveCD" { //GENERIC save for debugging
		return s.saveCD(APIstub, args)
	} else if function == "saveReservation" {
		return s.saveReservation(APIstub, args)
	} else if function == "saveParkingtime" {
		return s.saveParkingtime(APIstub, args)
	} else if function == "getAll" {
		return s.getAll(APIstub)
	} else if function == "extendParkingTime" {
		return s.extendParkingTime(APIstub, args)
	} else if function == "iextendParkingTime" {
		return s.iextendParkingTime(APIstub, args)
	} else if function == "EndParking" {
		return s.EndParking(APIstub, args)
	} else if function == "initLedger" {
		return s.initLedger(APIstub)
	}

	return shim.Error(fmt.Sprintf("Invalid Smart Contract function name: %s", function))
}

/*
 * The getParkingTime method *
Used to view the records of one particular tuna
It takes one argument -- the key for the tuna in question
 */
func (s *SmartContract) getParkingTime(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {

	if len(args) != 1 {
		return shim.Error("Incorrect number of arguments. Expecting 1")
	}

	fmt.Printf("- SVENZIK getParkingTime:%s\n", args[0])
	resultAsBytes, _ := APIstub.GetState(args[0])
	if resultAsBytes == nil {
		return shim.Error("Could not locate tuna")
	}
	return shim.Success(resultAsBytes)
}

func (s *SmartContract) getParkingTimeC(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {

	if len(args) != 1 {
		return shim.Error("Incorrect number of arguments. Expecting 1")
	}

	parkingTimeId := args[0]
	fmt.Printf("- SVENZIK getParkingTime:%s\n", parkingTimeId)

	objectKeys :=  []string{parkingTimeId}
	compositeKey, _ := s.ParkingCommonService.CreateKey(APIstub, ParkingTime{}, objectKeys)
	fmt.Printf("Getting using key: %s\n", compositeKey)

	// parkingTime, _ := s.ParkingTimeService.Get(APIstub, parkingTimeId)
	// parkingTime, _ := s.ParkingTimeService.GetWithKeys(APIstub, objectKeys)
	// parkingTime, _ := s.ParkingCommonService.GetObject(APIstub, objectKeys, ParkingTime{})

	// resultAsBytes, _ := json.Marshal(parkingTime)
	// if resultAsBytes == nil {
	// 	return shim.Error("Could not marshal PT")
	// }
	//FIXME: all should work correctly
	resultAsBytes := []byte("")
	resultAsBytesService := []byte("")

	// resultAsBytesService, err = APIstub.GetState(compositeKey)
	// // resultAsBytes = append(resultAsBytes, []byte("\nNOSERVICE: ")...)
	// resultAsBytes = append(resultAsBytes, resultAsBytesService...)

	parkingTime, _ := s.ParkingCommonService.GetObject(APIstub, objectKeys, ParkingTime{})
	resultAsBytesService, _ = json.Marshal(parkingTime)
	// resultAsBytes = append(resultAsBytes, []byte("\nCSERVICE: ")...)
	resultAsBytes = append(resultAsBytes, resultAsBytesService...)

	// parkingTime, _ = s.ParkingTimeService.GetWithKeys(APIstub, objectKeys)
	// resultAsBytesService, _ = json.Marshal(parkingTime)
	// resultAsBytes = append(resultAsBytes, []byte("\nKSERVICE: ")...)
	// resultAsBytes = append(resultAsBytes, resultAsBytesService...)
  //
	// parkingTime, _ =s.ParkingTimeService.Get(APIstub, parkingTimeId)
	// resultAsBytesService, _ = json.Marshal(parkingTime)
	// resultAsBytes = append(resultAsBytes, []byte("\nOSERVICE: ")...)
	// resultAsBytes = append(resultAsBytes, resultAsBytesService...)

	return shim.Success(resultAsBytes)
}

/*
 * The findParkingTime method *
Used to search the records of one particular tuna
It takes one argument -- the coudhDB query string for the tuna in question
 */
func (s *SmartContract) findParkingTime(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {

	if len(args) != 1 {
		return shim.Error("Incorrect number of arguments. Expecting 1")
	}

	queryString := args[0]
	fmt.Printf("- queryString:\n%s\n", queryString)

	resultsIterator, err := APIstub.GetQueryResult(queryString)
	if err != nil {
		return shim.Error(err.Error())
	}
	defer resultsIterator.Close()

	result, err := s.marshalQueryResult(resultsIterator)
	fmt.Printf("- findParkingTime:\n%s\n", result)

	return shim.Success([]byte(result))
}

func (s *SmartContract) findBetweenTime(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {
	if len(args) != 2 {
		return shim.Error("Incorrect number of arguments. Expecting 2")
	}

	resultsIterator, err := s.findParkingspotOverlaping(APIstub, args[0], args[1])
	if err != nil {
		return shim.Error(err.Error())
	}
	defer resultsIterator.Close()

	result, err := s.marshalQueryResult(resultsIterator)
	fmt.Printf("- findBetweenTime:\n%s\n", result)

	return shim.Success([]byte(result))
}
/*
 * The initLedger method
 */
func (s *SmartContract) initLedger(APIstub shim.ChaincodeStubInterface) sc.Response {
		parkingSpot := []ParkingTime{
		ParkingTime{ParkingStart: time.Now(), ParkingEnd: time.Now(), CostPerMinute: 10, Parkingspot: Parkingspot{Name: "Tartu-Sobra-tee-1-315"}},
		ParkingTime{ParkingStart: time.Now().Add(2 * time.Minute), ParkingEnd: time.Now().Add(5 * time.Minute), CostPerMinute: 10, Parkingspot: Parkingspot{Name: "Tartu-Sobra-tee-1-315"}},
		ParkingTime{ParkingStart: time.Now().Add(10 * time.Minute), ParkingEnd: time.Now().Add(30 * time.Minute), CostPerMinute: 10, Parkingspot: Parkingspot{Name: "Tartu-Sobra-tee-1-315"}},
		ParkingTime{ParkingStart: time.Now().Add(31 * time.Minute), ParkingEnd: time.Now().Add(45 * time.Minute), CostPerMinute: 10, Parkingspot: Parkingspot{Name: "Tartu-Sobra-tee-1-315"}},
		ParkingTime{ParkingStart: time.Now().Add(46 * time.Minute), ParkingEnd: time.Now().Add(105 * time.Minute), CostPerMinute: 10, Parkingspot: Parkingspot{Name: "Tartu-Sobra-tee-1-315"}},
	}

	i := 0
	for i < len(parkingSpot) {
		parkingSpotAsBytes, _ := json.Marshal(parkingSpot[i])
		s.saveParkingtime(APIstub, []string{strconv.Itoa(i+1), fmt.Sprintf("%s", parkingSpotAsBytes)})
		//APIstub.PutState(strconv.Itoa(i+1), parkingSpotAsBytes)
		fmt.Println("Added", parkingSpot[i])
		i = i + 1
	}

	return shim.Success(nil)
}

/*
 * The save method *
Fisherman like Sarah would use to record each of her parkingSpot catches.
This method takes in five arguments (attributes to be saved in the ledger).
 */
func (s *SmartContract) save(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {

	if len(args) != 2 {
		return shim.Error("Incorrect number of arguments. Expecting 2")
	}

	// parkingTime := ParkingTime{}
	// json.Unmarshal([]byte(args[1]), &parkingTime)
	parkingTime, err := s.unmarshal(args[1])
	if err != nil {
		return shim.Error(fmt.Sprintf("Failed to unmarshal parkingTime: %s", err))
	}

	result, err := s.put(APIstub, args[0], parkingTime)
	if err != nil {
		return shim.Error(fmt.Sprintf("Failed to persist reservation: %s", err))
	}
	return shim.Success(result)
	// resultAsBytes, _ := json.Marshal(parkingTime)
	// err = APIstub.PutState(args[0], resultAsBytes)
	// if err != nil {
	// 	return shim.Error(fmt.Sprintf("Failed to record parkingTime: %s", args[0]))
	// }
  //
	// return shim.Success(resultAsBytes)
}

func (s *SmartContract) saveC(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {

	if len(args) != 2 {
		return shim.Error("Incorrect number of arguments. Expecting 2")
	}

	parkingTime, err := s.unmarshal(args[1])
	if err != nil {
		return shim.Error(fmt.Sprintf("Failed to unmarshal parkingTime: %s", err))
	}

	parkingTime.Id = args[0]
	ptResult, err := s.ParkingTimeService.Save(APIstub, parkingTime)
	if err != nil {
		return shim.Error(fmt.Sprintf("Failed to persist parkingTime: %s", err))
	}

	objectKeys :=  []string{parkingTime.Id}
	keyString, _ := s.ParkingCommonService.CreateKey(APIstub, parkingTime, objectKeys)
	ptResult.Id = keyString + " from: " + parkingTime.Id

	result,_ := json.Marshal(ptResult)
	return shim.Success(result)
}

func (s *SmartContract) saveCD(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {

	if len(args) != 2 {
		return shim.Error("Incorrect number of arguments. Expecting 2")
	}

	parkingTime, err := s.unmarshal(args[1])
	if err != nil {
		return shim.Error(fmt.Sprintf("Failed to unmarshal parkingTime: %s", err))
	}

	parkingTime.Id = args[0]


	objectKeys :=  []string{parkingTime.Id}
	compositeKey, _ := s.ParkingCommonService.CreateKey(APIstub, parkingTime, objectKeys)
	fmt.Printf("Saving using key: %s", compositeKey)

	resultAsBytes, err := json.Marshal(parkingTime)
	err = APIstub.PutState(compositeKey, resultAsBytes)

	if err != nil {
		return shim.Error(fmt.Sprintf("Failed to persist parkingTime: %s", err))
	}

	resultAsBytes, err = APIstub.GetState(compositeKey)
	if err != nil {
		return shim.Error(fmt.Sprintf("Failed to get parkingTime: %s", err))
	}

	return shim.Success(resultAsBytes)
}

func (s *SmartContract) saveReservation(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {
	parkingTime, err := s.unmarshal(args[1])
	if err != nil {
		return shim.Error(fmt.Sprintf("Failed to unmarshal parkingTime: %s", args[1]))
	}

	resultsIterator, _ := s.findParkingspotOverlaping(APIstub, parkingTime.ParkingStart.String(), parkingTime.ParkingEnd.String())
	if resultsIterator.HasNext() {
		queryResponse, _ := resultsIterator.Next()
		return shim.Error(fmt.Sprintf("Time is overlaping with : %s", queryResponse))
	}

	parkingTime.ParkingType = "RESERVATION"
	result, err := s.put(APIstub, args[0], parkingTime)
	if err != nil {
		return shim.Error(fmt.Sprintf("Failed to persist reservation: %s", err))
	}
	return shim.Success(result)
}

func (s *SmartContract) saveParkingtime(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {
	parkingTime, err := s.unmarshal(args[1])
	if err != nil {
		return shim.Error(fmt.Sprintf("Failed to unmarshal parkingTime: %s", args[1]))
	}

	resultsIterator, _ := s.findParkingspotOverlaping(APIstub, parkingTime.ParkingStart.String(), parkingTime.ParkingEnd.String())
	if resultsIterator.HasNext() {
		queryResponse, _ := resultsIterator.Next()
		return shim.Error(fmt.Sprintf("Time is overlaping with : %s", queryResponse))
	}

	parkingTime.ParkingType = "PARKING"
	result, err := s.put(APIstub, args[0], parkingTime)
	if err != nil {
		return shim.Error(fmt.Sprintf("Failed to persist parkingTime: %s", err))
	}
	return shim.Success(result)
}
/*
 * The getAll method *
allows for assessing all the records added to the ledger(all tuna catches)
This method does not take any arguments. Returns JSON string containing results.
 */
func (s *SmartContract) getAll(APIstub shim.ChaincodeStubInterface) sc.Response {

	startKey := "0"
	endKey := "999"
	resultsIterator, err := APIstub.GetStateByRange(startKey, endKey)

	// startKey,_ :=  APIstub.CreateCompositeKey("ParkingTime", []string{"1"})
	// endKey,_ := APIstub.CreateCompositeKey("ParkingTime",  []string{"999"})
	// resultsIterator, err := APIstub.GetStateByPartialCompositeKey("ParkingTime", []string{"1"})

	if err != nil {
		return shim.Error(err.Error())
	}
	defer resultsIterator.Close()

	// buffer is a JSON array containing QueryResults
	var buffer bytes.Buffer
	buffer.WriteString("[")

	bArrayMemberAlreadyWritten := false
	for resultsIterator.HasNext() {
		queryResponse, err := resultsIterator.Next()
		if err != nil {
			return shim.Error(err.Error())
		}
		// Add comma before array members,suppress it for the first array member
		if bArrayMemberAlreadyWritten == true {
			buffer.WriteString(",")
		}
		buffer.WriteString("{\"Key\":")
		buffer.WriteString("\"")
		buffer.WriteString(queryResponse.Key)
		buffer.WriteString("\"")

		buffer.WriteString(", \"Record\":")
		// Record is a JSON object, so we write as-is
		buffer.WriteString(string(queryResponse.Value))
		buffer.WriteString("}")
		bArrayMemberAlreadyWritten = true
	}
	buffer.WriteString("]")

	fmt.Printf("- getAll:\n%s\n", buffer.String())

	return shim.Success(buffer.Bytes())
}

/*
 * The extendParkingTime method *
The data in the world state can be updated with who has possession.
This function takes in 2 arguments, tuna id and new holder name.
 */
func (s *SmartContract) extendParkingTime(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {

	if len(args) != 2 {
		return shim.Error("Incorrect number of arguments. Expecting 2")
	}

	//TODO: check if it conflicts with some other parkingTime
	resultAsBytes, _ := APIstub.GetState(args[0])
	if resultAsBytes == nil {
		return shim.Error("Could not locate ParkingTime")
	}
	parkingTime := ParkingTime{}
	json.Unmarshal(resultAsBytes, &parkingTime)
	// Normally check that the specified argument is a valid holder of parkingTime
	// we are skipping this check for this example
	endTime, err := time.Parse(time.RFC3339 , args[1])
	if err != nil {
		return shim.Error(fmt.Sprintf("Failed to parse new end parkingTime: %s", args[1]))
	}
	parkingTime.ParkingEnd = endTime

	resultAsBytes, _ = json.Marshal(parkingTime)
	err = APIstub.PutState(args[0], resultAsBytes)
	if err != nil {
		return shim.Error(fmt.Sprintf("Failed to change parkingTime: %s", args[0]))
	}

	return shim.Success(resultAsBytes)
}

/*
 * The extendParkingTime method *
The data in the world state can be updated with who has possession.
This function takes in 2 arguments, tuna id and new holder name.
 */
func (s *SmartContract) iextendParkingTime(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {

	if len(args) != 2 {
		return shim.Error("Incorrect number of arguments. Expecting 2")
	}

	//TODO: check if it conflicts with some other parkingTime
	resultAsBytes, _ := APIstub.GetState(args[0])
	if resultAsBytes == nil {
		return shim.Error("Could not locate ParkingTime")
	}
	parkingTime := ParkingTime{}
	json.Unmarshal(resultAsBytes, &parkingTime)
	// Normally check that the specified argument is a valid holder of parkingTime
	// we are skipping this check for this example
	parkingTime.ParkingStart = parkingTime.ParkingEnd
	endTime, err := time.Parse(time.RFC3339 , args[1])
	if err != nil {
		return shim.Error(fmt.Sprintf("Failed to parse new end parkingTime: %s", args[1]))
	}
	parkingTime.ParkingEnd = endTime
	//TODO: fix new id generation
	newId, errAtoi := strconv.Atoi(args[0])
	newId = newId+1
	if errAtoi != nil {
		newId = -1;
	}
	resultAsBytes, _ = json.Marshal(parkingTime)
	err = APIstub.PutState(strconv.Itoa(newId), resultAsBytes)
	if err != nil {
		return shim.Error(fmt.Sprintf("Failed to change parkingTime: %s", args[0]))
	}

	return shim.Success(resultAsBytes)
}

/*
 * The EndParking method *
The data in the world state can be updated with who has possession.
This function takes in 2 arguments, tuna id and new holder name.
 */
func (s *SmartContract) EndParking(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {
	if len(args) != 1 {
		return shim.Error("Incorrect number of arguments. Expecting 1, id of parkingTime")
	}

	parkingTimeId := args[0]
	fmt.Printf("Ending parking for id: %s\n", parkingTimeId)
	//1
	// parkingTime, err := s.ParkingTimeService.Get(APIstub, parkingTimeId)

	//2
	// objectKeys :=  []string{parkingTimeId}
	// parkingTimeObject, err := s.ParkingCommonService.GetObject(APIstub, objectKeys, ParkingTime{})
	// fmt.Printf("Got parking: %s\n", parkingTimeObject)
	// parkingTime, _ := parkingTimeObject.(ParkingTime)

	//3
	objectKeys :=  []string{parkingTimeId}
	compositeKey, _ := s.ParkingCommonService.CreateKey(APIstub, ParkingTime{}, objectKeys)
	oResultAsBytes, err := APIstub.GetState(compositeKey)
	parkingTime := ParkingTime{}
	err = json.Unmarshal(oResultAsBytes, &parkingTime)

	fmt.Printf("Got parking type: %s\n", parkingTime)
	if err != nil {
		return shim.Error(fmt.Sprintf("Failed to find parkingTime(%s): %s", parkingTimeId, err))
	}

	// parkingTime.ParkingEnd = time.Now()
	ts,_ := APIstub.GetTxTimestamp()
	parkingTime.ParkingEnd = time.Unix(ts.Seconds, int64(ts.Nanos)).UTC()
	delta := parkingTime.ParkingEnd.Sub(parkingTime.ParkingStart)

	parkingTime.Cost = int(delta.Minutes()) * parkingTime.CostPerMinute

	s.ParkingTimeService.Save(APIstub, parkingTime)
	fmt.Printf("Saved parking type: %s\n", parkingTime)

	owner, err := s.UserService.Get(APIstub, parkingTime.Parkingspot.Owner.Id)
	if err != nil {
		return shim.Error(fmt.Sprintf("Failed to change parkingspot owner balance: %s", err))
	}

	renter, err := s.UserService.Get(APIstub, parkingTime.Renter.Id)
	if err != nil {
		return shim.Error(fmt.Sprintf("Failed to change renter balance: %s", err))
	}

	owner.Balance.Amount += parkingTime.Cost
	renter.Balance.Amount -= parkingTime.Cost

	owner, err = s.UserService.Save(APIstub, owner)
	if err != nil {
		return shim.Error(fmt.Sprintf("Failed to add parkingspot owner balance: %s", err))
	}
	renter, err = s.UserService.Save(APIstub, renter)
	if err != nil {
		return shim.Error(fmt.Sprintf("Failed to reduce renter balance: %s", err))
	}

	resultAsBytes, _ := json.Marshal(parkingTime)
	return shim.Success(resultAsBytes)
}


func (s *SmartContract) get(APIstub shim.ChaincodeStubInterface, id string) (ParkingTime, error) {
	resultAsBytes, err := APIstub.GetState(id)
	parkingTime := ParkingTime{}
	if err != nil {
		return parkingTime, err
	}
	if resultAsBytes == nil {
		return parkingTime, nil
	}
	err = json.Unmarshal(resultAsBytes, &parkingTime)
	if err != nil {
		return parkingTime, err
	}

	return parkingTime, nil
}

func (s *SmartContract) put(APIstub shim.ChaincodeStubInterface, id string, parkingTime ParkingTime) ([]byte, error) {
	resultAsBytes, err := json.Marshal(parkingTime)
	if err != nil {
		return resultAsBytes, err
	}
	err = APIstub.PutState(id, resultAsBytes)
	return resultAsBytes, err
}

// func (s *SmartContract) findParkingspotOverlaping(APIstub shim.ChaincodeStubInterface, ParkingStart time.Time, ParkingEnd time.Time) (shim.StateQueryIteratorInterface, error) {
func (s *SmartContract) findParkingspotOverlaping(APIstub shim.ChaincodeStubInterface, ParkingStart string, ParkingEnd string) (shim.StateQueryIteratorInterface, error) {
	queryString := fmt.Sprintf("{\"selector\": {\"parkingStart\": {\"$lte\": \"%s\"}, \"parkingEnd\": {\"$gte\": \"%s\"}}}", ParkingEnd, ParkingStart)
	resultsIterator, err := APIstub.GetQueryResult(queryString)
	if err != nil {
		return resultsIterator, err
	}
	defer resultsIterator.Close()

	return resultsIterator, nil
}

func (s *SmartContract) unmarshal(jsonStringBody string) (ParkingTime, error) {
	parkingTime := ParkingTime{}
	err := json.Unmarshal([]byte(jsonStringBody), &parkingTime)
	return parkingTime, err
}


func (s *SmartContract) marshalQueryResult(resultsIterator shim.StateQueryIteratorInterface) (string, error) {
	// buffer is a JSON array containing QueryResults
	var buffer bytes.Buffer
	buffer.WriteString("[")

	bArrayMemberAlreadyWritten := false
	for resultsIterator.HasNext() {
		queryResponse, err := resultsIterator.Next()
		if err != nil {
			return "", err
		}
		// Add comma before array members,suppress it for the first array member
		if bArrayMemberAlreadyWritten == true {
			buffer.WriteString(",")
		}
		buffer.WriteString("{\"Key\":")
		buffer.WriteString("\"")
		buffer.WriteString(queryResponse.Key)
		buffer.WriteString("\"")

		buffer.WriteString(", \"Record\":")
		// Record is a JSON object, so we write as-is
		buffer.WriteString(string(queryResponse.Value))
		buffer.WriteString("}")
		bArrayMemberAlreadyWritten = true
	}
	buffer.WriteString("]")
	return buffer.String(), nil
}
/*
 * main function *
calls the Start function
The main function starts the chaincode in the container during instantiation.
 */
func main() {

	// Create a new Smart Contract
	err := shim.Start(&SmartContract{
			ParkingspotService: parkingservice.GetParkingspotService(),
			ParkingTimeService: parkingservice.GetParkingTimeService(),
			UserService: parkingservice.GetUserService(),
			ParkingCommonService: parkingservice.GetParkingCommonService(),
		})
	if err != nil {
		fmt.Printf("Error creating new Smart Contract: %s", err)
	} else {
		fmt.Println("SVENZIK SampleChaincode successfully started")
	}
}
