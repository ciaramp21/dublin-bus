import React, { useEffect } from 'react';
import axios from 'axios';
import { MarkerClusterer, Marker, InfoWindow } from '@react-google-maps/api';
import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/lab/Alert';

export function Leap() {
    const [leap, setLeap] = React.useState([]);
    const [state, setState] = React.useState({
        open: false,
        vertical: 'top',
        horizontal: 'center',
      });
    const [clickedLeap, setClickedLeap] = React.useState({shop_name:"", town:""});

    useEffect( () => {
      async function fetchData(){
        const result = await axios(
            process.env.REACT_APP_API_URL + '/bus/leap',
        )
        setLeap(result.data.leap)
        }
        fetchData();
    },[])

    const options = {
        imagePath:
          'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m', // so you must have m1.png, m2.png, m3.png, m4.png, m5.png and m6.png in that folder
      }

    const { vertical, horizontal, open } = state;

    const handleClick = (newState, leap) => {
        setState({ open: true, ...newState });
        setClickedLeap({"shop_name": leap.shop_name, "town": leap.town})
    };
    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
          return;
        }
    
        setState({ ...state, open: false });
    };

    return (
        <React.Fragment>
        // Map circles to coordinates of leap card top-up locations
        <MarkerClusterer options={options}>
          {(clusterer) =>
            leap.map((leap) => (
              <Marker 
            //   key={leap.shop_name+leap.town} 
              position={{"lat": parseFloat(leap.latitude), "lng": parseFloat(leap.longitude)}} 
              clusterer={clusterer} 
              icon = {{
                path: "M-20,0a20,20 0 1,0 40,0a20,20 0 1,0 -40,0",
                strokeColor: '#f44336',
                strokeOpacity: 0.8,
                strokeWeight: 2,
                fillColor: '#f44336',
                fillOpacity: 0.35,
                clickable: false,
                draggable: false,
                editable: false,
                visible: true,
                radius: 10,
                zIndex: 1,
                scale: 0.7
            }}
            onClick= {() => {handleClick({ vertical: 'top', horizontal: 'center' }, leap)}}
              />
            ))
          }
        </MarkerClusterer>
        <Snackbar anchorOrigin={{ vertical, horizontal }} open={open} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="info">
          {clickedLeap.shop_name} ({clickedLeap.town})
        </Alert>
        </Snackbar>
        </React.Fragment>
    )
}