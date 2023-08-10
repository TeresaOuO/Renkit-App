import React from 'react';
import {StyleSheet, Image, Platform } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Onboarding from 'react-native-onboarding-swiper';

const Dots=({selected})=>{
  let backgroundColor;
  backgroundColor=selected?'rgba(0,0,0,0.8)':'rgba(0,0,0,0.3)'
}
export default class OnboardingScreen extends React.Component {
  
  render() {
   
    return (
      <Onboarding
        onDone={() => this.props.navigation.replace("SignInScreen")}
        onSkip={() => this.props.navigation.replace("SignInScreen")}
        pages={[
          {
            backgroundColor: '#04151f',
            image: <Image source={require('./asset/Start.png')} style={styles.imagestyle} />,
            // title: 'Onboarding',
            // subtitle: 'Done with React Native Onboarding Swiper',
          },
          {
            backgroundColor: '#04151f',
            image: <Image source={require('./asset/Home.png')} style={styles.imagestyle} />,
            // title: 'Onboarding',
            // subtitle: 'Done with React Native Onboarding Swiper',
          },
          {
            backgroundColor: '#04151f',
            image: <Image source={require('./asset/Map.png')} style={styles.imagestyle} />,
            //title: 'The Title',
            //subtitle: 'This is the subtitle that sumplements the title.',
          },
          {
            backgroundColor: '#04151f',
            image: <Image source={require('./asset/Coupon.png')} style={styles.imagestyle} />,
            //title: 'Triangle',
            //subtitle: "Beautiful, isn't it?",
          },
          {
            backgroundColor: '#04151f',
            image: <Image source={require('./asset/Rental.png')} style={styles.imagestyle} />,
            //title: 'Triangle',
            //subtitle: "Beautiful, isn't it?",
          },
          {
            backgroundColor: '#04151f',
            image: <Image source={require('./asset/User.png')} style={styles.imagestyle} />,
            //title: 'Triangle',
            //subtitle: "Beautiful, isn't it?",
          },
        ]}
      />
    );
  }
}
var styles = StyleSheet.create({
  imagestyle: {
    ...Platform.OS === 'ios' ?
      {
        resizeMode: 'contain',
        width: wp('100%'),
        height: hp('100%'),
      } : {
        resizeMode: 'contain',
        height:hp('85%'),
        width:wp('95%'),
      }
  }
})