import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ImageBackground,
    Dimensions,
    Image,
    StatusBar,
    ScrollView,
    TouchableOpacity,
    Alert,
    DeviceEventEmitter,
} from 'react-native';
import AntDesign from "react-native-vector-icons/AntDesign";
import * as firebase from 'firebase'
import mytoast from './useToast.js';
import { storage } from 'firebase'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';


export default class Detailpage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}
    }
    componentDidMount() {
        const that = this;
        firebase.database().ref('coupon/').once('value', (snapshot) => {
            var returnArray = [];
            snapshot.forEach((child) => {
                returnArray.push({
                    name: child.val().name,
                    content: child.val().content,
                    point: child.val().point,
                    image: child.val().image

                })
            })
            storage
            this.setState({ data: returnArray })
        });

    }
    Buyit(point) {

        Alert.alert(
            '是否購買',
            '是否購買此兌換券?',
            [
                { text: '取消', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
                { text: '確定', onPress: () => console.log('OK Pressed'), onPress: () => this.BuyCouponbutton(point) },
            ],
            { cancelable: false }
        );
    }
    BuyCouponbutton(point) {
        var cpoint = point;
        var RegisterUser = firebase.auth().currentUser;
        firebase.database().ref('users/' + RegisterUser.uid).once('value', snapshot => {
            this.setState({
                point: snapshot.val().point
            });
            var usrpoint = this.state.point;
            if (usrpoint >= cpoint) {
                var repoint = (usrpoint - cpoint);
                firebase.database().ref('users/' + RegisterUser.uid).update({
                    point: repoint
                });
                firebase.database().ref('users/' + RegisterUser.uid + '/mycoupon').push(
                    {
                        //this.props.navigation.state.params.key,
                        name: this.props.navigation.state.params.name,
                        content: this.props.navigation.state.params.content,
                        point: point,
                        image: this.props.navigation.state.params.image
                    }
                );
                mytoast.showToast("購買成功！")
                DeviceEventEmitter.emit('CouponPoint', {r_point:repoint});
                DeviceEventEmitter.emit('MyCoupon',{text:'refresh'});
                this.props.navigation.goBack()

            }
            else {
                alert('點數不足');
            }

        });
    }
    render() {
        return (
            <View style={styles.container}>
                <StatusBar barStyle="light-content" />
                <ImageBackground
                    source={require("./asset/circle.png")}
                    style={{
                        height: hp('45%'),
                        width:wp('100%'),
                        alignItems: 'center',
                        justifyContent:'center'

                    }}>
                    <View style={styles.back}>
                        <AntDesign
                            name="arrowleft"
                            color="#ded7ca"
                            size={35}
                            onPress={() => this.props.navigation.goBack()}
                        />
                    </View>
                    <View style={styles.image_container}>
                        <Image
                            source={{ uri: this.props.navigation.state.params.image }}
                            style={styles.image}
                        />
                    </View>
                    <View style={styles.status}>
                        <Text style={{ color: '#ded7ca', fontSize: 15 }}>{this.props.navigation.state.params.point}  Point</Text>
                    </View>
                </ImageBackground>
                <ScrollView style={styles.footer}>
                    <Text style={{
                        color: '#ded7ca',
                        fontSize: 15,
                        fontSize: 20,
                        marginTop: 30,
                        margin: 10
                    }}>品名：</Text>
                    <Text numberOfLines={2} style={styles.textName}>{this.props.navigation.state.params.name.toUpperCase()}</Text>
                    <Text numberOfLines={2} style={styles.textDetail}>說明 ：購買時可{this.props.navigation.state.params.content.toUpperCase()}</Text>
                    <Text style={styles.textDetail1}>使用說明：折價券不得要求變現，抵用時一筆訂單限用一張折價券，請留意該折價券是否有使用規則及使用效期（部分折價券）。折價券折抵部分不再另開立發票，開立發票金額，以該訂單「購買時實際支付的金額」來計算。</Text>
                    {
                        // <Text style={styles.textDetail}>The template details auto text code displays the complete template details, including attribute details and metric details.</Text>
                    }
                    <TouchableOpacity
                        onPress={() => this.Buyit(this.props.navigation.state.params.point)}
                    >
                        <View style={styles.button}>
                            <Text style={styles.textOrder}>兌換</Text>
                        </View>

                    </TouchableOpacity>

                </ScrollView>
            </View>
        )
    }
}
const height = Dimensions.get("screen").height;
const height_image = height * 0.5 * 0.5;

var styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#04151f',
        justifyContent:'center',
    },
    footer: {
        flex: 3,
        paddingHorizontal: 40,
    },
    image_container: {
        width: wp('40%'),
        height: wp('40%'),
        //marginTop: height_image / 3,
        resizeMode: 'contain',
        //backgroundColor: 'red'
    },
    image: {
        width: '100%',
        height: '100%',
        borderWidth: 3,
        borderColor: '#ded7ca',
        borderRadius: height_image / 2
    },
    back: {
        //position: 'absolute',
        //left: 0,
        marginTop: hp('3%'),
        marginLeft: wp('10%'),
        width:'100%',
        flexDirection:'row',
        justifyContent:'flex-start',
        //backgroundColor: 'red'
    },
    status: {
        width: 100,
        alignItems: 'center',
        borderWidth: 1,
        borderRadius: 50,
        paddingVertical: 3,
        borderColor: '#ded7ca',
        fontSize: 20,
        fontWeight: 'bold',
        margin: hp('3%'),
    },
    textName: {
        color: '#ded7ca',
        fontWeight: 'bold',
        fontSize: 20,
        margin: 10
    },
    textDetail: {
        color: '#ded7ca',
        marginTop: 10,
        fontSize: 20,
        margin: 10
    },
    textDetail1: {
        color: 'gray',
        marginTop: Platform.OS === 'ios' ? 50 : 22,
        fontSize: 16,
        margin: 10,
        lineHeight: 23
    },
    button: {
        alignItems: 'center',
        margin: 20,
        paddingVertical: 10,
        borderRadius: 100,
        backgroundColor: '#022633',
    },
    textOrder: {
        color: '#ded7ca',
        fontWeight: 'bold',
        fontSize: 18
    }
})