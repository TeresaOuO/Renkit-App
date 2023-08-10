import { createMaterialBottomTabNavigator } from 'react-navigation-material-bottom-tabs';
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"
import FontAwesome5 from "react-native-vector-icons/FontAwesome5"
//import Ionicons from "react-native-vector-icons/Ionicons";
import { View, Image } from "react-native";
import Icon from 'react-native-vector-icons/Ionicons';
import HomePage from "./HomePage";
import UserPage from "./UserPage";
import MapPage from "./MapPage";
import CouponPage from "./CouponPage";
import OrderPage from "./OrderPage";
import React from 'react';



const TabNavigator = createMaterialBottomTabNavigator(
  {
    Map: {
      screen: MapPage,
      tabBarLabel: 'Map',
      navigationOptions: {
        tabBarIcon: ({ tintColor }) => (
          <View>
            <MaterialCommunityIcons style={[{ color: tintColor }]} size={25} name={'map-search'} />
          </View>
        )
      }
    },
    Coupon: {
      screen: CouponPage,
      tabBarLabel: 'Coupon',
      navigationOptions: {
        tabBarIcon: ({ tintColor }) => (
          <View>
            <MaterialCommunityIcons style={[{ color: tintColor }]} size={25} name={'ticket-percent'} />
          </View>
        )
      }

    },
    Home: {
      screen: HomePage,
      tabBarLabel: 'Home',
      navigationOptions: {
        tabBarIcon: ({ tintColor }) => (
          <View>
            <Icon style={[{ color: tintColor }]} size={25} name={'ios-earth'} />
          </View>
        ),
      }
    },
    CupRental: {
      screen: OrderPage,
      tabBarLabel: 'CupRental',
      navigationOptions: {
        tabBarIcon: ({ tintColor }) => (
          <View>
            <MaterialCommunityIcons style={[{ color: tintColor }]} size={25} name={'cup'} />
          </View>
        )
      }
    },
    User: {
      screen: UserPage,

      tabBarLabel: 'User',
      navigationOptions: {
        tabBarIcon: ({ tintColor }) => (
          <View>
            <FontAwesome5 style={[{ color: tintColor }]} size={25} name={'user-alt'} />
          </View>
        )
      }

    },


  },
  {
    initialRouteName: 'Home',
    activeColor: '#78746e',
    inactiveColor: '#453d34',
    barStyle: { backgroundColor: '#04151f' },
    labeled: 'true',
    
  }
);
export default TabNavigator;