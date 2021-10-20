import React, { useEffect } from 'react';
import { GoogleMap, useLoadScript, DirectionsService, DirectionsRenderer } from '@react-google-maps/api';
import styles from './Map.module.css';
import { BusStops } from "./BusStops";
import { CurrentLocation } from "./CurrentLocation";
import { Leap } from "./Leap.js"
import { Home } from './Home';
import Profile from './Profile';
import { Results } from "./Results.js"
import dayjs from 'dayjs';
import axios from "axios";

const containerStyle = {
  width: '100%',
  height: '100vh'
};

const center = { lat: 53.345804, lng: -6.26031 };
const mapBounds = {
  north: 54.345804,
  south: 52.345804,
  east: -5.26031,
  west: -7.26031,
};

const darkModeStyle = [
  { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
  {
    featureType: "poi",
    elementType: "labels",
    stylers: [{visibility: "off",}]
  },
  {
    featureType: "administrative.locality",
    elementType: "labels.text.fill",
    stylers: [{ color: "#d59563" }],
  },
  {
    featureType: "poi",
    elementType: "labels.text.fill",
    stylers: [{ color: "#d59563" }],
  },
  {
    featureType: "poi.park",
    elementType: "geometry",
    stylers: [{ color: "#263c3f" }],
  },
  {
    featureType: "poi.park",
    elementType: "labels.text.fill",
    stylers: [{ color: "#6b9a76" }],
  },
  {
    featureType: "road",
    elementType: "geometry",
    stylers: [{ color: "#38414e" }],
  },
  {
    featureType: "road",
    elementType: "geometry.stroke",
    stylers: [{ color: "#212a37" }],
  },
  {
    featureType: "road",
    elementType: "labels.text.fill",
    stylers: [{ color: "#9ca5b3" }],
  },
  {
    featureType: "road.highway",
    elementType: "geometry",
    stylers: [{ color: "#746855" }],
  },
  {
    featureType: "road.highway",
    elementType: "geometry.stroke",
    stylers: [{ color: "#1f2835" }],
  },
  {
    featureType: "road.highway",
    elementType: "labels.text.fill",
    stylers: [{ color: "#f3d19c" }],
  },
  {
    featureType: "transit",
    elementType: "geometry",
    stylers: [{ color: "#2f3948" }],
  },
  {
    featureType: "transit.station",
    elementType: "labels.text.fill",
    stylers: [{ color: "#d59563" }],
  },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [{ color: "#17263c" }],
  },
  {
    featureType: "water",
    elementType: "labels.text.fill",
    stylers: [{ color: "#515c6d" }],
  },
  {
    featureType: "water",
    elementType: "labels.text.stroke",
    stylers: [{ color: "#17263c" }],
  },
]

function MapContainer({menu, setMenu, settings, setRegister, setLogin, darkBackground, darkForeground, darkText}) {
  const [originBox, setOriginBox] = React.useState('');
  const [destinationBox, setDestinationBox] = React.useState('');
  const [prediction, setPrediction] = React.useState(null);
  const [callbackResponse, setCallbackResponse] = React.useState(null);
  const [walkingCallbackResponse, setWalkingCallbackResponse] = React.useState(null);
  const [origin, setOrigin] = React.useState('');
  const [destination, setDestination] = React.useState('');
  const [newDirections, setNewDirections] = React.useState(true);
  const [selectedDate, setSelectedDate] = React.useState(new Date());
  const [weather, setWeather] = React.useState({});
  const [leaveArrive, setLeaveArrive] = React.useState('Leave:');
  const [walking, setWalking] = React.useState(null);
  const [originError, setOriginError] = React.useState("");
  const [destinationError, setDestinationError] = React.useState("");
  const [lib] = React.useState(['places']);
  const [currentPos, setCurrentPos] = React.useState(null);

  // Next 4 functions are for the places search boxes
  const onOriginChanged = () => {
    try {
      const lat = originBox.getPlaces()[0].geometry.location.lat();
      const lng = originBox.getPlaces()[0].geometry.location.lng();
      if (originBox.getPlaces().length > 1) {
        setOriginError("Destination must be a single address");
      }
      else if (originBox.getPlaces()[0].formatted_address === destination) {
        setOriginError("Origin cannot be the same as destination");
        setOrigin(originBox.getPlaces()[0].formatted_address);
      }
      else if ((mapBounds.south <= lat && lat <= mapBounds.north) && (mapBounds.west <= lng && lng <= mapBounds.east)) {
        setDestinationError("");
        setOrigin(originBox.getPlaces()[0].formatted_address);
        setOriginError("");
      }
      else {
        setOriginError("Origin must be close to Dublin");
      }
    }
    catch {
      setOriginError("Enter a valid Origin");
    }
    setNewDirections(true);
  };

  const onDestinationChanged = () => {
    try {
      const lat = destinationBox.getPlaces()[0].geometry.location.lat();
      const lng = destinationBox.getPlaces()[0].geometry.location.lng();
      if (destinationBox.getPlaces().length > 1) {
        setDestinationError("Destination must be a single address");
      }
      else if (destinationBox.getPlaces()[0].formatted_address === origin) {
        setDestinationError("Destination cannot be the same as origin");
        setDestination(destinationBox.getPlaces()[0].formatted_address);
      }
      else if ((mapBounds.south <= lat && lat <= mapBounds.north) && (mapBounds.west <= lng && lng <= mapBounds.east)) {
        setOriginError("");
        setDestination(destinationBox.getPlaces()[0].formatted_address);
        setDestinationError("");
      }
      else {
        setDestinationError("Destination must be close to Dublin");
      }
    }
    catch {
      setDestinationError("Enter a valid destination");
    }
    setNewDirections(true);
  }

  const onOriginLoad = ref => {
    setOrigin("");
    setOriginBox(ref);
  };
  const onDestinationLoad = ref => {
    setDestination("");
    setDestinationBox(ref);
  };

  const directionsCallback = async (response) => {
    if (response !== null) {
      if (response.status === 'OK') {
        await showWeather(selectedDate);
        setCallbackResponse(response)
        setNewDirections(true);
      } else {
        // console.log('response: ', response)
      }
    }
  }

  useEffect(() => {
    async function fetchPrediction() {
      if (weather && callbackResponse) {
        const steps = callbackResponse.routes[0].legs[0].steps;
        const buses = steps.filter(s => s.travel_mode === 'TRANSIT');
        const predictions = [];

        for (const bus of buses) {
          const route = bus.transit.line.short_name;
          const boardingStop = bus.transit.departure_stop.name.match(/stop (.*)$/);
          const boardingStopId = boardingStop ? boardingStop[1] : null;
          const alightingStop = bus.transit.arrival_stop.name.match(/stop (.*)$/);
          const alightingStopId = alightingStop ? alightingStop[1] : null;
          const stops = bus.transit.num_stops;

          if (route && (boardingStopId && alightingStopId) || (boardingStopId && !alightingStopId && stops) || (!boardingStopId && alightingStopId && stops)) {
            const prediction = await predict(route, boardingStopId, alightingStopId, stops);
            if(prediction) {
              predictions.push(prediction);
            }
          }
        }
        setPrediction(predictions);
      }
    }
    fetchPrediction();
  }, [weather])

  const walkingDirectionsCallback = (response) => {
    // console.log("Walking:", response)

    if (response !== null) {
      if (response.status === 'OK') {
        setWalkingCallbackResponse(response)
        setNewDirections(true);
      } else {
        // console.log('walking response: ', response)
      }
    }
  }

  const showWeather = async (time) => {
      const formatTime = dayjs(time).format("YYYY-MM-DD HH:mm:ss");
      const result = await axios.get(process.env.REACT_APP_API_URL + "/bus/weather", {
          params: {
              time: formatTime,
          }
      })
      .catch(error => {
        console.error("error:", error);
      });
      await setWeather(result.data.weather);
      // console.log(result.data.weather);
  }

  const predict = async (route, boarding, alighting, stops) => {
      const day = dayjs(selectedDate).format("dddd");
      const hour = dayjs(selectedDate).format("HH:00:00");
      const result = await axios.get(process.env.REACT_APP_API_URL + "/bus/predict", {
          params: {
              route,
              boarding,
              alighting,
              stops,
              day,
              hour,
              temp: weather.temp,
              weather: weather.main_description
          }
      })
      .catch(error => {
        console.error("error:", error);
        return null;
      });

    if (result) {
      return {
        route,
        boarding,
        alighting,
        stops,
        day,
        hour,
        temp: weather.temp,
        weather: weather.main_description,
        duration: Math.round(result.data.prediction)
      }
    }
  }

    useEffect(() => {
    if (window.navigator.geolocation) {
      window.navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log("position:", position);
          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setCurrentPos(pos);
          if (origin === "" && destination === "") {
            if ((mapBounds.south <= pos.lat && pos.lat <= mapBounds.north) && (mapBounds.west <= pos.lng && pos.lng <= mapBounds.east)) {
              setOrigin("Current Location")
              // console.log(pos);
              setNewDirections(true);
              setCurrentPos(pos)

              setOriginError("");
            }
            else {
              console.log("Current location out of bounds! Leaving Origin blank.")
            }
          }
        },
        () => {
          console.log("The Geolocation service failed.");
          setCurrentPos(null);
        }
      );
    } else {
      // Browser doesn't support Geolocation
      console.log("Your browser doesn't support geolocation.");
      setCurrentPos(null);
    }
}, [origin, destination]);

  const getOrigin = () => {
    if (origin === "Current Location" && currentPos) {
      return (
        currentPos
      );
    }
    else {
      return (
        origin
      )
    }
  }

  const { isLoaded } = useLoadScript({
    libraries: lib,
      googleMapsApiKey: "AIzaSyAbXR_N5FTc0sO4lMQcsXgPQat7wUnVKl4"
  });

  return (
    <div className = {styles.MapContainer}>

      {/* react-google-maps library for the Google Maps API */}
      {isLoaded &&
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom = { 14 }
        mapOptions={{clickableIcons: false}}
        options={{streetViewControl: false, strictBounds: false, mapTypeControl: false, clickableIcons: false, styles: (settings.darkMode ? darkModeStyle : [  {
          featureType: "poi",
          elementType: "labels",
          stylers: [{visibility: "off",}]
        }])}}
      >
        {menu === 'Home' && <Home
        menu={menu}
        setMenu={setMenu}
        onOriginChanged={onOriginChanged}
        onOriginLoad={onOriginLoad}
        setOrigin={setOrigin}
        origin={origin}
        onDestinationChanged={onDestinationChanged}
        onDestinationLoad={onDestinationLoad}
        setDestination={setDestination}
        destination={destination}
        settings={settings}
        darkBackground={darkBackground}
        darkForeground={darkForeground}
        darkText={darkText}
        showWeather={showWeather}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        newDirections={newDirections}
        setNewDirections={setNewDirections}
        leaveArrive={leaveArrive}
        setLeaveArrive={setLeaveArrive}
        originError={originError}
        destinationError={destinationError}
        setRegister={setRegister}
        setLogin={setLogin}
        prediction={prediction}
        setPrediction={setPrediction}
        />}
        {/* Conditionally render views */}
        {menu === 'Profile' && <Profile display={menu === 'Profile'} setMenu={setMenu} darkBackground={darkBackground} darkForeground={darkForeground} darkText={darkText}/>}
        {menu === 'Results' && <Results menu={menu} setMenu={setMenu} prediction={prediction} selectedDate={selectedDate} callbackResponse={callbackResponse} darkBackground={darkBackground} darkForeground={darkForeground} darkText={darkText} weather={weather} settings={settings} leaveArrive={leaveArrive} walkingCallbackResponse={walkingCallbackResponse} walking={walking} setWalking={setWalking}/>}
        {/* Display bus stops */}
        {settings.showStops && <BusStops />}
        {settings.showLeap && <Leap />}

        {/* If origin and destination search boxes are filled in, then display bus directions */}
        {
              (
                destination !== '' &&
                origin !== '' &&
                newDirections === false &&
                leaveArrive === "Leave:" &&
                originError === "" &&
                destinationError === ""
              ) && (
                <React.Fragment>
                <DirectionsService
                  options={{
                    destination: destination,
                    origin: getOrigin(),
                    travelMode: 'TRANSIT',
                    transitOptions: {
                      departureTime: dayjs(selectedDate).toDate(),
                      modes: ['BUS']
                    }
                  }}
                  callback={directionsCallback}
                />
                <DirectionsService
                options={{
                  destination: destination,
                  origin: getOrigin(),
                  travelMode: 'WALKING',
                  drivingOptions: {
                    departureTime: dayjs(selectedDate).toDate(),
                  }
                }}
                callback={walkingDirectionsCallback}
              />
              </React.Fragment>
              )
            }
                    {
              (
                destination !== '' &&
                origin !== '' &&
                newDirections === false &&
                leaveArrive === "Arrive:" &&
                originError === "" &&
                destinationError === ""
              ) && (
                <React.Fragment>
                <DirectionsService
                  options={{
                    destination: destination,
                    origin: getOrigin(),
                    travelMode: 'TRANSIT',
                    transitOptions: {
                      arrivalTime: dayjs(selectedDate).toDate(),
                      modes: ['BUS']
                    }
                  }}
                  callback={directionsCallback}
                />
                <DirectionsService
                options={{
                  destination: destination,
                  origin: getOrigin(),
                  travelMode: 'WALKING',
                  transitOptions: {
                    arrivalTime: dayjs(selectedDate).toDate(),
                  }
                }}
                callback={walkingDirectionsCallback}
              />
              </React.Fragment>
              )
            }


            {
              callbackResponse !== null && (walking === false || walking === null) && (
                <DirectionsRenderer
                  options={{
                    directions: callbackResponse
                  }}
                />
              )
            }

{
              walkingCallbackResponse !== null && walking === true && (
                <DirectionsRenderer
                  options={{
                    directions: walkingCallbackResponse
                  }}
                />
              )
            }
            {currentPos && <CurrentLocation position={currentPos}/>}
      </GoogleMap>
      }
    </div>
  )
}

export default React.memo(MapContainer)