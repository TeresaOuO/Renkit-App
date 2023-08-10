import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    Dimensions,
    TouchableOpacity,
    Animated,
} from 'react-native';
import BuyCoupon from "./CouponPage_Child/BuyCoupon";
import MyCoupon from "./CouponPage_Child/MyCoupon";
import * as firebase from 'firebase'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const { width } = Dimensions.get("window");
export default class CouponPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            active: 0,
            xTabOne: 0,
            xTabTwo: 0,
            translateX: new Animated.Value(0),
            translateXTabOne: new Animated.Value(0),
            translateXTabTwo: new Animated.Value(width),
            translateY: -1000
        };
    }
    componentDidMount() {
        const { navigation } = this.props;
        navigation.addListener('willFocus', () => {
            var RegisterUser = firebase.auth().currentUser;
            firebase.database().ref('users/' + RegisterUser.uid).once('value', snapshot => {
                this.setState({
                    point: snapshot.val().point
                });
            });
        });
    }
    handleSlide = type => {
        let {
            active,
            translateX,
            translateXTabOne,
            translateXTabTwo
        } = this.state;
        Animated.spring(translateX, {
            toValue: type,
            durtion: 100,
            useNativeDriver: true
        }).start()
        if (active === 0) {
            Animated.parallel([
                Animated.spring(translateXTabOne, {
                    toValue: 0,
                    duration: 100,
                    useNativeDriver: true
                }).start(),
                Animated.spring(translateXTabTwo, {
                    toValue: width,
                    duration: 100,
                    useNativeDriver: true
                }).start()
            ]);
        } else {
            Animated.parallel([
                Animated.spring(translateXTabOne, {
                    toValue: -width,
                    duration: 100,
                    useNativeDriver: true
                }).start(),
                Animated.spring(translateXTabTwo, {
                    toValue: 0,
                    duration: 100,
                    useNativeDriver: true
                }).start()
            ]);
        }
    }

    render() {
        let {
            xTabOne,
            xTabTwo,
            translateX,
            active,
            translateXTabOne,
            translateXTabTwo,
            translateY
        } = this.state;
        return (
            <View style={styles.container}>
                <View style={{
                    flex: 1,
                    width: wp('90%'),
                    alignItems: 'center',
                    justifyContent: 'center',
                    //margin: Platform.OS === 'ios' ? 45 : 5,
                    //paddingTop: hp('5%'),
                    //backgroundColor:"green"
                }}>
                    <Text style={{
                        color: '#ded7ca',
                        fontSize: 19,
                        marginTop: 20,
                    }} allowFontScaling={false}
                    >您現在的點數有：</Text>
                    <Text style={{
                        color: '#ded7ca',
                        fontSize: 40,
                        padding: 5,
                    }} allowFontScaling={false}
                    >{this.state.point}</Text>
                    <Text style={{
                        color: '#ded7ca',
                        fontSize: 16
                    }} allowFontScaling={false}
                    >points</Text>
                </View>

                <View style={{
                    flex: 3,
                    width: '90%',
                    //backgroundColor:"red"
                }}>
                    <View style={{
                        flexDirection: 'row',
                        marginBottom: 20,
                        height: 40,
                        position: 'relative'
                    }}>
                        <Animated.View style={{
                            position: 'absolute',
                            width: '50%',
                            height: '100%',
                            top: 0,
                            left: 0,
                            backgroundColor: '#ded7ca',
                            borderRadius: 4,
                            transform: [{
                                translateX
                            }]
                        }}
                        />
                        <TouchableOpacity style={{
                            flex: 1,
                            justifyContent: 'center',
                            alignItems: 'center',
                            borderWidth: 1,
                            borderColor: '#ded7ca',
                            borderRadius: 4,
                            borderRightWidth: 0,
                            borderTopRightRadius: 0,
                            borderBottomRightRadius: 0,

                        }}
                            onLayout={event => this.setState({ xTabOne: event.nativeEvent.layout.x })}
                            onPress={() => this.setState({ active: 0 }, () => this.handleSlide(xTabOne))}
                        >
                            <Text style={{ color: active === 0 ? 'black' : '#ded7ca' }} allowFontScaling={false}>點數兌換</Text>

                        </TouchableOpacity>

                        <TouchableOpacity style={{
                            flex: 1,
                            justifyContent: 'center',
                            alignItems: 'center',
                            borderWidth: 1,
                            borderColor: '#ded7ca',
                            borderRadius: 4,
                            borderLeftWidth: 0,
                            borderTopLeftRadius: 0,
                            borderBottomLeftRadius: 0
                        }}
                            onLayout={event => this.setState({ xTabTwo: event.nativeEvent.layout.x })}
                            onPress={() => this.setState({ active: 1 }, () => this.handleSlide(xTabTwo))}
                        >
                            <Text style={{ color: active === 1 ? 'black' : '#ded7ca' }} allowFontScaling={false}>我的兌換券</Text>

                        </TouchableOpacity>

                    </View>

                    {/* <ScrollView
                        style={{backgroundColor:"purple"}}
                        initialPage={0}
                        renderTabBar={() => <DefaultTabBar />}
                    > */}

                    <Animated.View style={{
                        height: hp('56%'),
                        //backgroundColor:"gray",
                        justifyContent: "center",
                        alignItems: "center",
                        transform: [{
                            translateX: translateXTabOne
                        }]
                    }}
                        onLayout={
                            event => this.setState({
                                translateY: event.nativeEvent.layout.height
                            })
                        }>
                        <BuyCoupon tabLabel="BuyCoupon" props={this.props} />
                    </Animated.View>

                    <Animated.View style={{
                        height: hp('82%'),
                        //backgroundColor:"purple",
                        justifyContent: "center",
                        alignItems: "center",
                        transform: [
                            {
                                translateX: translateXTabTwo
                            },
                            {
                                translateY: -translateY
                            }
                        ]
                    }}
                    >
                        <MyCoupon tabLabel="MyCoupon" props={this.props} />

                    </Animated.View>

                    {/* </ScrollView> */}

                </View>
            </View>
        )
    }
}
var styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: '#04151f',
        alignItems: 'center'
    },
    test1: {
        backgroundColor: '#DDDDDD',
        marginTop: 5,
        height: 70,
        marginLeft: 15,
        marginRight: 15,
        borderRadius: 10

    },
    tabbar: {
        flex: 1
    },
    title: {
        color: 'white',
        marginTop: 25,
        fontWeight: 'bold',
        fontSize: 25
    },

});
