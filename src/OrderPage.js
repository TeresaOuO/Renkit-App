import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  Animated,
  FlatList,
  Dimensions,
  DeviceEventEmitter,
} from 'react-native';
import * as firebase from 'firebase'
//import TouchableScale from 'react-native-touchable-scale';
import * as Animatable from 'react-native-animatable';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { storage } from 'firebase'
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

var hasOrder

const { width } = Dimensions.get("window");
export default class OrderPage extends Component {

  constructor(props) {
    super(props);
    this.state = {
      active: 0,
      xTabOne: 0,
      xTabTwo: 0,
      translateX: new Animated.Value(0),
      translateXTabOne: new Animated.Value(0),
      translateXTabTwo: new Animated.Value(width),
      translateY: -1000,
      key: '',
      rentaldate: '',
      returndate: '',
      item_array: [],
      order_v: "orderdown"
    };
  }

  handleSlide = type => {
    let {
      active,
      xTabOne,
      xTabTwo,
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
  componentDidMount() {
    DeviceEventEmitter.addListener('ChangeOrder', (dic) => {
      this.refreshorder();
      this.checkFirstOrder();
      //接收到详情页发送的通知，刷新首页的数据，改变按钮颜色和文字，刷新UI
      this.setState({
        order_v: dic.text,
        usetimes:dic.r_point,
      });
      var RegisterUser = firebase.auth().currentUser;
    const that = this;
    firebase.database().ref('users/' + RegisterUser.uid + '/myorder').once('value', (snapshot) => {
      var returnArray = [];
      snapshot.forEach((child) => {
        if(child.val().useState=="false"){
        returnArray.push({
          key: child.val().orderId,
          rentaldate: child.val().rentaldate,
          returndate: child.val().returndate,
        })
      }
      })
      this.setState({ item_array: returnArray })
    });
    });
    this.checkFirstOrder();
    var RegisterUser = firebase.auth().currentUser;
    const that = this;
    firebase.database().ref('users/' + RegisterUser.uid + '/myorder').once('value', (snapshot) => {
      var returnArray = [];
      snapshot.forEach((child) => {
        if(child.val().useState=="false"){
        returnArray.push({
          key: child.val().orderId,
          rentaldate: child.val().rentaldate,
          returndate: child.val().returndate,
        })
      }
      })
      this.setState({ item_array: returnArray })
    });
    var RegisterUser = firebase.auth().currentUser;
    firebase.database().ref('users/' + RegisterUser.uid).once('value', snapshot => {
      this.setState({
        usetimes: snapshot.val().usetimes
      });
    })
    firebase.database().ref('users/' + RegisterUser.uid + '/myorder').orderByChild("useState").equalTo('true').once("child_added", snapshot => {
      this.setState({
        rentalingdate: snapshot.val().rentaldate,
        rentalkey: snapshot.val().orderId,
        rentalcupid: snapshot.val().cupId,
      });
      firebase.database().ref('cups/' + this.state.rentalcupid).once("value", snapshot => {
        this.setState({
          rentalshopid: snapshot.val().CurrentStore,
        });
        firebase.database().ref('Shops/' + this.state.rentalshopid).once("value", snapshot => {
          storage
          this.setState({
            rentalshop: snapshot.val().name,
            picture: snapshot.val().picture,
            order_v: "ordershown"
          });
        })
      })
    })
  }
  refreshorder() {
    var RegisterUser = firebase.auth().currentUser;
    firebase.database().ref('users/' + RegisterUser.uid).once('value', snapshot => {
      this.setState({
        usetimes: snapshot.val().usetimes
      });
    })
    firebase.database().ref('users/' + RegisterUser.uid + '/myorder').orderByChild("useState").equalTo('true').once("child_added", snapshot => {
      this.setState({
        rentalingdate: snapshot.val().rentaldate,
        rentalkey: snapshot.val().orderId,
        rentalcupid: snapshot.val().cupId,
      });
      firebase.database().ref('cups/' + this.state.rentalcupid).once("value", snapshot => {
        this.setState({
          rentalshopid: snapshot.val().CurrentStore,
        });
        firebase.database().ref('Shops/' + this.state.rentalshopid).once("value", snapshot => {
          storage
          this.setState({
            rentalshop: snapshot.val().name,
            picture: snapshot.val().picture,
            order_v: "ordershown"
          });
        })
      })
    })
  }
  checkFirstOrder() {
    var RegisterUser = firebase.auth().currentUser;
    var ref = firebase.database().ref('users/' + RegisterUser.uid);
    ref.once("value").then(snapshot => {
      hasOrder = snapshot.child("myorder").exists();
      //hasOrder = snapshot.hasChild("myorder"); // true
      //this.updateOrderLend(hasOrder);
    });
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

        <View style={styles.header}>

          <View style={{ width: wp('90%'), paddingTop: hp('10%'), flexDirection: 'row', justifyContent: 'flex-end' }}>

            <View style={{ width: wp('70%'), justifyContent: 'center', alignItems: 'center' }}>

            </View>

            <TouchableOpacity
              onPress={() => this.props.navigation.navigate('CupRentalScreen')}
            >
              <MaterialCommunityIcons
                name="qrcode-scan"
                theme="filled"
                color="#453d34"
                size={wp('8%')}
              />
            </TouchableOpacity>

          </View>
          <View style={{ height: '50%', marginBottom: hp('10%') }}>
            <Text style={[styles.logoText]} allowFontScaling={false}>累積租借次數：</Text>
            <Text style={{
              color: '#04151f',
              textAlign: 'center',
              justifyContent: 'center',
              alignItems: 'center',
              fontSize: 40,
            }}
              allowFontScaling={false}
            >{this.state.usetimes}</Text>

            <Text style={{
              color: '#04151f',
              fontSize: 16,
              textAlign: 'center',
              marginBottom: '10%',
            }}
              allowFontScaling={false}
            >cups</Text>
          </View>
        </View>

        <Animatable.View
          style={styles.footer}
          animation="fadeInUpBig">
          <View //訂單卡片外框長度
            style={{
              width: '85%',
              marginLeft: 'auto',
              marginRight: 'auto',
              alignItems: 'center',
              //backgroundColor: 'blue',
            }}>
            <View //上方滑動滾輪（租借中、已歸還）的位置
              style={{
                flexDirection: 'row',
                marginTop: 28,
                marginBottom: 70,
                height: 36,
                position: 'relative',

              }}>
              <Animated.View
                style={{
                  position: 'absolute',
                  width: '50%',
                  height: '100%',
                  top: 0,
                  left: 0,
                  backgroundColor: '#a8392a',
                  borderColor: '#0d212b',
                  borderWidth: 1,
                  borderRadius: 40,
                  transform: [{
                    translateX
                  }]
                }}
              />
              <TouchableOpacity
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                  //borderWidth: 1,
                  //borderColor: '#ded7ca',
                  borderRadius: 40,
                  borderRightWidth: 0,
                  borderTopRightRadius: 0,
                  borderBottomRightRadius: 0,


                }}
                onLayout={event => this.setState({ xTabOne: event.nativeEvent.layout.x })}
                onPress={() => this.setState({ active: 0 }, () => this.handleSlide(xTabOne))}
              >
                <Text
                  style={{
                    color: active === 0 ? '#04151f' : '#585d5e',
                    fontWeight: 'bold',
                    textAlign: 'center',
                    marginTop: '2%',
                    fontSize: active === 0 ? 17 : 15,
                  }}
                  allowFontScaling={false}
                >租借中</Text>


              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: 40,
                  borderLeftWidth: 0,
                  borderTopLeftRadius: 0,
                  borderBottomLeftRadius: 0,

                }}
                onLayout={event => this.setState({ xTabTwo: event.nativeEvent.layout.x })}
                onPress={() => this.setState({ active: 1 }, () => this.handleSlide(xTabTwo))}
              >
                <Text
                  style={{
                    color: active === 1 ? '#04151f' : '#585d5e',
                    fontWeight: 'bold',
                    textAlign: 'center',
                    marginTop: '2%',
                    fontSize: active === 0 ? 15 : 17,
                  }}
                  allowFontScaling={false}
                >已歸還</Text>
              </TouchableOpacity>


            </View>

            <Animated.View
              style={{
                //justifyContent: "center",
                alignItems: "center",
                width: '100%',
                height: hp('50%'),
                //marginTop:'-20%',
                transform: [{
                  translateX: translateXTabOne
                }]
              }}
              onLayout={
                event => this.setState({
                  translateY: event.nativeEvent.layout.height
                })
              }>
              {this.state.order_v == "orderdown" ?
                <View style={{ height: '50%', alignItems: 'flex-start', justifyContent: 'center' }}>
                  <Text style={{ textAlign: 'center', color: 'gray', fontSize: 18, }} allowFontScaling={false}>目前尚無訂單</Text>
                </View> :
                <View style={{
                  backgroundColor: '#ded7ca',
                  elevation: 2,
                  borderRadius: 10,
                  width: '90%',
                  shadowColor: "#000",
                  shadowRadius: 5,
                  shadowOpacity: 0.3,
                  shadowOffset: { x: 2, y: -2 },
                  alignItems: 'center',
                }}>
                  <Image
                    source={{ uri: this.state.picture }}
                    style={{
                      position: 'absolute',
                      top: -39,
                      width: 75,
                      height: 75,
                      borderRadius: 50,
                      shadowColor: "#000",
                      shadowRadius: 5,
                      shadowOpacity: 0.4,
                      shadowOffset: { x: 2, y: -2 },
                    }}
                  //rounded source={this.state.picture}
                  />

                  <Text style={{ textAlign: 'center', marginTop: '18%', fontSize: 18, fontWeight: 'bold', color: '#04151f', }} allowFontScaling={false} >{this.state.rentalshop}</Text>
                  {/*<Text style={{ textAlign: 'center', marginTop: 10, color: '#04151f' }}>龜山分店</Text>*/}
                  <Text style={{ textAlign: 'center', marginTop: 10, color: '#04151f' }} allowFontScaling={false}>訂單編號：{this.state.rentalkey}</Text>
                  <Text style={{ textAlign: 'center', marginTop: 5, marginBottom: -5, color: '#04151f' }} allowFontScaling={false}>租借日期：{this.state.rentalingdate}</Text>


                  <View style={styles.buttonreturn}>
                    <TouchableOpacity
                      onPress={() => this.props.navigation.navigate('CupRentalScreen')}  //出現歸還的QR-code
                      style={[{
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderColor: '#c6432a',
                        borderWidth: 1,
                        padding: 5,
                        borderRadius: 5,
                        marginTop: 20,
                        width: 62,
                        marginBottom: 12,
                      }]}
                    >

                      <Text
                        style={[{
                          color: '#c6432a',
                          textAlign: 'center',
                          fontWeight: 'bold',
                        }]}
                        allowFontScaling={false}>
                        歸還
                        </Text>
                    </TouchableOpacity>

                  </View>
                </View>
              }
            </Animated.View>

            <Animated.View
              style={{
                width: '100%',
                height: hp('45%'),
                justifyContent: "center",
                alignItems: "center",
                marginTop: '-17%',
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
              {hasOrder == false ?
                <View style={{ height: '50%', alignItems: 'flex-start', justifyContent: 'center' }}>
                  <Text style={{ textAlign: 'center', color: 'gray', fontSize: 18, }} allowFontScaling={false}>目前尚無訂單</Text>
                </View> :
                <FlatList
                  style={{ width: '95%', }}
                  showsVerticalScrollIndicator={false}
                  data={this.state.item_array.reverse()}
                  keyExtractor={item => item.id}
                  renderItem={({ item }) => {
                    return (
                      <View style={{
                        borderBottomWidth: 2,
                        borderBottomColor: '#0d212b',
                        width: '100%',
                        flexDirection: 'column',
                      }}>

                        <Text style={styles.storeTitle} allowFontScaling={false}>{item.key}</Text>
                        <Text style={styles.itemall} allowFontScaling={false}>租借日期：{item.rentaldate}</Text>
                        <Text style={styles.itemall2} allowFontScaling={false}>歸還日期：{item.returndate}</Text>


                      </View>
                    )
                  }}
                >
                </FlatList>
              }
            </Animated.View>
          </View>
        </Animatable.View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ded7ca'
  },
  header: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ded7ca',

  },
  footer: {
    flex: 2,
    backgroundColor: '#04151f',
    borderTopRightRadius: 30,
    borderTopLeftRadius: 30,
    paddingVertical: 20,//文字離footer邊框的高度
    paddingHorizontal: 20,//文字離footer邊框的長度
  },
  storeTitle: {
    marginBottom: 6,
    marginTop: 3,
    color: '#ded7ca',
    fontSize: 18,
    fontWeight: 'bold',
    //allowFontScaling:false,
  },
  itemall: {
    marginBottom: 4,
    color: '#787571',
    fontSize: 14,
    fontWeight: 'bold',
    lineHeight: 20,
    //allowFontScaling:false,
  },
  itemall2: { //租借/歸還
    //marginBottom:10,
    color: '#787571',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 10,
    //allowFontScaling:false,

  },
  carddetail: {
    justifyContent: 'center',
    alignSelf: 'center',
    flexDirection: 'row',
    backgroundColor: '#f7f3e9',
    height: '16%',
    marginRight: '7%',
    marginLeft: '2%',
    marginBottom: '7%',
    marginTop: '5%',
    borderRadius: 10,
    shadowColor: '#b8ae9e',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.36,
    shadowRadius: 6.68,
    elevation: 19,
    paddingLeft: '5%',

  },
  card: {
    justifyContent: 'center',
    alignSelf: 'center',
    shadowColor: 'white',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.36,
    shadowRadius: 6.68,
    elevation: 19,
  },

  singIn: { //掃描按鈕
    width: 120,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
    flexDirection: 'row',
    marginTop: 35


  },
  textSign: {//掃描QR-code文字
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'gray',
    marginLeft: 9
  },

  buttonQR: {
    marginBottom: 1,
    right: '-36%'

  },
  buttonreturn: {
    marginBottom: 4,
    alignItems: "center",
  },

  logoText: {
    color: '#04151f',
    fontSize: 20,
    textAlign: 'center',
    alignSelf: 'center',
    //paddingLeft:wp('10%')
    //backgroundColor:'blue'
    //paddingVertical: 10
  },


});