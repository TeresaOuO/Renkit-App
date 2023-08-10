import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    SafeAreaView,
    Image, Platform
} from 'react-native';
import { Picker } from '@react-native-community/picker';
import {
    Avatar,
    Header
} from 'react-native-elements';
import ReactNativePickerModule from 'react-native-picker-module'
import * as Animatable from 'react-native-animatable';
import AntDesign from "react-native-vector-icons/AntDesign";
import LinearGradient from 'react-native-linear-gradient';
import * as firebase from 'firebase';
import mytoast from './useToast.js';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

//import RNPickerSelect from 'react-native-picker-select';
//import { useGestureHandlerRef } from 'react-navigation-stack';
const imageurl = require('../Images/woman1.jpg');//測試用照片位址
//姓名、性別(下拉)、密碼(***)、電話、信箱（唯獨）
const dataset = [
    {
        value: "男",
        label: "男性",
    },
    {
        value: "女",
        label: "女性",
    },
    {
        value: "其他",
        label: "其他",
    }
]
export default class editprofile extends React.Component {
    constructor(props) {
        super(props);//呼叫對應的父類別建構元,props
        var RegisterUser = firebase.auth().currentUser;
        this.pickerRef = React.createRef()
        this.state = {//狀態初始化
            //selectgender:undefined,
            //uri:'',

            iosselectedValue: null,
            data: [
                "Javascript",
                "Go",
                "Java",
                "Kotlin",
                "C++",
                "C#",
                "PHP"
            ],
            dropdown: '',
            email: RegisterUser.email,
            check_textInputChange: false,
            password: '',
            errormessage: null,
            secureTextEntry: true
        };
        //this.inputRefs={};
        (userdata = () => {
            var RegisterUser = firebase.auth().currentUser;
            //var RegisterUser = firebase.auth().currentUser;
            firebase.database().ref('users/' + RegisterUser.uid).once('value', snapshot => {
                this.setState({
                    name: snapshot.val().name,
                    phone: snapshot.val().phone,
                    //uri: snapshot.val().uri,
                    dropdown: snapshot.val().gender
                });
            });
        })();
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
    writeuserdata = (name, phone, dropdown) => {
        var RegisterUser = firebase.auth().currentUser;
        firebase.database().ref('users/' + RegisterUser.uid).once('value', snapshot => {
            if (snapshot.val().gender == "") {
                firebase.database().ref('users/' + RegisterUser.uid).update({
                    name: name,
                    phone: phone,
                    gender: '男'
                }).then(() => {
                    this.props.navigation.navigate("ProfileScreen");
                })
                    .catch((error) => {
                        console.log(error);
                    });
            }
            else {
                firebase.database().ref('users/' + RegisterUser.uid).update({
                    name: name,
                    phone: phone,
                    gender: this.state.dropdown,
                    //uri:this.state.uri
                }).then(() => {
                    this.props.navigation.navigate("ProfileScreen");
                })
                    .catch((error) => {
                        console.log(error);
                    });
            }
        });
        mytoast.showToast("儲存成功")
    }

    onValueChange = (flag, value) => {
        if (flag == 1) {
            //this.setState({ selected: value });
            this.setState({ dropdown: value });

        } else {
            this.setState({ dropdown: value });

        }
        //this.setState({ dropdown: value });
    };
    //gender=[selectedValue, setSelectedValue] = useState("java"); 
    render() {

        return (

            <View style={styles.container}>

                <View style={styles.header}>

                    <Avatar rounded source={imageurl} size={hp('20%')} />
                </View>
                <KeyboardAwareScrollView style={{ flex: 0.5 }}>
                    <Animatable.View
                        animation="fadeInUpBig"
                        duration={800}
                        style={styles.footer}>
                        {/* <Text style={styles.text_footer}>姓名</Text>  */}
                        <View style={styles.action}>
                            <AntDesign
                                name="user"
                                theme="Filled"
                                color="#453d34"
                                size={27}
                                style={{ marginTop: '1.5%', paddingLeft: '2%' }}
                            />
                            <TextInput
                                allowFontScaling={false}
                                id="name"
                                placeholder="輸入更改後的姓名..."
                                placeholderTextColor='#26313b'
                                style={styles.textInput}
                                defaultValue={this.state.name}
                                onChangeText={(name) => this.setState({ name })}
                            //onChangeText={(text)=>this.textInputChange(text)}
                            />
                        </View>
                        <View style={styles.action}>
                            <AntDesign
                                name="man"
                                theme="Filled"
                                color="#453d34"
                                size={24}
                                style={
                                    Platform.OS === 'ios' ? { marginLeft: '2%', marginTop: '2%' } : { paddingLeft: '2%' }}
                            />
                            {Platform.OS === 'ios' ?
                                <TouchableOpacity style={styles.textShow3} onPress={() => this.pickerRef.current.show()}>
                                    <Text style={{ fontSize: 20, color: '#ded7ca', marginLeft: '2%', marginTop: '10%' }}>{this.state.dropdown}</Text>
                                </TouchableOpacity>
                                :
                                <Picker
                                    mode={'dropdown'}
                                    style={styles.textShow2}
                                    selectedValue={this.state.dropdown}
                                    onValueChange={(value) => this.onValueChange(0, value)}>
                                    <Picker.Item label="男" value="男" />
                                    <Picker.Item label="女" value="女" />
                                </Picker>
                            }
                            <ReactNativePickerModule
                                value={this.state.dropdown}
                                pickerRef={this.pickerRef}
                                confirmButton={"確定"}
                                cancelButton={"取消"}
                                // value={this.state.value}
                                title={"選擇性別"}
                                items={dataset}
                                selectedColor="#FC0"
                                onCancel={() => {
                                }}
                                onValueChange={(value) => this.onValueChange(0, value)}
                            />
                            {/* <Text style={[styles.text_footer]}>性別</Text> */}

                            {/**/}

                        </View>
                        <View style={styles.action}>

                            {/* <Text style={[styles.text_footer]}>電話</Text> */}

                            <AntDesign
                                name="phone"
                                theme="Filled"
                                color="#453d34"
                                size={24}
                                style={{ marginTop: '1%', paddingLeft: '2%', paddingRight: '2%' }}
                            />

                            <TextInput
                                allowFontScaling={false}
                                placeholder="輸入電話號碼..."
                                placeholderTextColor='#26313b'
                                style={styles.textInput}
                                //onChangeText={(text)=>this.textInputChange(text)}
                                defaultValue={this.state.phone}
                                onChangeText={(phone) => this.setState({ phone })}
                            />
                        </View>
                        <View style={{ alignItems: 'center' }}>
                            <View style={styles.button}>
                                <TouchableOpacity
                                    onPress={() => this.writeuserdata(this.state.name, this.state.phone)}
                                    //onPress={() => this.loginUser(this.state.email,this.state.password)}
                                    style={[styles.singIn]}
                                >

                                    <LinearGradient
                                        colors={['#022633', '#022633']}
                                        style={styles.singIn}>
                                        <Text style={[styles.textSign, { color: '#ded7ca' }, { fontSize: 18, fontWeight: 'bold', letterSpacing: 2 }]} allowFontScaling={false}>儲存</Text>

                                    </LinearGradient>
                                </TouchableOpacity>

                            </View>


                            {/* <View style={styles.container2}>
                    <Text style={styles.textsize}>姓名</Text>
                    <TextInput
                        style={styles.textShow}
                        id="memail"
                        placeholder="請輸入姓名"
                        onChangeText={text => setdata(text)}
                    />
                </View>
                <View style={styles.container2}>
                    <Text style={styles.textsize}>性別</Text>
                    <Text style={{ color: '#a8392a', textAlign: 'center', width: '57%', fontSize: 16,fontWeight:'bold' }}>維修中</Text>
                </View>

                <View style={styles.container2}>
                    <Text style={styles.textsize}>電話</Text>
                    <TextInput
                        style={styles.textShow}
                        id="memail"
                        placeholder="請輸入電話號碼"
                        onChangeText={(text) => this.setState({ text })}
                    />
                </View>
                <View style={styles.container2}>
                    <Text style={styles.textsize}>信箱</Text>
                    <Text style={styles.textShow}>hello333@gmail.com</Text>
                </View> */}


                            {/*<RNPickerSelect
                    placeholder={{
                        label: 'Select gender...',
                        value: null,
                    }}
                    items={genderItem}
                    onValueChange={(value) => {
                        this.setState({
                            selectgender: value,
                        });
                    }}
                    onUpArrow={() => {
                        this.inputRefs.picker.togglePicker();
                    }}
                    onDownArrow={() => {
                        this.inputRefs.company.focus();
                    }}
                    style={{}}
                    value={this.state.selectgender}
                    ref={(el) => {
                        this.inputRefs.picker2 = el;
                    }}
                    useNativeAndroidPickerStyle={true} //android only
                />*/}
                        </View>
                    </Animatable.View>
                </KeyboardAwareScrollView>
            </View>
            //      <SafeAreaView style={styles.container}>
            //    </SafeAreaView>

        )
    }
}

const styles = StyleSheet.create({
    container: {//控制整個版面
        flex: 1,
        //marginTop: 20,
        justifyContent: 'center',
        backgroundColor: '#04151f',
    },
    header: {
        marginTop: hp('5%'),
        flexDirection: 'row',
        justifyContent: 'space-around',
        //backgroundColor: 'red'
    },
    footer: {
        flex: 1,
        paddingHorizontal: 20,
        paddingVertical: 30,
        width: '100%',
        //backgroundColor: 'green'
    },
    action: { //輸入電子郵件的橫槓
        flexDirection: 'row',
        marginTop: '2%',
        paddingBottom: '1%',
        borderRadius: 40,//输入框边界圆角度数
        borderColor: '#453d34',//输入框边界颜色
        marginBottom: '4%',
        borderWidth: 2,
        height: 55,
        width: '90%',
        //justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 15,
        paddingLeft: 15,

    },
    textInput: {
        flex: 1,
        alignItems: "center",
        justifyContent: 'center',
        paddingLeft: 5,
        color: '#ded7ca',
        fontSize: 17,
        marginTop: 4

    },
    button: {
        alignItems: "center",
        marginTop: '8%',
        //marginLeft:'5%',
        width: '45%',
        justifyContent: 'center',
    },
    singIn: {
        width: '110%',
        height: 55,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 40,

    },
    text_footer: {
        color: 'gray',
        fontSize: 13,
        fontWeight: 'bold',
        paddingLeft: '4%',
        paddingRight: '4%',
        paddingBottom: '-50%',
        padding: '1.5%',
        justifyContent: 'flex-start',
        alignSelf: 'flex-start',

    },
    textShow3: {//男女ios
        marginLeft: 12,
        alignSelf: 'center',
        fontWeight: 'bold',
        textAlign: 'center',
        //backgroundColor:'red'


    },
    textShow2: {//男女android
        //height:'20%',
        //backgroundColor:'lightyellow',
        fontSize: 18,
        borderLeftColor: '#04151f',
        borderLeftWidth: 55,
        height: '90%',
        width: '90%',
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#ded7ca',
        textAlignVertical: 'center',
    },

})