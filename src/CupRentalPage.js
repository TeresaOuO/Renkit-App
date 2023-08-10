import React, { Component } from 'react';
import {
    View,
    Dimensions,
    Platform,
    Alert,
    Vibration,
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import QRCodeScanner from 'react-native-qrcode-scanner';
import * as firebase from 'firebase'
//import { RNCamera } from 'react-native-camera';
//擷取螢幕長寬
const SCREEN_HEIGHT = Dimensions.get("window").height;
const SCREEN_WIDTH = Dimensions.get("window").width;
//小黃標
console.disableYellowBox = true;
var store, cup;
export default class QRcodeCameraPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            camera: true,
            iscup: false,
            isstore: false,
            num: '0',
        }
    }
    camera_on() {
        this.setState({ camera: true });
    }
    UNSAFE_componentWillReceiveProps(nextProps) {
        this.setState({
            camera: true,
        });
    }
    //     ifScaned = e => {
    //         Linking.openURL(e.data).catch(err =>
    //             Alert.alert("Invalid qrcode", err));
    //     }
    _handleBarCodeRead = ({ type, data }) => {
        //判斷杯子
        var ref_cup = firebase.database().ref('cups');
        ref_cup.once("value").then(snapshot => {
            cup = snapshot.child(data).exists();//杯子id是否存在
            this.changeToDefaultScreen(cup, false, data);
        });
        //判斷店家
        var ref_store = firebase.database().ref('Shops/');
        ref_store.once("value").then(snapshot => {
            store = snapshot.child(data).exists();//店家id是否存在
            this.setState({ isstore: store })
            this.changeToDefaultScreen(false, store, data);
        });
        //判斷其他()
        this.setState({ camera: !this.state.camera })
        Vibration.vibrate(100);
        //alert(`Bar code type : ${type} and data : ${data} `);
    }
    changeToDefaultScreen(iscup, isstore, qrcodedata) {
        var RegisterUser = firebase.auth().currentUser;
        if (iscup == true) {//是杯子就跳轉
            var cupid = qrcodedata;
            var checkbug = 0;
            var error1 = '', error2 = '';
            firebase.database().ref('users/' + RegisterUser.uid + '/myorder').once('value', (snapshot) => {
                snapshot.forEach((child) => {
                    if (child.val().useState == 'true') {//訂單中有租借中的
                        checkbug = 1;
                        error1 = "已有租借中訂單"
                        this.props.navigation.goBack()
                    }
                })
                firebase.database().ref('cups/' + cupid).once('value', snapshot => {
                    //判斷杯子的使用者是否false
                    if (snapshot.val().UserId != 'false') {
                        checkbug = 2;
                        error2 = "杯子正在使用中"
                        this.props.navigation.goBack()
                    }

                    if (checkbug == 0) {
                        this.props.navigation.replace("RentalChangeScreen", { cupId: cupid, storeId: 0, case: 1 });
                    } else {
                        Alert.alert(
                            "警示",
                            error1 + "\n" + error2,
                            [
                                {
                                    text: "確認",
                                    style: "cancel"
                                },
                            ],
                            { cancelable: false }
                        );
                    }
                });
            })

        }
        else if (isstore == true) {//是店家就跳轉
            var storeid = qrcodedata;
            this.props.navigation.replace("RentalChangeScreen", { cupId: 0, storeId: storeid, case: 2 });
        }
        //else if(isother==true){//是其他就...
        //}
        else { }
    }
    //中間綠色動態條碼
    makeSlideOutTranslation(translationType, fromValue) {
        return {
            from: {
                [translationType]: SCREEN_WIDTH * -0.18
            },
            to: {
                [translationType]: fromValue
            }
        };
    }
    render() {

        return (
            /*switch (this.state.pageIndex) {
                case 0:
                    return (*/
            <View style={styles.container}>
                {/*<BlurView
                       style={styles.absolute}
                       blurType="extraDark"
                       blurAmount={10}
                       reducedTransparencyFallbackColor="white"
                             />*/}
                <Animatable.View
                    animation="slideInDown"
                    duration={800}
                    style={styles.topview}
                >

                </Animatable.View>
                <View style={styles.bottomview}>
                    <QRCodeScanner
                        containerStyle={{
                            width: '100%',
                            justifyContent: 'flex-start',
                            alignItems: 'center',
                        }}
                        onRead={this._handleBarCodeRead.bind(this)}
                        /*topContent={
                            <Text style={styles.centerText}>GO</Text>
                        }*/
                        reactivate={this.state.camera}
                        //reactivate={false}
                        /////////切換頁面時要關閉/開啟
                        reactivateTimeout={1500}
                        permissionDialogMessage="need permission to access"
                        showMarker={true}
                        cameraStyle={styles.camerastyle}
                        markerStyle={
                            {
                                width: 200,
                                height: 200,
                                borderColor: 'green',
                                borderRadius: 10,
                                borderWidth: 4
                            }}
                    />
                </View>
            </View >
            /*);
        case 1:
            return <RentalChangePage />;*/
        )
    }
}

const styles = {
    container: {
        flex: 1,
        justifyContent: 'flex-start',//flex-start
        alignItems: 'center',
        backgroundColor: '#04151f',
    },
    absolute: {
        position: "absolute",
        top: 0,
        left: 0,
        bottom: 0,
        right: 0
    },
    camerastyle: {
        ...Platform.select({
            ios: {
            },
            android: {
                width: '100%',
            },
        })
    }
};