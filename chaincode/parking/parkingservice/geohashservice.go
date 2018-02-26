package parkingservice

import (
	. "github.com/parking/model"
	"github.com/pierrre/geohash"
)

type GeoHashService struct {
}

func GetGeoHashService() (GeoHashService) {
  return GeoHashService{}
}

func (s *GeoHashService) CreateLocationUsingZoom(X float64, Y float64, zoom int) (ParkingSpotLocation) {
	return ParkingSpotLocation {
		X: X,
		Y: Y,
		GeoHash: geohash.Encode(X, Y, zoom),
	}
}

func (s *GeoHashService) CreateLocation(X float64, Y float64) (ParkingSpotLocation) {
	return s.CreateLocationUsingZoom(X, Y, 11)
}

func (s *GeoHashService) CreateLocationWithGeoHash(X float64, Y float64, GeoHash string) (ParkingSpotLocation) {
	return ParkingSpotLocation {
		X: X,
		Y: Y,
		GeoHash: GeoHash,
	}
}
