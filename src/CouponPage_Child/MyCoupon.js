import React from "react";
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    Image,
    Alert,
    TouchableOpacity,
    DeviceEventEmitter
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import * as firebase from 'firebase';
import Toast from 'react-native-root-toast';
import { storage } from 'firebase'
let hasCoupon;
export default class MyCoupon extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: []
        }
    }
    componentDidMount() {
        this.checkFirstCoupon();
        DeviceEventEmitter.addListener('MyCoupon', (dic) => {
            const that = this;
            this.checkFirstCoupon();
            var RegisterUser = firebase.auth().currentUser;
            firebase.database().ref('users/' + RegisterUser.uid + '/mycoupon').once('value', (snapshot) => {
                var returnArray = [];
                snapshot.forEach((child) => {
                    returnArray.push({
                        key: child.key,
                        name: child.val().name,
                        content: child.val().content,
                        //point: child.val().point,
                        image: child.val().image
                    })
                })
                storage
                this.setState({ data: returnArray.reverse() })
            });
            //接收到详情页发送的通知，刷新首页的数据，改变按钮颜色和文字，刷新UI
        });
        const that = this;
        var RegisterUser = firebase.auth().currentUser;
        firebase.database().ref('users/' + RegisterUser.uid + '/mycoupon').once('value', (snapshot) => {
            var returnArray = [];
            snapshot.forEach((child) => {
                returnArray.push({
                    key: child.key,
                    name: child.val().name,
                    content: child.val().content,
                    //point: child.val().point,
                    image: child.val().image
                })
            })
            storage
            this.setState({ data: returnArray.reverse() })
        });
    }
    refreshCoupon() {
        this.checkFirstCoupon();
        const that = this;
        var RegisterUser = firebase.auth().currentUser;
        firebase.database().ref('users/' + RegisterUser.uid + '/mycoupon').once('value', (snapshot) => {
            var returnArray = [];
            snapshot.forEach((child) => {
                returnArray.push({
                    key: child.key,
                    name: child.val().name,
                    content: child.val().content,
                    //point: child.val().point,
                    image: child.val().image
                })
            })
            storage
            this.setState({ data: returnArray.reverse() })
        });
    }
    checkFirstCoupon() {
        var RegisterUser = firebase.auth().currentUser;
        var ref = firebase.database().ref('users/' + RegisterUser.uid);
        ref.once("value").then(snapshot => {
            hasCoupon = snapshot.child("mycoupon").exists();
            //this.updateOrderLend(hasCoupon);
        });
    }
    showToast(message) {
        Toast.show(message, {
            duration: Toast.durations.SHORT,
            position: Toast.positions.BOTTOM,
            shadow: true,
            animation: true,
            hideOnPress: true,
            delay: 0,
        });
    };
    usecouponalert(key) {
        Alert.alert(
            '提醒',
            '確定使用此優惠券(請交由店員使用)?',
            [
                { text: '取消', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
                { text: '確定', onPress: () => console.log('OK Pressed'), onPress: () => this.usecoupon(key) },
            ],
            { cancelable: false }
        )
    }
    usecoupon(key) {
        var RegisterUser = firebase.auth().currentUser;
        firebase.database().ref('users/' + RegisterUser.uid + '/mycoupon/' + key).remove();
        console.log(key);
        this.showToast("使用成功！")
        this.refreshCoupon.bind(this);
        this.componentDidMount()

    }
    renderItem = ({ item }) => {
        return (
            <LinearGradient
                colors={['#ded7ca', '#04151f']}
                start={{ x: 0, y: 20 }} end={{ x: 1, y: 0 }}
                style={styles.item}
            >
                {
                    // <View style={styles.image_container}>
                    <Image
                        source={{ uri: item.image }}
                        style={styles.image}
                    />
                    // </View>
                }

                <View style={styles.content}>
                    <Text style={{
                        paddingLeft: 10,
                        color: '#ded7ca',
                        fontWeight: 'bold',
                        fontSize: 16
                    }} allowFontScaling={false}>{item.name}</Text>
                    <Text style={{
                        paddingLeft: 10,
                        paddingTop: 6,
                        color: '#ded7ca',
                        fontWeight: 'bold',
                        fontSize: 14,
                    }} allowFontScaling={false}>{item.content}</Text>

                    <View style={{ alignItems: 'flex-end' }}>
                        <TouchableOpacity
                            onPress={() => this.usecouponalert(item.key)}
                            style={{
                                borderRadius: 15,
                                borderWidth: 1,
                                borderColor: '#ded7ca',
                                justifyContent: 'center',
                                alignItems: 'center',
                                paddingHorizontal: 30,
                                paddingVertical: 1
                            }}>
                            <Text style={{
                                fontSize: 15,
                                color: '#ded7ca',
                            }} allowFontScaling={false}>使用</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </LinearGradient>

        )
    }

    ItemSeparatorComponent = () => {
        return (
            <View
                style={{
                    height: 10
                }}
            />
        )
    }

    render() {
        return (
            <View style={styles.container}>
                {hasCoupon== true ?
                    <FlatList style={{ width: '100%' }}
                        data={this.state.data}
                        renderItem={this.renderItem}
                        keyExtractor={(item, index) => index.toString()}
                        ItemSeparatorComponent={this.ItemSeparatorComponent}
                        showsVerticalScrollIndicator={false}
                    /> :
                    <View style={{ height: '50%', alignItems: 'center', justifyContent: 'center'}}>
                        <Text style={{ textAlign: 'center', color: 'gray', fontSize: 18}} allowFontScaling={false}>目前尚無優惠券</Text>
                    </View>
                }
            </View>
        )
    }
}

var styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingBottom: 5,
        width: '100%',
        marginBottom: 180
    },
    flatList: {
        flex: 1,
        marginTop: 10
    },
    item: {
        flex: 1,
        paddingVertical: 10,
        paddingHorizontal: 10,
        flexDirection: 'row',
        borderRadius: 10
    },
    image_container: {
        width: 70,
        height: 70,
    },
    image: {
        width: 70,
        height: 70,
        borderWidth: 3,
        borderColor: '#ded7ca',
        borderRadius: 10
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 10,
        paddingTop: 6
    },
    button: {
        width: 30,
        height: 30,
        backgroundColor: '#04151f',
        borderRadius: 15,
        borderWidth: 1,
        borderColor: '#ded7ca',
        justifyContent: 'center',
        alignItems: 'center'
    },
})