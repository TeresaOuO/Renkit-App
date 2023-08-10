import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    Alert,
    Modal,

} from 'react-native';
import HomePageScreen from './HomePage';
import FontAwesome from "react-native-vector-icons/FontAwesome"
import Feather from "react-native-vector-icons/Feather"
import LinearGradient from 'react-native-linear-gradient';
import * as Animatable from 'react-native-animatable';
import * as firebase from 'firebase'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

export default class SingInComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            check_textInputChange: false,
            email: '',
            password: '',
            errormessage: null,
            secureTextEntry: true,
            modalShow: false,
        }
    }
    loginUser = (email, password) => {

        firebase
            .auth()
            .signInWithEmailAndPassword(email, password)
            .then(() => {
                var user = firebase.auth().currentUser;
                if (user) {
                    this.props.navigation.replace("TabScreen");
                }
            }
            )
            .catch(error => this.setState({ errormessage: error.message }));

    }
    textInputChange(value) {
        if (value.length !== 0) {
            this.setState({
                check_textInputChange: true
            });
        }
        else {
            this.setState({
                check_textInputChange: false
            });
        }
    }

    secureTextEntry() {
        this.setState({
            secureTextEntry: !this.state.secureTextEntry
        })
    }
    forgotPassword = (email) => {
        if(email==''){
            Alert.alert(
                '空白電子郵件',
                '請輸入再次輸入電子郵件',
                [
                    { text: '確定', onPress: () => console.log('OK Pressed') },
                ],
                { cancelable: false }
            )
        }else{
            firebase.auth().sendPasswordResetEmail(email)
            .then(function (user) {
                Alert.alert(
                    '密碼重設',
                    '密碼重設郵件已寄出，請檢查您的郵件',
                    [
                        { text: '確定',},
                    ],
                    { cancelable: false }
                )
            }).catch(function (e) {
                console.log(e)
                Alert.alert(
                    '無效電子郵件',
                    '請檢查您輸入的電子郵件是否有註冊',
                    [
                        { text: '確定',},
                    ],
                    { cancelable: false }
                )
            })
            this.setState({modalShow:false});
            this.setState({email:''})
        }     
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={[styles.text_header, { color: '#e8e8e8' }, { fontSize: 43 }]}>RENKiT</Text>
                    <Text style={[styles.logoText]}>登入以繼續</Text>
                </View>

                <Animatable.View
                    animation="fadeInUpBig"
                    style={styles.footer}>
                    <Text style={styles.text_footer}>電子郵件</Text>
                    <View style={styles.action}>

                        <FontAwesome
                            name="user-o"
                            color="#04151f"
                            size={20}
                            style={{ marginLeft: 5 }}
                        />

                        <TextInput
                            placeholder="輸入電子郵件..."
                            style={styles.textInput}
                            keyboardType={'email-address'}
                            autoCapitalize='none'
                            autoCompleteType='email'
                            keyboardAppearance='dark'
                            //onChangeText={(text)=>this.textInputChange(text)}
                            onChangeText={(email) => this.setState({ email })}
                        />
                        {this.state.email != "" ?
                            <Animatable.View
                                animation="bounceIn"
                            >
                                <Feather
                                    name="check-circle"
                                    color="green"
                                    size={20}
                                />
                            </Animatable.View>

                            : null}
                    </View>

                    <Text style={[styles.text_footer, { marginTop: 35 }]}>密碼</Text>
                    <View style={styles.action}>
                        <FontAwesome
                            name="lock"
                            color="#04151f"
                            size={22}
                            style={{ marginLeft: 5 }}
                        />


                        {this.state.secureTextEntry ?
                            <TextInput
                                placeholder="輸入密碼..."
                                secureTextEntry={true}
                                style={styles.textInput}
                                value={this.state.password}
                                autoCapitalize='none'
                                onChangeText={(text) => this.setState({
                                    password: text
                                })}
                            />
                            :
                            <TextInput
                                placeholder="輸入密碼..."
                                style={styles.textInput}
                                autoCapitalize='none'
                                value={this.state.password}
                                onChangeText={(text) => this.setState({
                                    password: text
                                })}
                            />
                        }
                        {<TouchableOpacity
                            onPress={() => this.secureTextEntry()}>
                            {this.state.secureTextEntry ?
                                <Feather
                                    name="eye-off"
                                    color="gray"
                                    size={20}
                                />
                                :
                                <Feather
                                    name="eye"
                                    color="gray"
                                    size={20}
                                />
                            }
                        </TouchableOpacity>}
                    </View>
                    <View style={[styles.textPrivate,{paddingTop:10,}]}>
                        <TouchableOpacity
                            onPress={() => this.setState({modalShow:true})}
                            >
                            <Text style={styles.textPrivate}>
                                忘記密碼？
                            </Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.errormessage}>
                        {this.state.errormessage && <Text style={styles.error}>帳號或密碼錯誤</Text>}
                    </View>
                    <Modal
                        animationType="fade"
                        transparent={true}
                        visible={this.state.modalShow}
                        onRequestClose={
                            () => {this.setState({modalShow:false})}
                        }
                    >
                        <View style={styles.centeredView}>

                            <View style={styles.modalView}>
                                <Text style={{
                                    fontSize: 25,
                                    fontWeight: 'bold',
                                }}>重設密碼</Text>

                                <TextInput
                                    style={{
                                        fontSize: 15,
                                        justifyContent: 'center',
                                        width: '100%',  //輸入匡的寬度
                                        backgroundColor: '#d2d3ce',
                                        marginTop: 10, //輸入框距離標題的高度
                                        borderRadius: 5,
                                        alignItems: 'flex-start',
                                        lineHeight: 25, //輸入框的高度
                                        padding: 10 //很重要！讓文字置中
                                    }}
                                    id="memail"
                                    //secureTextEntry={true}
                                    autoCompleteType="email"
                                    placeholder="請輸入已註冊電子郵件"
                                    onChangeText={(text) => this.setState({ email: text })}
                                />

                                <View style={{ flexDirection: 'row', width: '100%', justifyContent: 'space-around' }}>
                                    <TouchableOpacity
                                        style={{ ...styles.passinsidebtn2 }}
                                        onPress={() => {this.setState({modalShow:false})  }}
                                    >
                                        <Text style={{
                                            color: "#022633",
                                            fontWeight: "bold",
                                            textAlign: "center",
                                            fontSize: 15,
                                            marginTop: 4,

                                        }}>取消</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={{ ...styles.passinsidebtn }}
                                        onPress={() => { this.forgotPassword(this.state.email)}}
                                    >
                                        <Text style={{
                                            color: "white",
                                            fontWeight: "bold",
                                            textAlign: "center",
                                            fontSize: 15,
                                            marginTop: 4,

                                        }}>確認</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>

                        </View>

                    </Modal>

                    <View style={{ alignItems: 'center' }}>

                        <View style={styles.button}>
                            <TouchableOpacity
                                //onPress={() => this.props.navigation.navigate("TabScreen")}
                                onPress={() => this.loginUser(this.state.email, this.state.password)}
                                style={[styles.singIn]}
                            >
                                <LinearGradient
                                    colors={['#192f38', '#04151f']}//深灰色
                                    style={styles.singIn}>
                                    <Text style={[styles.textSign, { color: '#e8e8e8' }, { fontSize: 18 }]}>登入</Text>

                                </LinearGradient>

                            </TouchableOpacity>


                            {/* <TouchableOpacity 
                        onPress={()=>this.props.navigation.navigate("SignUpScreen")}//點擊按鈕切換頁面
                        style={[styles.singIn,
                            {borderColor:'#04151f',
                            borderWidth:1,
                            marginTop:10
                        }]}>
                            <Text style={styles.textSignUP}>註冊</Text>
                        </TouchableOpacity> */}
                            <View style={styles.textPrivate2}>
                                <Text style={[styles.color_textPrivate, { color: '#595959' }]}>
                                    還沒有帳號嗎？
                                </Text>

                                <Text
                                    onPress={() => this.props.navigation.navigate("SignUpScreen")}//點擊按鈕切換頁面
                                    style={[styles.color_textPrivate, { fontWeight: 'bold' }, { color: '#006d75' }]}>
                                    註冊
                                </Text>
                            </View>
                        </View>
                    </View>
                </Animatable.View>
            </View>


        )
    }
}
var styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#04151f',//丈青色
    },
    header: {
        flex: 1,
        justifyContent: 'flex-end',
        paddingHorizontal: 20,
        paddingBottom: 40,
        fontWeight: 'bold',
    },
    footer: {
        flex: 2.5,
        backgroundColor: '#e8e8e8',//象牙白
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        paddingHorizontal: 20,
        paddingVertical: 30,
    },

    text_header: {
        color: '#263238',
        fontWeight: 'bold',
        fontSize: 30,
    },
    text_footer: {
        color: '#263238',
        fontSize: 18,
        fontWeight: 'bold',
    },
    action: { //輸入電子郵件的橫槓
        flexDirection: 'row',
        marginTop: 10,
        borderBottomWidth: 2,
        borderBottomColor: '#bfbfbf',
        paddingBottom: 5,
        alignItems:'center'
    },
    textInput: {
        flex: 1,
        paddingLeft: 10,
        color: '#04151f',
    },
    button: {
        alignItems: "center",
        marginTop: '4%',
        width: '80%',
        justifyContent: 'center',
    },
    errormessage: {
        height: 40,
        alignItems: "center",
        justifyContent: "center",
        marginHorizontal: 30,
    },
    error: {
        color: "#E9446A",
        fontSize: 15,
        fontWeight: "600",
        textAlign: "center"
    },
    singIn: {
        width: '110%',
        height: 55,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,

    },
    textSign: {
        fontSize: 18,
        color: '#04151f',
        fontWeight: 'bold',
    },

    textSignUP: {
        fontSize: 18,
        color: '#263238',
        fontWeight: 'bold',
    },
    logoText: {
        color: '#e8e8e8',
        fontSize: 17,
        textAlign: 'left',
        paddingVertical: 14,
        fontWeight: 'bold',
        letterSpacing: 2
    },
    textPrivate: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        color: 'gray',
        textDecorationLine: 'underline',
        fontSize: 14,
    },
    textPrivate2: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 15,
        color: 'gray',
    },
    color_textPrivate: {
        //flexDirection:'row',
        marginTop: 18,
        flexWrap: 'wrap',
        fontSize: 13,
        fontWeight: 'bold'
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
        //backgroundColor: "yellow",
        borderRadius: 5,
        //paddingTop: 50,//可以用padding控制或直接用長寬控制
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
      passinsidebtn: {//更改密碼裡面按鈕樣式
        backgroundColor: '#022633',
        //borderColor: '#d2d3ce',
        borderRadius: 5,
        padding: 10,
        paddingTop: 10,
        width: '42%',
        height: '60%',
        marginTop: 30,
      },
      passinsidebtn2: {//更改密碼裡面按鈕樣式
        //backgroundColor: '#d2d3ce',
        borderColor: '#d2d3ce',
        borderWidth: 2,
        borderRadius: 5,
        //padding: 10,
        paddingTop: 10,
        width: '42%',
        height: '60%',
        marginTop: 30,
      },
})