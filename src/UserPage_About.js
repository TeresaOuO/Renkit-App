import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    ScrollView,
    ImageBackground
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import AntDesign from "react-native-vector-icons/AntDesign";

export default class HomePage extends React.Component {
    render() {
        return (
            <ImageBackground style={styles.container} source={require('./asset//starbackground.png')}>

                <ScrollView
                    snapToInterval={hp('90%')}
                    snapToAlignment='center'
                    disableScrollViewPanResponder={true}
                    followsUserLocation={true}
                    showsVerticalScrollIndicator={false}
                >
                    <View style={styles.viewComponent}>


                        <Image
                            source={require('./asset/backimageplanet.png')}
                            style={styles.logo}
                            resizeMode={"contain"}

                        />
                        <Text style={[styles.text]}>
                            RENKiT • We Share
                        </Text>

                        <Text style={[styles.component_text]}>
                            {"\n"}
                            Renkit是由兩個字組合而成的，{"\n"}
                            Rent＆Cup，{"\n"}
                            我們希望可以以共享杯代替一次性飲料杯，{"\n"}
                            減少塑膠帶來的垃圾量。{"\n"}
                        </Text>

                    </View>

                    <View style={[styles.viewComponent,]}>
                        <Image
                            source={require('./asset/backicon.png')}
                            style={styles.logo1}
                            resizeMode={"contain"}

                        />
                        <Text style={[styles.component_text1]}>
                            " Most plastics can be recycled, {"\n"}
                            but they need to be classified according to their different polymer types.
                            Because of the high cost of mixing,
                            if it is not a single type of plastic, {"\n"}
                            the recycling industry will refuse... "{"\n"}
                            {"\n"}
                            你知道 {"\n"}
                            其實我們日常做的塑膠回收分類， {"\n"}
                            最終還是跟一般垃圾一起落到焚化爐中嗎 {"\n"}
                            {"\n"}
                            本團隊希望可以配合政府政策， {"\n"}
                            開發一款接近使用者意願的環保App {"\n"}
                            透過與台灣地區的飲料店合作， {"\n"}
                            發展一套甲店租乙店還的共享杯服務 {"\n"}
                            讓您不用再隨身攜帶環保杯， {"\n"}
                            就能用環保的方式喝一杯！ {"\n"}
                        </Text>
                    </View>
                    <View style={[styles.viewComponent,]}>
                        <Image
                            style={{ height: hp('25%'), width: wp('25%') }}
                            source={require('./asset/logo.png')}
                            resizeMode='contain'
                        />
                        <View style={{ width: wp('25%'), flexDirection: 'row', paddingTop: Platform.OS === 'ios' ? '1.5%' : '3.5%', justifyContent: 'space-between' }}>
                            <MaterialCommunityIcons
                                name="facebook"
                                theme="filled"
                                color="gray"
                                size={20}
                            />
                            <AntDesign
                                name="instagram"
                                theme="Filled"
                                color="gray"
                                size={20}
                            />
                            <AntDesign
                                name="google"
                                theme="Filled"
                                color="gray"
                                size={20}
                            />
                            <AntDesign
                                name="youtube"
                                theme="Filled"
                                color="gray"
                                size={20}
                            />
                        </View>
                        <Text style={{
                            fontStyle: 'italic',
                            fontSize: 13,
                            color: 'gray',
                            textAlign: 'center',
                            lineHeight: 30
                        }}>
                            @共享杯計畫{"\n"}
                        </Text>
                    </View>
                </ScrollView>
            </ImageBackground>

        )
    }
}

var styles = StyleSheet.create({

    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        //height: hp('50%'),
        // width: wp('100%'),

    },
    logo: {     //星球圖
        width: Platform.OS === 'ios' ? wp('50%') : wp('40%'),
        height: Platform.OS === 'ios' ? hp('25%') : hp('25%')

    },
    logo1: {//太空人
        width: wp('30%'),
        height: Platform.OS === 'ios' ? hp('25%') : hp('18%'),
        //marginTop: Platform.OS === 'ios' ? '-40%' : '-10%',
        //marginBottom: Platform.OS === 'ios' ? '-10%' : '-5%',
    },
    viewComponent: {
        height: hp('90%'),
        width: wp('100%'),
        alignItems: 'center',
        justifyContent: 'center',
    },
    text: {
        letterSpacing: 2,
        fontSize: 30,
        color: '#ded7ca',
        textAlign: 'center',
        fontWeight: 'bold'
    },
    component_text: {
        fontStyle: 'italic',
        fontSize: 13,
        color: 'gray',
        textAlign: 'center',
        lineHeight: 20
    },
    component_text1: {
        fontSize: 14,
        color: '#ded7ca',
        textAlign: 'center',
        margin: hp('3%'),
        lineHeight: 25
    },
})
