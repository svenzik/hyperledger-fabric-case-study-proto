package parkingservice

import (
	"time"
)

type FindParkingspotParameter struct {
	Location      ParkingSpotLocation `json:"location"`
	Zoom          int                 `json:"zoom"`
	ParkingStart  time.Time           `json:"parkingStart"`
	ParkingEnd    time.Time           `json:"parkingEnd"`
}
