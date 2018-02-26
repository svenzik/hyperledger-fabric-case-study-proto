package parkingservice

import (
  "reflect"

	"encoding/json"
	// "time"

	"github.com/hyperledger/fabric/core/chaincode/shim"
)

type ParkingCommonService struct {
}

func GetParkingCommonService() (ParkingCommonService) {
  return ParkingCommonService{}
}

func (s *ParkingCommonService) GetObject(APIstub shim.ChaincodeStubInterface, objectKeys []string, object interface{}) (interface{}, error) {
  compositeKey, _ := s.CreateKey(APIstub, object, objectKeys)

  resultAsBytes, err := APIstub.GetState(compositeKey)

  if err != nil {
		return nil, err
	}
	if resultAsBytes == nil {
		return nil, nil
	}
	err = json.Unmarshal(resultAsBytes, &object)
	return object, err
}

func (s *ParkingCommonService) SaveObject(APIstub shim.ChaincodeStubInterface, objectKeys []string, object interface{}) (interface{}, error) {
  compositeKey, _ := s.CreateKey(APIstub, object, objectKeys)

	resultAsBytes, err := json.Marshal(object)
	if err != nil {
		return nil, err
	}
	err = APIstub.PutState(compositeKey, resultAsBytes)
	return object, err
}

func (s *ParkingCommonService) CreateKey(APIstub shim.ChaincodeStubInterface, object interface{}, objectKeys []string) (string, error) {
  objectType := reflect.ValueOf(object).Type().Name()
  return APIstub.CreateCompositeKey(objectType, objectKeys)
}
