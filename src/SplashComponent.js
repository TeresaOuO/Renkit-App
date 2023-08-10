import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    StatusBar,
    Dimensions,
    TouchableOpacity
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import LinearGradient from 'react-native-linear-gradient';
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import * as firebase from 'firebase'
import AsyncStorage from '@react-native-community/async-storage';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
const firebaseConfig = {
    apiKey: "AIzaSyBv0oSWnzmpjEHLokkslFLNXTzKi7RNU4g",
    authDomain: "share-drink.firebaseapp.com",
    databaseURL: "https://share-drink.firebaseio.com",
    projectId: "share-drink",
    storageBucket: "share-drink.appspot.com",
    messagingSenderId: "14774934464",
    appId: "1:14774934464:web:9b81562d29dfa1e66b0625",
    measurementId: "G-JX77CQL7TN"
};
// Initialize Firebase
if(!firebase.apps.length){
    firebase.initializeApp(firebaseConfig);
}

export default class SplashComponent extends React.Component {
    state = {
        isFirstLaunch: null,
    }
    componentDidMount() {
        AsyncStorage.getItem('alreadyLaunched').then(value => {
            if (value == null) {
                AsyncStorage.setItem('alreadyLaunched', 'true');
                this.setState({ isFirstLaunch: true })
            } else {
                this.setState({ isFirstLaunch: false })
            }
        })
    }
    checkloginornot() {
        if (this.state.isFirstLaunch === null) {
            return null;
        } else if (this.state.isFirstLaunch === true) {
            this.props.navigation.navigate('OnboardingScreen')
        } else {
            firebase.auth().onAuthStateChanged(user => {
                if(user){
                    //mytoast.showToast("歡迎回來")
                }
                this.props.navigation.replace(user ? 'TabScreen' : 'SignInScreen')
            })
        }
    }
    render() {
        return (
            <View style={styles.container}>
                <StatusBar barStyle='light-content' />
                <View style={styles.header}>
                    <Animatable.Image
                        animation="bounceIn"
                        duration={1500}
                        source={require('./asset/logo.png')}
                        style={styles.logo}
                        resizeMode={"contain"}
                        
                    />
                    <Text style={styles.logoText}allowFontScaling={false}>DRINK MILKY WAY</Text>
                </View>

                <Animatable.View
                    style={styles.footer}
                    animation="fadeInUpBig">
                    <Text style={styles.title}allowFontScaling={false}>用環保的方式喝一杯吧！</Text>
                    <Text style={[styles.text]} allowFontScaling={false}>讓窒息的地球再多吸一口氣</Text>
                    <View style={styles.button}>
                        <TouchableOpacity
                            onPress={() => this.checkloginornot()}>
                            <LinearGradient
                                colors={['#202b37', '#0a445a']}//深灰色
                                style={styles.singIn}>
                                <Text style={styles.textSign}allowFontScaling={false}>開始租借</Text>
                                <MaterialIcons
                                    name="navigate-next"
                                    color='#e8e8e8'//象牙白
                                    size={19}
                                />
                            </LinearGradient>
                        </TouchableOpacity>

                    </View>
                    <Text style={styles.textName} allowFontScaling={false}>direct by @SHAREMEALS</Text>
                </Animatable.View>
            </View>

        )
    }
}


const { height } = Dimensions.get("screen");
const height_logo = height * 0.7 * 0.4;

var styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#04151f',
    },
    header: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',

    },
    footer: {
        flex: 0.5,
        backgroundColor: '#e8e8e8',//象牙白
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        paddingVertical: 50,//文字離footer邊框的高度
        paddingHorizontal: 30,//文字離footer邊框的長度
    },
    logo: {
        width: wp('30%'),
        height: hp('25%')

    },
    title: {
        color: '#202b37',
        fontWeight: 'bold',
        fontSize: 30,
        letterSpacing: 1.5,
        
    },
    text: {
        color: 'gray',
        marginTop: 5,
        letterSpacing: 2,
        lineHeight: 30

    },
    button: {
        alignItems: "flex-end",
        marginTop: 30,

    },
    singIn: {
        width: 140,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 50,
        flexDirection: 'row',

    },
    textSign: {
        color: '#e8e8e8',
        fontWeight: 'bold',
        letterSpacing: 1,
    },
    textName: {
        color: 'gray',
        fontSize: 9,
        textAlign: 'center',
        paddingTop: Platform.OS === 'ios' ? hp('16%') :hp('5%')
    },
    logoText: {
        color: 'gray',
        fontSize: 10,
        textAlign: 'center',
        marginTop:hp('2%'),
    },
}

)