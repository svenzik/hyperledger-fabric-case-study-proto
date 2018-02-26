package parkingservice

import (
	"fmt"
	"errors"
	"time"
	"github.com/shopspring/decimal"
)

type ParkingTime struct {
	Id                string           `json:"id"`
	ParkingStart      time.Time        `json:"parkingStart"`
	ParkingEnd        time.Time        `json:"parkingEnd"`
	ParkingType       string           `json:"parkingType"` //RESERVATION,PARKING,FREE
	CostPerMinute     int              `json:"costPerMinute"` //in cents
	Cost              int              `json:"cost"`
	Parkingspot       Parkingspot      `json:"parkingspot"`
	Renter            User             `json:"renter"`
	CurrentTimestamps CurrentTimestamp `json:"currentTimestamps"`
}

type Parkingspot struct {
	Id            string         `json:"id"`
	Name          string         `json:"name"`
	Location      ParkingSpotLocation `json:"location"`
	CostPerMinute CurrencyAmount `json:"costPerMinute"`
	Owner         User           `json:"owner"`
}

type User struct {
	Id      string  `json:"id"`
	Name    string  `json:"name"`
	Balance Balance `json:"balance"`
}

type ParkingSpotLocation struct {
	X       float64 `json:"x"` //N,Latitude 
	Y       float64 `json:"y"` //E,Longitude
	GeoHash string  `json:"geoHash"`
}

type CurrencyAmount struct {
	Amount       decimal.Decimal  `json:"amount"`
	CurrencyName string           `json:"currencyName"`
}

type Balance struct {
	Id           string          `json:"id"`
	CurrencyName string          `json:"currencyName"`
	Amount       decimal.Decimal `json:"amount"`
}

func (s *Balance) AddCents(amount int) {
	s.Amount.Add(decimal.NewFromFloat(float64(amount)/100))
}

func (s *Balance) SubtractCents(amount int) {
	s.Amount.Sub(decimal.NewFromFloat(float64(amount)/100))
}

//func (s *Balance) Add(amount Balance) Balance {
//	s.Amount.Add(amount)
//	return s;
//}
//
//func (s *Balance) Subtract(amount Balance) Balance {
//	s.Amount.Sub(amount)
//	return s;
//}

func (s *Balance) transferTo(balanceTo Balance, amount decimal.Decimal) (Balance, error) {
	if s.Amount.LessThan(amount) {
		return *s, errors.New(fmt.Sprintf("Not enough funds: %s->%s", s.Amount, amount))
	}
	if s.CurrencyName != balanceTo.CurrencyName {
		return *s, errors.New(fmt.Sprintf("Cannot transfer different currencie: %s->%s", s.CurrencyName, balanceTo.CurrencyName))
	}
	s.Amount.Sub(amount)
	balanceTo.Amount.Add(amount)

	return *s, nil;
}

type CurrentTimestamp struct {
	TimeWindow            time.Duration `json:"timeWindow"`
	TransactionTime       time.Time     `json:"transactionTime"`
	TimeWindowCurrentTime time.Time     `json:"timeWindowCurrentTime"`
	TimeServerCurrentTime time.Time     `json:"timeServerCurrentTime"`
	ChaincodeCurrentTime  time.Time     `json:"chaincodeCurrentTime"`
	Errors                []string      `json:"errors"`
}

type HyperledgerFabricTimestamp struct {
	CurrentTime time.Time `json:"currentTime"`
}
