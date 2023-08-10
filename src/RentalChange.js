import React, { Component, useImperativeHandle } from 'react';
import {
    Animated,
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Platform,
    DeviceEventEmitter,
} from 'react-native';
import * as firebase from 'firebase'
import AntDesign from "react-native-vector-icons/AntDesign";
import { CountdownCircleTimer } from 'react-native-countdown-circle-timer'

var date = new Date();
var year = date.getFullYear().toString();
var month = (date.getMonth() + 1) < 10 ? ("0" + (date.getMonth() + 1)) : (date.getMonth() + 1);
var day = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate());
var hasOrder, orderid = "SDO-U-";

export default class RentalChangePage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
        };

        this.state = {
            switch: this.props.navigation.state.params.case,
            cupId: '',
            StoreId: '',
            pageIndex: 0,
            checkorder: "false",
            usertimes: 0,
            UseTimes: 0,
            cup_num: 0,
            CurrentStore: '',
        };
        switch (this.state.switch) {//值1是租借2是歸還
            case 1: this.state.cupId = this.props.navigation.state.params.cupId; this.checkFirstOrder(); break;//確認是否第一次租借
            case 2: this.state.StoreId = this.props.navigation.state.params.storeId; this.updateOrderBack(); break;
        }
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
    screenChange() {//跳轉至訂單
        this.setState({ pageIndex: 1 });
    }
    checkFirstOrder() {
        var RegisterUser = firebase.auth().currentUser;
        var ref = firebase.database().ref('users/' + RegisterUser.uid);
        ref.once("value").then(snapshot => {
            hasOrder = snapshot.child("myorder").exists();
            //hasOrder = snapshot.hasChild("myorder"); // true
            this.updateOrderLend(hasOrder);
        });
    }
    updateOrderLend(hasOrder) {//租借
        //如果hasOrder是false表示第一次租借
        var RegisterUser = firebase.auth().currentUser;
        if (!hasOrder) {
            firebase.database().ref('users/' + RegisterUser.uid).once('value', snapshot => {//使用者租借次數
                var checkusertimes = snapshot.val().usetimes
                checkusertimes++;
                orderid += checkusertimes;
                firebase.database().ref('users/' + RegisterUser.uid + '/myorder').push({
                    cupId: this.state.cupId,
                    rentaldate: (year + month + day),
                    //point: 2,
                    useState: 'true',
                    orderId: orderid
                });
                orderid = "SDO-U-";
            });
            firebase.database().ref('cups/' + this.state.cupId).once('value', snapshot => {//杯子使用次數
                this.setState({
                    UseTimes: snapshot.val().UseTimes
                });
                var store=snapshot.key;
                let CupUseTimes = (this.state.UseTimes) + 1;
                firebase.database().ref('cups/' + this.state.cupId).update({
                    UserId: RegisterUser.uid,
                    UseTimes: CupUseTimes
                })
                firebase.database().ref("Shops/"+store).once("value")
                    .then(function (snapshot) {
                        var c = snapshot.child("history/"+year+'-'+month).exists(); // true
                        if(c){
                            var usecup=snapshot.val().cup
                            usecup++;
                            firebase.database().ref('Shops/' + store+'/history/'+year+'-'+month).update({
                                cup:usecup
                            })
                        }
                    });
            });
            var gameopen = true;
            firebase.database().ref('users/' + RegisterUser.uid + '/otherdata').update({
                playgame: gameopen
            });
            DeviceEventEmitter.emit('gameOC', { text: gameopen });
            DeviceEventEmitter.emit('ChangeOrder', { text: 'ordershown' });
        } else {
            var num = 1;
            firebase.database().ref('users/' + RegisterUser.uid + '/myorder').once('value', (snapshot) => {
                snapshot.forEach((child) => {
                    if (child.val().useState == 'true') {//訂單中有租借中的
                        num = 0;
                    }
                })
                if (num != 0) {
                    firebase.database().ref('cups/' + this.state.cupId).once('value', snapshot => {
                        //判斷杯子的使用者是否false
                        if (snapshot.val().UserId == 'false') {
                            this.setState({
                                StoreId: snapshot.val().CurrentStore,
                                UseTimes: snapshot.val().UseTimes,
                                CurrentStore: snapshot.val().CurrentStore
                            })
                            let CupUseTimes = (this.state.UseTimes) + 1;
                            firebase.database().ref('cups/' + this.state.cupId).update({//updateCup
                                UserId: RegisterUser.uid,
                                UseTimes: CupUseTimes
                            });
                            var gameopen = true;
                            firebase.database().ref('users/' + RegisterUser.uid + '/otherdata').update({
                                playgame: gameopen
                            });
                            DeviceEventEmitter.emit('gameOC', { text: gameopen });
                            firebase.database().ref('users/' + RegisterUser.uid).once('value', snapshot => {//使用者租借次數
                                var checkusertimes = snapshot.val().usetimes
                                checkusertimes++;
                                orderid += checkusertimes;
                                firebase.database().ref('users/' + RegisterUser.uid + '/myorder').push({
                                    cupId: this.state.cupId,
                                    rentaldate: (year + month + day),
                                    //point: 2,
                                    useState: 'true',
                                    orderId: orderid
                                });
                                orderid = "SDO-U-";
                            });
                            firebase.database().ref('Shops/' + this.state.CurrentStore).once('value', snapshot => {//租借店家杯數
                                this.setState({
                                    cup_num: snapshot.val().cup_num
                                });
                                let rentalcups = (this.state.cup_num) - 1;
                                firebase.database().ref('Shops/' + this.state.CurrentStore).update({
                                    cup_num: rentalcups
                                })
                            });
                            //alert("租借成功")
                        } else {
                            //alert("杯子正在使用")
                        }
                    });
                } else { //alert("已經有使用中的訂單了") 
                }
            })
            DeviceEventEmitter.emit('ChangeOrder', { text: 'ordershown' });
        }
    }
    updateOrderBack() { //歸還
        var RegisterUser = firebase.auth().currentUser;
        //訂單更改
        firebase.database().ref('users/' + RegisterUser.uid + '/myorder').orderByChild("useState").equalTo('true').once("child_added", snapshot => {
            var orderItem = snapshot.key;
            var cupid = snapshot.val().cupId;
            firebase.database().ref('users/' + RegisterUser.uid + '/myorder/' + orderItem).update({
                returndate: (year + month + day),
                useState: 'false',
            });
            firebase.database().ref('cups/' + cupid).update({
                CurrentStore: this.state.StoreId,
                UserId: 'false',
            });
            firebase.database().ref('users/' + RegisterUser.uid).once('value', snapshot => {//使用者租借次數
                this.setState({
                    usertimes: snapshot.val().usetimes,
                    point: snapshot.val().point,
                });
                let userretaltimes = (this.state.usertimes) + 1;
                let repoint = (this.state.point) + 10;//回饋使用者點數
                firebase.database().ref('users/' + RegisterUser.uid).update({
                    usetimes: userretaltimes,
                    point: repoint
                })
                DeviceEventEmitter.emit('ChangeOrder', { text: 'orderdown', r_point: repoint, r_times: userretaltimes });
            })
            firebase.database().ref('Shops/' + this.state.StoreId).once('value', snapshot => {//歸還店家杯數
                this.setState({
                    washcup: snapshot.val().washCup
                });
                let returncups = (this.state.washcup) + 1;
                firebase.database().ref('Shops/' + this.state.StoreId).update({
                    washCup: returncups
                })
                firebase.database().ref('cups/' + cupid).update({
                    WashId: returncups
                });
            });

        });
    }

    render() {
        return (
            <View style={styles.container} >

                <TouchableOpacity
                    onPress={() => this.props.navigation.replace("CupRentalScreen")}
                    //onPress={this.screenChange.bind(this)}//跳轉至訂單
                    //onPress={this.replaceScene.bind(this)}
                    //onPress={() =>navigation.navigate("OrderScreen")}
                    style={styles.ball}
                >
                    <AntDesign
                        name="left"
                        color='gray'
                        size={25}
                    />

                </TouchableOpacity>
                {/* <Image source={require('./asset/check-circle.gif')} />*/}

                <View style={styles.imageview}>
                    {/* <Avatar
                            rounded source={showimage}
                            size={150}
                            marginBottom='8%'
                        /> */}
                    <CountdownCircleTimer
                        isPlaying
                        size={120}
                        //initialRemainingTime={3} //延遲秒數
                        duration={2}
                        colors={[//__________________時間動態顏色可更改
                            ['#004777', 0.4],
                            ['#F7B880', 0.4],
                            ['#a8392a', 0.2],
                        ]}
                        onComplete={() => {
                            return [false, 0] // repeat animation in 1.5 seconds
                        }}
                    >
                        {({ remainingTime, animatedColor }) => (
                            <Animated.Text style={{ color: "#ded7ca", fontSize: 50 }}>
                                {/* {remainingTime} */}
                                {remainingTime <= 0.3 ?
                                    '✔︎'
                                    :
                                    null
                                }

                            </Animated.Text>
                        )}
                    </CountdownCircleTimer>

                    <Text style={{
                        color: '#ded7ca',
                        fontSize: 25,
                        marginBottom: 22,
                        marginTop: Platform.OS === 'ios' ? 20 : 35,
                        fontWeight: 'bold',
                    }}>RENK IT SUCCESSFUL !</Text>

                    <Text style={{
                        fontSize: 40,
                        alignSelf: 'center',
                        marginTop: Platform.OS === 'ios' ? 50 : 30,
                        marginBottom: Platform.OS === 'ios' ? 20 : 10,
                        color: '#ded7ca',
                        fontWeight: 'bold',
                        letterSpacing: 1,
                        textShadowOffset: { width: 3, height: 5 },
                    }}>{this.state.name}</Text>{/**顯示姓名 */}
                    <Text style={{
                        color: '#022633',
                        fontSize: 45,
                        fontWeight: 'bold',
                        letterSpacing: 1,
                        marginBottom: Platform.OS === 'ios' ? -5 : -15,
                    }}>“</Text>
                    <Text style={{
                        color: 'gray',
                        fontSize: 12,
                        //marginTop:3,
                        lineHeight: 20,
                        alignSelf: 'center',
                        textAlign: 'center'
                    }}>感謝您的租借{"\n"}點數已回饋至Cupon頁面{"\n"}{"\n"}
                            Thank you for renting！ {"\n"}Points have been returned to the COUPON page.
                        </Text>


                    <TouchableOpacity
                        onPress={() => { this.props.navigation.goBack(); }}
                        //this.props.navigation.state.params.callBack("i");
                        //onPress={this.screenChange.bind(this)}//跳轉至訂單
                        //onPress={(navigation) => this.props.navigation.goBack()}
                        //onPress={() => this.goBack()}
                        //onPress={() =>this.props.navigation.navigate("OrderScreen")}
                        style={[{//查看我的訂單按鈕樣式
                            backgroundColor: "#a8392a",
                            //borderRadius: 20,
                            borderRadius: 45,
                            position: 'absolute',
                            bottom: Platform.OS === 'ios' ? 40 : 30,
                            width: '35%',
                            height: Platform.OS === 'ios' ? 40 : 42,
                            justifyContent: "center",
                            alignItems: 'center',
                            //marginLeft: '10%',
                        }]}
                    >
                        <Text style={{ color: '#e8e8e8', fontWeight: 'bold' }}>查看我的訂單</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
}

var styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#04151f',
    },
    imageview: {
        flex: 5,
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginTop: Platform.OS === 'ios' ? 55 : 1,
        //borderWidth:2,
        //borderColor:'white'
        //backgroundColor: 'powderblue'
    },

    ball: {
        flex: 1,
        //position:'absolute',
        top: Platform.OS === 'ios' ? 55 : 32,
        left: Platform.OS === 'ios' ? 18 : 22,
    },
});