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

type ParkingTimeService struct {
  ParkingCommonService ParkingCommonService
}

func GetParkingTimeService() (ParkingTimeService) {
  return ParkingTimeService{ParkingCommonService: GetParkingCommonService()}
}

func (s *ParkingTimeService) Get(APIstub shim.ChaincodeStubInterface, id string) (ParkingTime, error) {
  objectKeys :=  []string{id}
  parkingTime := ParkingTime{}
  result, err := s.ParkingCommonService.GetObject(APIstub, objectKeys, parkingTime)
  // r, _ := result.(ParkingTime)
  return parkingTime, err
}

func (s *ParkingTimeService) GetWithKeys(APIstub shim.ChaincodeStubInterface, objectKeys []string) (ParkingTime, error) {
  result, err := s.ParkingCommonService.GetObject(APIstub, objectKeys, ParkingTime{})
  r, _ := result.(ParkingTime)
  return r, err
}

func (s *ParkingTimeService) Save(APIstub shim.ChaincodeStubInterface, parkingTime ParkingTime) (ParkingTime, error) {
  objectKeys :=  []string{parkingTime.Id}
  result, err := s.ParkingCommonService.SaveObject(APIstub, objectKeys, parkingTime)
  r, _ := result.(ParkingTime)
  return r, err
}