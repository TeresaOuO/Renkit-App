import React, { useEffect, useState } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Animated,
    Image,
    TouchableOpacity,
    Dimensions,
    Platform,
    PermissionsAndroid,
    ActivityIndicator
} from 'react-native';

import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';
import Materiallcons from 'react-native-vector-icons/MaterialIcons'

import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

import { mapDarkStyle } from '../src/DATA/mapData'

import { createOpenLink } from 'react-native-open-maps'
import * as firebase from 'firebase'
const Images = [
    { image: require("./asset/store1.jpg") },
    { image: require("./asset/store2-2.jpg") },
    { image: require("./asset/store3.jpg") },
    { image: require("./asset/store3-2.jpg") },
    { image: require("./asset/store4-4.jpg") },
    { image: require("./asset/stoe5.jpg") },
    { image: require("./asset/store3-3.jpg") },
    { image: require("./asset/store6.jpg") },
    { image: require("./asset/store-7.jpg") },
    { image: require("./asset/store-9.jpg") },

];

const { width, height } = Dimensions.get('window')
const CARD_HEIGHT = 250;
const CARD_WIDTH = width * 0.8;
const SPACING_FOR_CARD_INSET = width * 0.1 - 10;

const SCREEN_HEIGTH = height
const SCREEN_WIDTH = width
const ASPECT_RATIO = width / height
const LATITUDE_DELTA = 0.0922
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO


var index = 1;
let markers = [];
    firebase.database().ref('Shops/').once('value', (snapshot) => {
        snapshot.forEach((child) => {
            let a=parseFloat(child.val().latitude); 
            let b=parseFloat(child.val().longitude); 
            markers.push({
                coordinate: {
                    latitude: a,
                    longitude: b,
                },
                title: child.val().name,
                description: child.val().address,
                time: child.val().openTime,
                image: child.val().picture,
                rating: 5,
                reviews: 102,
            });
        })
    })
const MapPage = () => {
    
    if (markers && index == 1) {
        index++;
        var initialMapState = {
            markers,
            latitude: null, //24.985655
            longitude: null, //121.341740
            latitudeDelta: 0.015,
            longitudeDelta: 0.0121,
            marginBottom: 1,
        };
    }
    const [state, setState] = React.useState(initialMapState);
    let mapIndex = 0;
    let mapAnimation = new Animated.Value(0);
    const D = Dimensions.get('window')


    useEffect(() => {

        async function getUserPermission() {
            //Geolocation.setRNConfiguration();
            if (Platform.OS === 'ios') {
                const granted = await Geolocation.requestAuthorization('always');
                if (granted === 'granted')
                    Geolocation.getCurrentPosition(
                        position => {
                            const { latitude, longitude } = position.coords;
                            setState({
                                ...state,
                                latitude: latitude,
                                longitude: longitude,

                            })
                            //console.log(latitude)
                        },
                        error => {
                            //console.log(error.code, error.message);
                        },
                        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
                    )

            } else {
                const granted = await PermissionsAndroid.request('android.permission.ACCESS_FINE_LOCATION')
                if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                    Geolocation.getCurrentPosition(
                        position => {
                            const { latitude, longitude } = position.coords;
                            setState({
                                ...state,
                                latitude: latitude,
                                longitude: longitude,

                            })
                        },
                        error => {
                            //console.log(error.code, error.message);
                        },
                        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },

                    )
                } else {
                }
            }

        }

        getUserPermission();
        mapAnimation.addListener(({ value }) => {
            let index = Math.floor(value / CARD_WIDTH + 0.3); // animate 30% away from landing on the next item
            if (index >= state.markers.length) {
                index = state.markers.length - 1;
            }
            if (index <= 0) {
                index = 0;
            }

            clearTimeout(regionTimeout);

            const regionTimeout = setTimeout(() => {
                if (mapIndex !== index) {
                    mapIndex = index;
                    const { coordinate } = state.markers[index];
                    _map.current.animateToRegion(
                        {
                            ...coordinate,
                            latitudeDelta: state.latitudeDelta,
                            longitudeDelta: state.longitudeDelta,
                        },
                        350
                    );
                }
            }, 10);
        });

    });

    const interpolations = state.markers.map((marker, index) => {
        const inputRange = [
            (index - 1) * CARD_WIDTH,
            index * CARD_WIDTH,
            ((index + 1) * CARD_WIDTH),
        ];

        const scale = mapAnimation.interpolate({
            inputRange,
            outputRange: [1, 1.5, 1],
            extrapolate: "clamp"
        });

        return { scale };
    });

    const onMarkerPress = (mapEventData) => {
        const markerID = mapEventData._targetInst.return.key;

        let x = (markerID * CARD_WIDTH) + (markerID * 20);
        if (Platform.OS === 'ios') {
            x = x - SPACING_FOR_CARD_INSET;
        }

        _scrollView.current.scrollTo({ x: x, y: 0, animated: true });
    };

    const _map = React.useRef(null);
    const _scrollView = React.useRef(null);

    return state.latitude ? (
        <View style={styles.container}>
            <MapView
                ref={_map}
                showsUserLocation={true}
                showsMyLocationButton={false}
                followsUserLocation={true}
                provider={PROVIDER_GOOGLE} // remove if not using Google Maps
                style={[styles.container]}
                customMapStyle={mapDarkStyle}
                initialRegion={state}>
                    
                {state.markers.map((marker, index) => {
                    const scaleStyle = {
                        transform: [
                            {
                                scale: interpolations[index].scale,
                            },
                        ],
                    };
                    return (
                        <MapView.Marker key={index} coordinate={marker.coordinate} onPress={(e) => onMarkerPress(e)}>
                            <Animated.View style={[styles.markerWrap]}>
                                <Animated.Image
                                    source={require('../src/asset/map_marker.png')}
                                    style={[styles.marker]}
                                    resizeMode="cover"
                                />
                            </Animated.View>
                        </MapView.Marker>
                    );
                })}

            </MapView>
            <View style={styles.searchBox}>
                <TouchableOpacity style={{
                    backgroundColor: '#e8e8e8',
                    shadowColor: '#ccc',
                    shadowOffset: { width: 0, height: 3 },
                    shadowOpacity: 0.5,
                    shadowRadius: 5,
                    elevation: 10,
                    width: 40,
                    height: 40,
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 5,
                }}
                    onPress={() => {
                        _map.current.animateToRegion({
                            ...state
                        })
                    }}>
                    <Materiallcons
                        size={30}
                        name={'my-location'}
                        color={'gray'}
                    />
                </TouchableOpacity>
            </View>
            <Animated.ScrollView
                ref={_scrollView}
                horizontal
                pagingEnabled
                scrollEventThrottle={1}
                showsHorizontalScrollIndicator={false}
                snapToInterval={CARD_WIDTH + 20}
                snapToAlignment="center"
                followsUserLocation={true}
                style={styles.scrollView}
                contentInset={{
                    top: 0,
                    left: SPACING_FOR_CARD_INSET,
                    bottom: 0,
                    right: SPACING_FOR_CARD_INSET
                }}
                contentContainerStyle={{
                    paddingHorizontal: Platform.OS === 'android' ? SPACING_FOR_CARD_INSET : 0
                }}
                onScroll={Animated.event(
                    [
                        {
                            nativeEvent: {
                                contentOffset: {
                                    x: mapAnimation,
                                }
                            },
                        },
                    ],
                    { useNativeDriver: true }
                )}
            >
                {state.markers.map((marker, index) => (
                    <View style={styles.card} key={index}>
                        <Image
                            source={{ uri: marker.image }}
                            style={styles.cardImage}
                            resizeMode="contain"
                        />
                        <View style={styles.textContent}>
                            <Text numberOfLines={1} style={styles.cardtitle} allowFontScaling={false}>{marker.title}</Text>
                            <Text numberOfLines={1} style={{ ...styles.cardDescription, color: '#022633' }} allowFontScaling={false}>{marker.time}</Text>
                            <Text numberOfLines={1} style={styles.cardDescription} allowFontScaling={false}>{marker.description}</Text>
                            <View style={styles.button}>
                                <TouchableOpacity
                                    onPress={createOpenLink({ latitude: marker.coordinate.latitude, longitude: marker.coordinate.longitude, zoom: 18, navigate_mode: 'preview', travelType: "walk", end: marker.description, provider: 'google' })}   //跳轉外部地圖
                                    style={[styles.signIn, {
                                    }]}
                                >
                                    <Text style={[styles.textSign, {
                                        color: '#022633',
                                        shadowColor: '#ccc',
                                        shadowOffset: { width: 0, height: 3 },
                                        shadowOpacity: 0.5,
                                        shadowRadius: 5,
                                        elevation: 10,
                                        marginBottom: '10%'
                                    }]} allowFontScaling={false}>導航至店家 {'>'}</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                ))}

            </Animated.ScrollView>
        </View >
    ) : <ActivityIndicator style={{ flex: 1 }} animating size='large' />
};

export default MapPage;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    searchBox: {
        position: 'absolute',
        marginTop: Platform.OS === 'ios' && (Dimensions.get('window').height > 800 || Dimensions.get('window').width > 800) ? hp('8%') : hp('3%'),
        flexDirection: "row",
        justifyContent: 'flex-end',
        width: wp('90%'),
        alignSelf: 'center',
    },

    chipsScrollView: {
        position: 'absolute',
        top: Platform.OS === 'ios' ? 90 : 80,
        paddingHorizontal: 10
    },
    chipsIcon: {
        marginRight: 5,
    },
    chipsItem: {
        flexDirection: "row",
        backgroundColor: '#e8e8e8',
        borderRadius: 20,
        padding: 8,
        paddingHorizontal: 20,
        marginHorizontal: 10,
        height: 35,
        shadowColor: '#ccc',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.5,
        shadowRadius: 5,
        elevation: 10,
    },
    scrollView: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        paddingVertical: 10,
    },
    endPadding: {
        paddingRight: width - CARD_WIDTH,
    },
    card: {
        //padding: 10,
        elevation: 2,
        backgroundColor: "white",
        borderRadius: 5,
        marginHorizontal: 10,
        shadowColor: "#000",
        shadowRadius: 5,
        shadowOpacity: 0.3,
        shadowOffset: { x: 2, y: -2 },
        height: CARD_HEIGHT,
        width: CARD_WIDTH,
        overflow: "hidden",
    },
    cardImage: {
        flex: 3,
        resizeMode:'contain',
        width: "100%",
        height: "70%",
        alignSelf: "center",
        //borderRadius:5
    },
    textContent: {
        flex: 1.5,
        padding: 14,

    },
    cardtitle: {
        fontSize: 12.5,
        marginBottom: 5,
        fontWeight: "bold",
    },
    cardDescription: {
        fontSize: 12,
        color: "#444",
        marginBottom: 2,
    },
    markerWrap: {
        alignItems: "center",
        justifyContent: "center",
        width: 50,
        height: 50,
    },
    marker: {
        width: 30,
        height: 30,
    },
    button: {
        marginTop: Platform.OS === 'ios' ? 5 : -3,

    },
    signIn: {
        width: '100%',
        padding: 8,
        alignItems: 'flex-end',

    },
    textSign: {
        fontSize: 12,
        fontWeight: 'bold',

    }
});