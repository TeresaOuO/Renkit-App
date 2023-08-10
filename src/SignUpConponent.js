import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity
} from 'react-native';
import FontAwesome from "react-native-vector-icons/FontAwesome"
import Feather from "react-native-vector-icons/Feather"
import LinearGradient from 'react-native-linear-gradient';
import * as Animatable from 'react-native-animatable';

//import { YellowBox } from 'react-native';
//YellowBox.ignoreWarnings(['Setting a timer']);

import * as firebase from 'firebase'


export default class SingUpComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            check_textInputChange: false,
            name: '',
            phone: '',
            email: '',
            password: '',
            errormessage: null,
            //password_confirm:'',
            secureTextEntry: true,
            secureTextEntry_confirm: true

        }
    }
    signUpUser = (email, password) => {

        firebase
            .auth()
            .createUserWithEmailAndPassword(email, password)
            .then(() => {
                if (this.state.password.length < 6) {
                    error => this.setState({ errormessage: "" });
                }
                else {
                    var RegisterUser = firebase.auth().currentUser;
                    firebase.database().ref('users/' + RegisterUser.uid).set({
                        email: RegisterUser.email,
                        name: 'User',
                        phone: '',
                        point: 0,
                        planet: 0,
                        gender: '其他',
                        usetimes: 0,
                    }).then(() => {
                        this.props.navigation.navigate("SignInScreen");
                    })
                        .catch((error) => {
                            console.log(error);
                        });
                    firebase.database().ref('users/' + RegisterUser.uid + '/otherdata/').set({
                        missionLevel:1,
                        mission: '0,0,0,0,0',
                        planet: '5,5,5,5,5',
                        playgame: false,
                    })
                }
            })
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

    secureTextEntry_confirm() {
        this.setState({
            secureTextEntry_confirm: !this.state.secureTextEntry_confirm
        })
    }
    emailVerification = (email) => {
        firebase.auth().currentUser.sendEmailVerification(email)
            .then(function () {

            }).catch(function (e) {
                console.log(e)
            });
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={[styles.text_header, { color: '#e8e8e8' }, { fontSize: 40 }]}>RENKit</Text>
                    <Text style={[styles.logoText]}>註冊新會員</Text>
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
                            autoCapitalize='none'
                            keyboardType={'email-address'}
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
                                autoCapitalize='none'
                                value={this.state.password}
                                onChangeText={(text) => this.setState({
                                    password: text
                                })}
                            />
                            :
                            <TextInput
                                placeholder="輸入密碼..."
                                style={styles.textInput}
                                value={this.state.password}
                                onChangeText={(text) => this.setState({
                                    password: text
                                })}
                            />
                        }

                        <TouchableOpacity
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
                        </TouchableOpacity>
                    </View>
                    <View style={styles.textPrivate}>
                        <Text style={styles.color_textPrivate}>
                            註冊表示同意及觀看過
                             </Text>
                        <Text style={[styles.color_textPrivate, { fontWeight: 'bold' }]}>
                            {" "}
                                 隱私權
                             </Text>
                        <Text style={styles.color_textPrivate}>
                            {" "}
                                 和
                             </Text>
                        <Text style={[styles.color_textPrivate, { fontWeight: 'bold' }]}>
                            {" "}
                                同意書
                             </Text>
                    </View>
                    <View style={styles.errormessage}>
                        {this.state.errormessage && <Text style={styles.error}>{this.state.errormessage}</Text>}
                    </View>
                    <View style={{ alignItems: 'center' }}>
                        <View style={styles.button}>
                            <TouchableOpacity
                                style={[styles.singIn]}
                                onPress={() => this.signUpUser(this.state.email, this.state.password)}>
                                <LinearGradient
                                    colors={['#192f38', '#04151f']}//深灰色
                                    style={styles.singIn}>
                                    <Text style={[styles.textSign, { color: '#e8e8e8' }, { fontSize: 18 }]}>註冊</Text>
                                </LinearGradient>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.textPrivate2}>

                            <Text
                                onPress={() => this.props.navigation.navigate("SignInScreen")}//點擊按鈕切換頁面
                                style={[styles.color_textPrivate2, { fontWeight: 'bold' }, { color: '#006d75' }]}>
                                登入已有帳號
                        </Text>
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
        backgroundColor: '#04151f',

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
        backgroundColor: '#e8e8e8',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        paddingHorizontal: 20,
        paddingVertical: 30,

    },
    text_header: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 30,

    },
    text_footer: {
        color: '#04151f',
        fontSize: 18,
        fontWeight: 'bold',

    },
    action: {
        flexDirection: 'row',
        marginTop: 10,
        borderBottomWidth: 2,
        borderBottomColor: '#bfbfbf',
        paddingBottom: 5,
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
        height: 45,
        alignItems: "center",
        justifyContent: "center",
        marginHorizontal: 30
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
    textPrivate: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 13
    },
    textPrivate2: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 20,
        color: 'gray',
        //marginLeft:130
    },
    color_textPrivate: {
        color: 'gray'
    },
    color_textPrivate2: {
        //flexDirection:'row',
        marginTop: 5,
        fontSize: 13,
        fontWeight: 'bold',
        justifyContent: 'center',
        alignItems: 'center',
        //marginLeft:146

    }, logoText: {
        color: '#e8e8e8',
        fontSize: 18,
        textAlign: 'left',
        paddingVertical: 14,
        fontWeight: 'bold',
        letterSpacing: 2
    },

})