import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    SafeAreaView,
    Alert,
    KeyboardAvoidingView,
    Image,
    ImageBackground
} from 'react-native';
import mytoast from './useToast.js';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
export default class HomePage extends React.Component {
    constructor(props){
        super(props);
        this.state={
            commentText:''
        };
    }
    successfulsub =() => {
        if (this.state.commentText == '') {
            Alert.alert(
                "警示",
                "不可送出空白內容！",
                [
                    {
                        text: "確認",
                        onPress: () => mytoast.showToast("取消意見回覆"),
                        style: "cancel"
                    },
                ],
                { cancelable: false }
            );
        }
        else {
            Alert.alert(
                "意見回覆",
                "是否提交意見？",
                [
                    {
                        text: "取消",
                        onPress: () => mytoast.showToast("取消意見回覆"),
                        style: "cancel"
                    },
                    {
                        text: "提交", onPress: () => [mytoast.showToast("感謝您寶貴的意見"),
                            this.refs.textInputRefer.clear()
                            ]
    
                    }
                ],
                { cancelable: false }
            );
        }
    
    }
    render() {
        return (
            <ImageBackground style={styles.container} source={require('./asset//starbackground.png')}>
                <View style={styles.header}>
                    <Image source={require("./asset/spaceman.png")}
                        style={styles.planettotal} />

                    <Text style={styles.Title}>COMMAND...</Text>
                </View>

                <KeyboardAwareScrollView style={{ width: '100%', marginTop: 30 }} >
                    <View style={styles.footer}>
                        <TextInput style={styles.CommandBox}
                            placeholderTextColor='#26313b'
                            textAlignVertical='top'
                            placeholder="請輸入..."
                            onChangeText={(text) => this.setState({commentText:text})}
                            value={this.state.commentText}
                            ref="textInputRefer"
                        >
                        </TextInput>
                        <TouchableOpacity
                            onPress={this.successfulsub}//點擊按鈕切換頁面
                            style={styles.SendoutButton}
                        >
                            <Text style={styles.SendoutButtonText}>提交意見</Text>
                        </TouchableOpacity>
                    </View>
                </KeyboardAwareScrollView>

            </ImageBackground>
        )
    }
}

var styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#04151f',
        height: hp('40%'),
        width: wp('100%'),

    },
    header: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'flex-end',

    },
    Title: {

        color: '#dbdbd9',
        fontWeight: 'bold',
        fontSize: 30,
        letterSpacing: 4,

    },
    footer: {
        alignItems: 'center',
        backgroundColor: '#04151f',

    },
    CommandBox: {
        flex: 0.7,
        width: wp('80%'),
        height: hp('30%'),
        alignItems: "center",
        justifyContent: 'center',
        paddingLeft: 5,
        borderColor: "black",
        borderRadius: 5,
        backgroundColor: '#ded7ca',
    },
    SendoutButton: {
        backgroundColor: '#022633',
        borderRadius: 10,
        width: wp('30%'),
        height: hp('7%'),
        marginTop: 30,
        alignItems: 'center',
        justifyContent: 'center'
    },
    SendoutButtonText: {
        color: '#e8e8e8',
        fontWeight: 'bold',
        fontSize: 17
    },
    planettotal: { //太空人
        marginLeft: '50%',
        height: 55,
        width: wp('8%'),
        resizeMode: 'contain',
        position: 'absolute',
        top: Platform.OS === 'ios' ? hp('5.5%') : hp('1%'),
        right: Platform.OS === 'ios' ? hp('-7%') : hp('-9.5%'),
        //backgroundColor:'green'
    },

})