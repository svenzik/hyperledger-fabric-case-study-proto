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

type UserService struct {
  ParkingCommonService ParkingCommonService
}

func GetUserService() (UserService) {
  return UserService{ParkingCommonService: GetParkingCommonService()}
}

func (s *UserService) Get(APIstub shim.ChaincodeStubInterface, id string) (User, error) {
  objectKeys :=  []string{id}
  user := User{}
  result, err := s.ParkingCommonService.GetObject(APIstub, objectKeys, user)
  r, _ := result.(User)
  return r, err
}

func (s *UserService) Save(APIstub shim.ChaincodeStubInterface, user User) (User, error) {
  objectKeys :=  []string{user.Id}
  result, err := s.ParkingCommonService.SaveObject(APIstub, objectKeys, user)
  r, _ := result.(User)
  return r, err
}
