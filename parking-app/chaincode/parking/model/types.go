package parkingservice

import (
	"time"
)


type ParkingTime struct {
  Id string `json:"id"`
	ParkingStart time.Time `json:"parkingStart"`
	ParkingEnd time.Time `json:"parkingEnd"`
	ParkingType string `json:"parkingType"` //RESERVATION,PARKING
	CostPerMinute int `json:"costPerMinute"`
	Cost int `json:"cost"`
	Parkingspot  Parkingspot `json:"parkingspot"`
	Renter User `json:"renter"`
}

type Parkingspot struct {
  Id string `json:"id"`
	Name string `json:"name"`
  Owner User `json:"owner"`
}

type User struct {
  Id string `json:"id"`
	Name string `json:"name"`
  Balance Balance `json:"balance"`
}

type Balance struct {
  Id string `json:"id"`
  CurrencyName string `json:"currencyName"`
  Amount int `json:"amount"`
}
