import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Alert,
} from 'react-native';
import {
    ListItem,//https://react-native-elements.github.io/react-native-elements/docs/listitem.html  網址
    Avatar,
} from 'react-native-elements';
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { Animated } from "react-native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';


const showimage = require('../Images/woman1.jpg');
const opacity = new Animated.Value(0);
Animated.timing(opacity, {
    toValue: 1,
    duration: 500
}).start();//測試(25~29)

import * as firebase from 'firebase'
import LinearGradient from 'react-native-linear-gradient';

const list = [
    //個人資料
    {
        title: 'Appointments',
        icon: 'person',
        name: "個人資料",
        ScreenName: "ProfileScreen",
    },
    //意見回覆
    {
        title: 'Trips',
        icon: 'error-outline',
        name: "意見回覆",
        ScreenName: "CommentScreen",
    },
    //關於我們
    {
        title: 'Trips',
        icon: 'grade',
        name: "關於我們",
        ScreenName: "AboutScreen",
    },
    //登出
    {
        title: 'Trips',
        icon: 'exit-to-app',
        name: "登出",
        ScreenName: "logout",

    },
];

export default class UserPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
        };
    }
    componentDidMount() {
        const { navigation } = this.props;
        navigation.addListener('willFocus', () => {
            var RegisterUser = firebase.auth().currentUser;
            firebase.database().ref('users/' + RegisterUser.uid).once('value', snapshot => {
                this.setState({
                    name: snapshot.val().name,
                });
            });
        });

    }
    logoutuser() {
        firebase.auth().signOut().then(function () {
            // Sign-out successful.
        }).then(() => {
            this.props.navigation.replace('SplashScreen');
            //this.goToOtherScreen("SignInScreen")
        })
            .catch(function (error) {
                // An error happened.
            });
    }
    goToOtherScreen(ScreenName) {
        if (ScreenName == "logout") {
            //alert('登出secondapp2?',"登出")
            Alert.alert(
                '登出',
                '確定登出?',
                [
                    { text: '取消', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
                    { text: '確定', onPress: () => console.log('OK Pressed'), onPress: () => this.logoutuser() },
                ],
                { cancelable: false }
            )
        } else {
            this.props.navigation.navigate(ScreenName);
        }
    }
    render() {
        return (
            <View style={styles.container}>
                <View
                    style={{
                        flex:1,
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: hp('38%'),
                        paddingTop: hp('3%'),
                        //backgroundColor: 'blue'
                    }}>
                    <View style={{height: wp('10%'),width:'80%',flexDirection:'row',justifyContent:'flex-end',marginTop:hp('8%')}}>
                        <TouchableOpacity
                            onPress={() => this.props.navigation.navigate('CupRentalScreen')}
                            >
                            <MaterialCommunityIcons
                                name="qrcode-scan"
                                theme="filled"
                                color="#ded7ca"
                                size={wp('10%')}
                            />
                        </TouchableOpacity>
                    </View>
                    <View style={{
                        //height: '100%',
                        //backgroundColor: 'green',
                        alignItems: 'center',
                    }}>
                        <Avatar
                            rounded source={showimage}
                            size={150}
                        />
                        <Text style={{
                            fontSize: 30,
                            color: '#ded7ca',
                            fontWeight: 'bold',
                            letterSpacing: 1,
                            textShadowOffset: { width: 3, height: 5 },
                        }}allowFontScaling={false}>{this.state.name}
                        </Text>
                    </View>
                </View>
                <View style={styles.box1}>

                    <View
                        style={{//控制下方清單外框view
                            width:'90%',
                            backgroundColor: '#04151f',
                        }}>
                        {list.map((item, i) => (<ListItem
                            key={i}
                            friction={90}
                            tension={100}
                            linearGradientProps={{
                                colors: ['#04151f', '#04151f'],
                                start: { x: 1, y: 0 },
                                end: { x: 0.2, y: 0 },
                            }}
                            ViewComponent={LinearGradient}
                            title={item.name}
                            leftIcon={{ name: item.icon, color: '#ded7ca', size: 25 }}  //左邊icon顏色
                            rightIcon={{}}
                            onPress={() => this.goToOtherScreen(item.ScreenName)}
                            bottomDivider={false}
                            chevron={{ color: '#ded7ca', size: 20 }}//右邊箭頭顏色
                            titleStyle={styles.listtitle}//清單裡的文字樣式
                            containerStyle={styles.listconatiner}//清單樣式

                        />
                        ))}
                    </View>

                </View>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    container: {//控制最底層view
        flex: 1,
        backgroundColor: '#04151f'
    },
    header: {//控制大頭貼位置
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
    },
    box1: {
        flex:2,
        justifyContent: 'center',
        alignItems: 'center',
        //backgroundColor: 'red',
    },
    listconatiner: {//清單樣式，控制每個清單
        // borderWidth: 2,
        //borderRadius: 10,
        //width: '100%',
        //height: '-1%',
        //paddingBottom: 12,//控制清單內的行距
        justifyContent: 'flex-start',
        alignItems: 'center',

    },
    listtitle: {//清單裡的文字樣式
        color: '#ded7ca',
        fontWeight: 'bold',
        fontSize: 18,
        letterSpacing: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },

})