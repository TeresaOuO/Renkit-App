import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Modal,
  Button,
} from 'react-native';
import {
  Avatar,
} from 'react-native-elements';

import * as Animatable from 'react-native-animatable';
import mytoast from './useToast.js';
//姓名、性別(下拉)、密碼(***)、電話、信箱（唯獨）
import * as firebase from 'firebase'

import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import UserPage from './UserPage'


const imageurl = require('../Images/woman1.jpg');//測試用照片位址

class profile extends UserPage {//一個方法，傳回一個畫面
  static navigationOptions = ({ navigation }) => ({
    headerShown: true,
    tabBarLabel: 'Home!',
    headerTitle: '個人資料',//中間title文字
    headerBackTitle: '返回',//左邊button文字
    headerRight: () => (
      <Button
        title="Info"
        color="black"
      />
    ),
    headerStyle: { //頂部樣式
      backgroundColor: '#04151f',
    },
    headerTitleStyle: {//中間title樣式
      color: '#ded7ca'
    },
    headerRight: () => (//右邊title樣式
      <TouchableOpacity
        style={{ marginRight: 20 }}
        onPress={() => navigation.navigate('EditProfileScreen')}
      >
        <Text style={{ color: '#ded7ca', fontSize: 18 }} allowFontScaling={false}>編輯</Text></TouchableOpacity>
    ),//可以使用icon取代文字
    headerTintColor: '#ded7ca'//左邊button顏色
  });

  constructor(props) {
    super(props);//呼叫對應的父類別建構元,props
    /*this.state={//狀態初始化
        modalVisible: false
    }*/
    var RegisterUser = firebase.auth().currentUser;
    this.state = {
      password: '',
      newpassword1: '',
      newpassword2: '',
      errormessage: null,
      modalVisible: false,
      modalVisible_2: false,
      name: '',
      phone: '',
      gender: '',
      email: RegisterUser.email,
      point: '',
      error: '',
      inputtxt: '',
    };
  }
  componentDidMount() {
    const { navigation } = this.props;
    navigation.addListener('willFocus', () => {
      var RegisterUser = firebase.auth().currentUser;
      firebase.database().ref('users/' + RegisterUser.uid).once('value', snapshot => {
        this.setState({
          name: snapshot.val().name,
          phone: snapshot.val().phone,
          point: snapshot.val().point,
          gender: snapshot.val().gender,
          
        });
      });
      firebase.database().ref('users/' + RegisterUser.uid+'/otherdata').once('value', snapshot => {
        this.setState({planet: snapshot.val().missionLevel})
      })
    });

  }
  ErrorMessage = (error = '') => {
    if (error === '') {
      this.setState({ error: '', password: '' })
    } else {
      this.setState({ error: error, password: '' })
    }

  }
  changePassword = (newpassword1, newpassword2) => {
    if (newpassword1 == newpassword2) {//
      {
        if (this.state.newpassword1.length < 6) {
          this.ErrorMessage('密碼須達6碼')
        }
        else {
          this.ErrorMessage();
          firebase.auth().currentUser.updatePassword(newpassword2).then(() => {
            this.setState({
              modalVisible: false,
              modalVisible_2: false
            })
            mytoast.showToast("更改密碼成功")
            this.logoutuser();
          }).catch((error) => {
          });
        }
      }
    }
    else {
      this.ErrorMessage('密碼不一致')
    }
  }
  setModalVisible = (num, visible, password) => {
    //1false全部關掉。2false舊密碼關掉，新密碼打開。3true舊密碼打開，新密碼關掉(一開始進入畫面)
    switch (num) {
      case '1':
        this.setState({
          modalVisible: visible,
          modalVisible_2: visible
        });
        this.ErrorMessage('')
        break;
      case '2':
        const emailCred = firebase.auth.EmailAuthProvider.credential(
          firebase.auth().currentUser.email, this.state.password);
          firebase.auth().currentUser.reauthenticateWithCredential(emailCred)
          .then(() => {
            // User successfully reauthenticated.
            this.setState({
              modalVisible: visible,
              modalVisible_2: !visible
            });
            this.ErrorMessage('')
          })
          .catch((error) => {
            this.ErrorMessage('密碼錯誤')
          });
        break;
      case '3':
        this.setState({
          modalVisible: visible,
          password: ''
        });
        this.ErrorMessage('')
        break;
      default: break;
    }
  }
  /*goToOtherScreen(screenname) {
      this.props.navigation.navigate("UserScreen");
  }*/
  render() {
    const { modalVisible } = this.state;
    const { modalVisible_2 } = this.state;
    return (
      <View style={styles.container}>

        <View style={styles.image}>
          <Avatar rounded source={imageurl} size={190} />
        </View>

        <View style={styles.container3}>
          <Animatable.View
            animation="fadeInUpBig"
            duration={800}
            style={styles.footer}>
            {/* <Text style={styles.text_footer}>姓名</Text>  */}
            <View style={styles.action}>
              <Text style={{
                fontSize: 19,
                color: '#ded7ca',
                fontWeight: 'bold',
              }} allowFontScaling={false}>{this.state.point}</Text>
              <Text style={{
                fontSize: 14,
                color: '#6b6051',
                fontWeight: 'bold',
              }} allowFontScaling={false}>點</Text>
            </View>
            <View style={styles.action}>
              <Text style={{
                fontSize: 19,
                color: '#ded7ca',
                fontWeight: 'bold',
                padding: '0.2%'
              }} allowFontScaling={false}>{this.state.planet}</Text>
              <Text style={{
                fontSize: 14,
                color: '#6b6051',
                fontWeight: 'bold',
              }} allowFontScaling={false}>星球</Text>
            </View>
          </Animatable.View>
          <View style={styles.container2}>
            <Text style={styles.textsize} allowFontScaling={false}>姓名</Text>
            <Text style={styles.textShow} allowFontScaling={false}>{this.state.name}</Text>{/*這裡要接firebase*/}
          </View>
          <View style={styles.container2}>
            <Text style={styles.textsize} allowFontScaling={false}>性別</Text>
            <Text style={styles.textShow} allowFontScaling={false}>{this.state.gender}</Text>{/*這裡要接firebase*/}
          </View>
          <View style={styles.container2}>
            <Text style={styles.textsize} allowFontScaling={false}>密碼</Text>
            <Text style={{
              fontSize: 16,
              textAlign: 'left',
              color: '#ded7ca',
              height: '60%',
              width: '50%',
              fontWeight: 'bold',
              textAlign: 'center',
            }} allowFontScaling={false}>          ******</Text>


            <TouchableOpacity
              style={styles.openButton}
              onPress={() => {
                this.setModalVisible('3', true);
              }}
            >
              <Text style={styles.textStyle} allowFontScaling={false}>更改密碼</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.container2}>
            <Text style={styles.textphone} allowFontScaling={false}>行動電話</Text>
            <Text style={styles.textPhoneShow} allowFontScaling={false}>{this.state.phone}</Text>{/*這裡要接firebase*/}
          </View>
          <View style={styles.container2}>
            <Text style={styles.textsize} allowFontScaling={false}>信箱</Text>
            <Text style={styles.textShow} allowFontScaling={false}>{this.state.email}</Text>{/*這裡要接firebase*/}
          </View>

          <Modal
            animationType="fade"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
              this.setModalVisible('1', false)
              this.setState({ error: ' ' })
            }}
          >

            <View style={styles.centeredView}>

              <View style={styles.modalView}>
                <Text style={{
                  fontSize: 20,
                  fontWeight: 'bold',
                }} allowFontScaling={false}>更改密碼</Text>

                <TextInput
                  ref={input => { this.textInput = input }}
                  style={{
                    fontSize: 20,
                    justifyContent: 'center',
                    width: '100%',  //輸入匡的寬度
                    backgroundColor: '#d2d3ce',
                    marginTop: 10, //輸入框距離標題的高度
                    borderRadius: 5,
                    alignItems: 'flex-start',
                    lineHeight: 25, //輸入框的高度
                    padding: 10 //很重要！讓文字置中
                  }}
                  clearTextOnFocus={true}
                  allowFontScaling={false}
                  id="memail"
                  secureTextEntry={true}
                  placeholder="請輸入舊密碼"
                  onChangeText={(text) => this.setState({ password: text })}
                  value={this.state.password}
                />
                <Text style={{ paddingTop: 10, color: 'red' }}>{this.state.error}</Text>
                <View style={{ flexDirection: 'row', width: '100%', justifyContent: 'space-around' }}>
                  <TouchableOpacity
                    style={{ ...styles.passinsidebtn2 }}
                    onPress={() => { this.setModalVisible('1', false) }}
                  >
                    <Text style={{
                      color: "#022633",
                      fontWeight: "bold",
                      textAlign: "center",
                      fontSize: 16,
                      marginTop: 3,

                    }} allowFontScaling={false}>取消</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{ ...styles.passinsidebtn }}
                    onPress={() => { this.setModalVisible('2', false) }}
                  >
                    <Text style={{
                      color: "white",
                      fontWeight: "bold",
                      textAlign: "center",
                      fontSize: 15,
                      marginTop: 4,

                    }} allowFontScaling={false}>確認</Text>
                  </TouchableOpacity>
                </View>
              </View>

            </View>

          </Modal>
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible_2}
            onRequestClose={() => { this.setModalVisible('1', false) }}
          >
            <View style={styles.centeredView}>
              <View style={styles.modalView2}>

                <Text style={{ fontSize: 30, textAlign: 'left', lineHeight: 50 }} allowFontScaling={false}>更改密碼</Text>
                <Text style={{ fontSize: 20, textAlign: 'left', lineHeight: 50 }} allowFontScaling={false}>請輸入新密碼</Text>

                <TextInput
                  style={{ fontSize: 20, marginTop: -10, backgroundColor: '#d2d3ce', width: '70%', borderRadius: 5, }}
                  allowFontScaling={false}
                  id="memail"
                  secureTextEntry={true}
                  placeholder="請輸入密碼"
                  onChangeText={(text) => this.setState({ newpassword1: text })}
                />

                <Text style={{ fontSize: 20, textAlign: 'left' }} allowFontScaling={false}>再次輸入新密碼</Text>

                <TextInput
                  style={{ fontSize: 20, backgroundColor: '#d2d3ce', width: '70%' }}
                  allowFontScaling={false}
                  id="memail"
                  secureTextEntry={true}
                  placeholder="請輸入密碼"
                  onChangeText={(text) => this.setState({ newpassword2: text })}
                />
                <Text style={{ paddingTop: 10, color: 'red' }}>{this.state.error}</Text>
                <View style={{ flexDirection: 'row', width: "100%", justifyContent: 'space-around' }}>
                  <TouchableOpacity
                    style={{ ...styles.passinsidebtn2 }}
                    onPress={() => {
                      this.setModalVisible('1', false)
                    }}
                  >
                    <Text style={[styles.textStyle, { color: "#022633" }]} allowFontScaling={false}>取消</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{ ...styles.passinsidebtn }}
                    //onPress={() => {this.setModalVisible('4', false);}}
                    onPress={() => this.changePassword(this.state.newpassword1, this.state.newpassword2)}
                  >
                    <Text style={styles.textStyle} allowFontScaling={false}>確認</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
        </View>
      </View>

    )
  }
}
export default profile;
//樣式
const styles = StyleSheet.create({
  container: {
    flex: 1,
    //marginTop: 20,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#04151f',
  },
  container2: {
    flex: 0.12,//控制姓名性別等的行距
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexDirection: 'row',
    width: '80%',
    backgroundColor: '#04151f',
    marginRight: '10%',
    //borderColor: '#37474F',
    //borderWidth: 1.5,
    //borderRadius: 30,

  },
  container3: {
    flex: 1,
    backgroundColor: '#04151f',
    width: '100%',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },

  image: {
    flex: 0.5,
    marginTop: '5%',
    height: '5%',
    justifyContent: 'center',
    //paddingBottom:'5%',

  },
  avatar: {
    width: 190,
    height: 190,
    backgroundColor: "#E1E2E6",
    justifyContent: "center",
    alignItems: "center",
  },
  footer: {
    flexDirection: 'row',
    backgroundColor: '#022633',
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    width: '60%',
    height: '14%',
    //marginTop:'7%',
    marginBottom: '8%'

  },
  action: { //控制點數文字顯示位置
    marginLeft: '10%',
    marginRight: '10%',
    alignItems: "center",
  },
  textsize: {
    height: '65%',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 18,
    width: '25%',
    letterSpacing: 2,
    color: '#6b6051',
  },
  textShow: {
    //height:'20%',
    color: '#ded7ca',
    fontSize: 17,
    height: '65%',
    width: '80%',
    //fontWeight: 'bold',
    marginLeft: Platform.OS === 'ios' ? hp('-3%') : hp('-4%'),
    textAlign: 'center',

  },
  textPhoneShow: {  //控制（右邊）行動電話
    //height:'20%',
    color: '#ded7ca',
    fontSize: 17,
    height: '60%',
    width: '50%',
    //fontWeight: 'bold',
    textAlign: 'center',
  },
  textphone: { //控制（左邊）行動電話
    height: '65%',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 18,
    width: '31%',
    //letterSpacing:2,
    color: '#6b6051',
  },
  centeredView: {//控制modal整體位置
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    //marginTop: 22,
    backgroundColor: 'rgba(178,178,178,0.5)',//可以透過使用rgba讓顏色透明
  },
  modalView: {
    justifyContent: "center",
    margin: 1,
    //backgroundColor: "yellow",
    borderRadius: 5,
    paddingTop: 50,//可以用padding控制或直接用長寬控制
    padding: 30,
    width: wp('90%'),
    height: hp('35%'),
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    backgroundColor: '#f5f5f5',
  },
  modalView2: {
    justifyContent: "center",
    margin: 1,
    //backgroundColor: "yellow",
    borderRadius: 5,
    paddingTop: 50,//可以用padding控制或直接用長寬控制
    padding: 30,
    width: wp('90%'),
    height: Platform.OS === 'ios' ? hp('40%') : hp('55%'),
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    backgroundColor: '#f5f5f5',
  },
  openButton: {//「更改密碼」button樣式
    backgroundColor: "#a8392a",
    //borderRadius: 20,
    borderBottomRightRadius: 5, //右下角
    borderTopRightRadius: 5, //右上角
    borderTopLeftRadius: 5, //左上角
    borderBottomStartRadius: 5, //左下角
    width: '25%',
    height: '85%',
    justifyContent: "center",
    alignItems: 'center',
    marginLeft: '10%',

  },
  passinsidebtn: {//更改密碼裡面按鈕樣式
    backgroundColor: '#022633',
    //borderColor: '#d2d3ce',
    borderRadius: 5,
    padding: 5,
    //paddingTop: 10,
    width: wp('30%'),
    height: hp('6%'),
    marginTop: 10,
    justifyContent: 'center'
  },
  passinsidebtn2: {//更改密碼裡面按鈕樣式
    //backgroundColor: '#d2d3ce',
    borderColor: '#d2d3ce',
    borderWidth: 2,
    borderRadius: 5,
    padding: 5,
    //paddingTop: 10,
    width: wp('30%'),
    height: hp('6%'),
    marginTop: 10,
    justifyContent: 'center'
  },
  textStyle: {//更改密碼
    color: "#e8e8e8",//象牙白
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 14,
    justifyContent: 'center',

  },
  modalText: {//
    marginBottom: 50,
    textAlign: "center"
  },
})

