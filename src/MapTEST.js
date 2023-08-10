import React, { useState, useEffect } from 'react';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';
import { ActivityIndicator } from 'react-native-paper';

const initialState = {

    latitude: null, //24.985655
    longitude: null, //121.341740
    latitudeDelta: 0.015,
    longitudeDelta: 0.0121,


}

const MapTEST = () => {
    const [curentPosition, setCurentPosition] = useState(initialState);
    useEffect(() => {
        Geolocation.getCurrentPosition(
            position => {
                setCurentPosition({
                    ...curentPosition,
                    latitude: position.coords.latitude, //24.985655
                    longitude: position.coords.longitude, //121.341740
                })
            },
            error => {
                //console.log(error.code, error.message);
            },
            { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
        )
    }, [])

    
    return curentPosition.latitude ? (
        <MapView
            provider={PROVIDER_GOOGLE}
            style={{ flex: 1 }}
            initialRegion={curentPosition}
            showsUserLocation={true}
        />
    ) : <ActivityIndicator style={{ flex: 1 }} animating size='large' />
};
export default MapTEST;