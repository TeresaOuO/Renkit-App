/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { useEffect } from 'react';
/*import {
  View,
  Text
} from 'react-native';*/

import RootStack from "./RootStack";
import SplashScreen from 'react-native-splash-screen';

export default class App extends React.Component {
  
  //關閉黃色警告
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentDidMount() {
    //LogBox.ignoreAllLogs(true);
    YellowBox.ignoreWarnings(['First Warning!']);
    console.warn('First Warning!');
    console.warn('Second Warning!');
  }
//-------------------------------------------------
  componentDidMount() {
    SplashScreen.hide();
  }
  render() {
    return (
      <RootStack />
    );
  }
}
