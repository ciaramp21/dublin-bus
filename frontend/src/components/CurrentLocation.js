import React from 'react';
import { Marker } from '@react-google-maps/api';

export function CurrentLocation({position}) {
    
    return (
        <Marker 
          position={position} 
          icon = {{
            path: "M-20,0a20,20 0 1,0 40,0a20,20 0 1,0 -40,0",
            strokeColor: '#ffffff',
            strokeOpacity: 0.9,
            strokeWeight: 2,
            fillColor: '#3f50b5',
            fillOpacity: 0.9,
            clickable: false,
            draggable: false,
            editable: false,
            visible: true,
            radius: 10,
            zIndex: 1,
            scale: 0.7,
        }}
        animation={window.google.maps.Animation.DROP}
          />
    )
}