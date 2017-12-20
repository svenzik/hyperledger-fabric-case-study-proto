package parkingservice

/* Imports
* 4 utility libraries for handling bytes, reading and writing JSON,
formatting, and string manipulation
* 2 specific Hyperledger Fabric specific libraries for Smart Contracts
*/
import (
	"github.com/hyperledger/fabric/core/chaincode/shim"
  . "github.com/parking/model"
)

type ParkingspotService struct {
  ParkingCommonService ParkingCommonService
}

func GetParkingspotService() (ParkingspotService) {
  return ParkingspotService{ParkingCommonService: GetParkingCommonService()}
}

func (s *ParkingspotService) Get(APIstub shim.ChaincodeStubInterface, id string) (Parkingspot, error) {
  objectKeys :=  []string{id}
  parkingspot := Parkingspot{}
  result, err := s.ParkingCommonService.GetObject(APIstub, objectKeys, parkingspot)
  r, _ := result.(Parkingspot)
  return r, err
}

func (s *ParkingspotService) Save(APIstub shim.ChaincodeStubInterface, parkingspot Parkingspot) (Parkingspot, error) {
  objectKeys :=  []string{parkingspot.Id}
  result, err := s.ParkingCommonService.SaveObject(APIstub, objectKeys, parkingspot)
  r, _ := result.(Parkingspot)
  return r, err
}
