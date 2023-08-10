import React, { Component } from 'react';
import {
    SafeAreaView,
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    Animated,
    DeviceEventEmitter,
    Modal,
} from 'react-native';
import { CountdownCircleTimer } from 'react-native-countdown-circle-timer'
import Card from "./GameCard"
import * as firebase from 'firebase'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const re1 = require('./asset/recyclelogo1.png');
const re2 = require('./asset/recyclelogo2.png');
const re3 = require('./asset/recyclelogo3.png');
const re4 = require('./asset/recyclelogo4.png');
const re5 = require('./asset/recyclelogo5.png');
const re6 = require('./asset/recyclelogo6.png');
const re7 = require('./asset/recyclelogo7.png');
const re8 = require('./asset/false.png');

const t1 = require('./asset/ts1.png');
const t2 = require('./asset/ts2.png');
const t3 = require('./asset/ts3.png');
const t4 = require('./asset/ts4.png');
const t5 = require('./asset/ts5.png');
const t6 = require('./asset/ts6.png');
const t7 = require('./asset/ts7.png');
const t8 = require('./asset/ts8.png');
const imgq = require('./asset/cards.png');
var myvar;
class test extends Component {
    state = {
        cardSymbols: [
            re1, re2, re3, re4, re5, re6, re7, re8
        ],
        cardSymbols2: [
            t1, t2, t3, t4, t5, t6, t7, t8
        ],
        knowledge: [
            "分類一：♳PET/PETE \n常用於：寶特瓶、膠帶、食用油瓶等塑膠瓶",
            "分類二：♴HDPE/PEHD \n常用於：購物袋、回收桶、農業用管、杯座、鮮奶瓶、酒精瓶", //待確認
            "分類三：♵PVC \n常用於：管子、圍牆與非食物用瓶、保鮮膜、雞蛋盒、調味罐等",
            "分類四：♶LDPE/PELD \n常用於：塑膠袋、各種的容器、配管與各種模塑的實驗室設備",
            "分類五：♷PP \n常用於：食品餐器具、汽車零件、水杯、布丁盒、生理食鹽液瓶等",
            "分類六：♷PS \n常用於：養樂多瓶、自助式托盤、玩具、泡麵碗、保麗龍",
            "分類七：♹Other\n其他塑膠，包括美耐皿、PMMA壓克力、PC、聚乳酸PLA、尼龍與玻璃纖維強化塑膠",
            "陷阱題，這不是塑膠"
        ],
        cardSymbolsInRand: [],
        cardSymbolsInRand2: [],
        isOpen: [],
        secondPickedIndex: null,
        steps: 0,
        topcard: false,
        isEnded: false,
        level: 0,
        correct: 0,
        mvisible: true,
        playing: false,
        title: '遊戲說明',
        comment: '',
        btn: '',
        point: 0,
    }
    initGame = () => {//重置開始遊戲
        this.state.level++
        if (this.state.level > 3) {
            this.setState({
                isEnded: true,
            })
            clearTimeout(timeoutID);
            this.clearmyvar();
            return
        }
        let newCardSymbols = [...this.state.cardSymbols];
        let newCardSymbols2 = [...this.state.cardSymbols2];
        let cardSymbolsInRand = this.shuffleArray(newCardSymbols);
        let cardSymbolsInRand2 = this.shuffleArray2(newCardSymbols2);

        let isOpen = []
        for (let i = 0; i < newCardSymbols.length; i++) {
            isOpen.push(true)
        }
        this.setState({
            cardSymbolsInRand,
            cardSymbolsInRand2,
            isOpen,
            topcard: false,
            playing: true,
        })
        clearTimeout(timeoutID);
        this.clearmyvar();
        //clearTimeout(this.timeoutnext);

        const timeoutID = setTimeout(() => {//初始翻牌三秒
            for (let i = 0; i < newCardSymbols.length; i++) {
                isOpen.splice(false)
            }
            this.setState({
                isOpen,
                second: 5,
                topcard: true,
            })
            clearTimeout(timeoutID);
            this.testmyvar();
        }, 3000)
    }
    testmyvar() {
        myvar = setTimeout(() => {
            this.showscore(false);
            clearTimeout(myvar);
        }, 5000);
    }
    clearmyvar() {
        clearTimeout(myvar);
    }
    componentDidMount() {
        //this.initGame()
        this.endgame();
    }
    showscore(judge) {
        var trash = this.state.cardSymbolsInRand[0]
        if (judge) {
            var p = this.state.point;
            p += 2;
            this.state.point = p;
            tit = "回收成功";
        } else {
            tit = "回收失敗";
        }
        var yourlevel = this.state.level, tit, com, btnn;
        switch (yourlevel) {
            case 1:
                for (i = 0; i < this.state.cardSymbols2.length; i++) {
                    if (trash == this.state.cardSymbols[i]) {
                        com = this.state.knowledge[i];
                    }
                }
                btnn = "下一題"; break;
            case 2:
                for (i = 0; i < this.state.cardSymbols2.length; i++) {
                    if (trash == this.state.cardSymbols[i]) {
                        com = this.state.knowledge[i];
                    }
                }
                btnn = "下一題"; break;
            case 3:
                for (i = 0; i < this.state.cardSymbols2.length; i++) {
                    if (trash == this.state.cardSymbols[i]) {
                        com = this.state.knowledge[i];
                    }
                } btnn = "看回收結果";
                var rp = this.state.point;
                if (rp == 6) {
                    
                    var allmission;
                    var RegisterUser = firebase.auth().currentUser;
                    firebase.database().ref('users/' + RegisterUser.uid + '/otherdata/').once('value', snapshot => {
                        allmission = snapshot.val().mission
                        var mmission = allmission.split(",");
                        if (mmission[0] == "0") {
                            mmission[0] = "1";
                            var newmission = mmission.toString();
                            var RegisterUser = firebase.auth().currentUser;
                            firebase.database().ref('users/' + RegisterUser.uid + '/otherdata/').update({
                                mission: newmission,
                            })
                            alert("三題皆答對！\n可以解鎖任務了！"+mmission);
                            DeviceEventEmitter.emit('OpenMissionGame', { text:'gameok' });
                        }
                    })
                }
                var RegisterUser = firebase.auth().currentUser;
                firebase.database().ref('users/' + RegisterUser.uid ).once('value', snapshot => {
                    var rpoint=snapshot.val().point;
                    rpoint+=rp;
                    firebase.database().ref('users/' + RegisterUser.uid).update({
                        point:rpoint
                    })
                    DeviceEventEmitter.emit('GamePoint', { r_point: rpoint });
                })
                
                break;
            default: break;
        }
        this.setState({
            playing: false,
            title: tit,
            comment: com,
            btn: btnn
        })
        //switch case homework!!
    }
    shuffleArray = (arr) => {//隨機重組(回收)
        const newArr = arr.slice();
        for (let i = newArr.length - 1; i > 0; i--) {
            const rand = Math.floor(Math.random() * (i + 1));
            [newArr[i], newArr[rand]] = [newArr[rand], newArr[i]];
        }
        return newArr
    }
    shuffleArray2 = (arr2) => {//隨機重組(垃圾)
        const newArr2 = arr2.slice();
        for (let i = newArr2.length - 1; i > 0; i--) {
            const rand2 = Math.floor(Math.random() * (i + 1));
            [newArr2[i], newArr2[rand2]] = [newArr2[rand2], newArr2[i]];
        }
        return newArr2
    }
    cardPressHandler = (index) => {//翻牌
        let isOpen = [...this.state.isOpen]
        if (isOpen[index]) {
            return;
        }
        isOpen[index] = true
        if (this.state.secondPickedIndex == null) {
            this.setState({
                isOpen,
                secondPickedIndex: index
            })
        }
        this.setState({
            steps: this.state.steps + 1,
        })
    }
    calculateGameResult = () => {//遊戲判斷

        if (this.state.secondPickedIndex != null) {
            let firstSymbol = this.state.cardSymbolsInRand[0]
            let secondSymbol = this.state.cardSymbolsInRand2[this.state.secondPickedIndex]
            for (let i = 0; i < this.state.cardSymbols2.length; i++) {
                if (secondSymbol == this.state.cardSymbols2[i] && firstSymbol == this.state.cardSymbols[i]) {//判斷是否符合配對
                    this.setState({
                        secondPickedIndex: null,
                        correct: this.state.correct + 1,
                        playing: false,
                    })
                    this.clearmyvar();
                    this.showscore(true);
                    //this.initGame()
                } else {
                    setTimeout(() => {
                        let isOpen = [...this.state.isOpen]
                        isOpen[this.state.secondPickedIndex] = false
                        this.setState({
                            secondPickedIndex: null,
                            isOpen,
                        })
                    }, 500)
                }
            }

        }
    }
    componentDidUpdate(prevProps, prevState) {
        if (prevState.secondPickedIndex != this.state.secondPickedIndex) {
            this.calculateGameResult()
        }
    }
    endgame() {
        var gameclose = false;
        var RegisterUser = firebase.auth().currentUser;
        firebase.database().ref('users/' + RegisterUser.uid + '/otherdata').update({
            playgame: gameclose
        });
        DeviceEventEmitter.emit('gameOC', { text: gameclose });
    }
    render() {
        return (
            <SafeAreaView style={styles.container}>
                <Modal                     //__________________Modal更改處開始
                    animationType="fade"
                    transparent={true}
                    visible={this.state.mvisible}
                //onRequestClose={() => {
                //    Alert.alert("Modal has been closed.");
                //}}
                >
                    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                        <View style={{ //遊戲操作說明modual
                            width: '80%',
                            backgroundColor: '#FAECE0',
                            justifyContent: 'center',
                            alignItems: 'center',
                            borderRadius: 30
                        }}>
                            <Text style={styles.modalgameteachText} allowFontScaling={false}>遊戲說明</Text>
                            <Text style={styles.modalgameteachText1} allowFontScaling={false}>
                                30秒內丟對3個垃圾就完成任務囉！{"\n"}{"\n"}
                                記住8張垃圾卡牌的位置，{"\n"}
                                5秒後系統將會把8張卡牌蓋起來，{"\n"}
                                題目卡將會翻開垃圾分類編號，{"\n"}
                                在5秒內翻出對應的垃圾卡牌，{"\n"}
                                就可以獲得1分囉！{"\n"}
                            </Text>
                            <TouchableOpacity
                                style={{ ...styles.openButton, backgroundColor: '#022633', width: '50%', alignItems: 'center', margin: 30, borderRadius: 5 }}
                                onPress={() => {
                                    this.state.mvisible = false;
                                    this.initGame();
                                    //this.setModalVisible(!modalVisible);
                                }}
                            >
                                <Text style={styles.CloseText} allowFontScaling={false}>開始遊戲</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
                {!this.state.isEnded ?
                    <View style={{ flex: 1 }}>
                        <View style={styles.header}>
                            <View style={{ width: '80%', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', paddingLeft: wp('5%') }}>
                                <Image
                                    source={require('./asset/garbage.png')}
                                    style={{
                                        width: '20%',
                                        height: '80%',
                                        resizeMode: 'contain',

                                    }}
                                />
                                <Text style={styles.heading_score} allowFontScaling={false}>{this.state.correct}</Text>
                            </View>
                            {this.state.playing ?
                                <View style={styles.timerposition}>
                                    <CountdownCircleTimer
                                        isPlaying
                                        style={styles.timerpositio}
                                        size={hp('10%')}
                                        initialRemainingTime={3}
                                        duration={5}
                                        colors={[//__________________時間動態顏色可更改
                                            ['#2894FF', 0.4],
                                            ['#AAAAFF', 0.4],
                                            ['#FFBB77', 0.2],
                                        ]}
                                        onComplete={() => {
                                            return [true, 0] // repeat animation in 1.5 seconds
                                        }}
                                    >
                                        {({ remainingTime, animatedColor }) => (
                                            <Animated.Text style={{ color: animatedColor, fontSize: 30 }} allowFontScaling={false}>
                                                {remainingTime}
                                            </Animated.Text>
                                        )}
                                    </CountdownCircleTimer>
                                </View>
                                :
                                null
                            }
                        </View>
                        <View style={styles.main}>
                            {this.state.playing ?
                                null
                                :
                                <Modal                     //__________________Modal更改處開始
                                    animationType="fade"
                                    transparent={true}
                                    visible={!this.state.mvisible}
                                >
                                    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                                        <View style={{
                                            width: '80%', //回收成功或失敗module
                                            backgroundColor: '#FDF4EC',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            borderRadius: 20
                                        }}>

                                            <Text style={styles.modalText} allowFontScaling={false}>{this.state.title}</Text>
                                            <Text style={styles.modalText2} allowFontScaling={false}>{this.state.comment}</Text>
                                            <TouchableOpacity //下一題、看回收結果的btn
                                                style={{
                                                    ...styles.openButton,
                                                    backgroundColor: '#022633',
                                                    width: '50%',
                                                    alignItems: 'center',
                                                    margin: 27,
                                                    padding: 4,
                                                    borderRadius: 5
                                                }}
                                                onPress={() => {
                                                    this.initGame();
                                                    //this.setModalVisible(!modalVisible);
                                                }}
                                            >
                                                <Text style={styles.CloseText} allowFontScaling={false}>{this.state.btn}</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </Modal>   //__________________Modal更改處結束
                            }
                            <View style={[styles.mainBoard]}>
                                {this.state.topcard ?
                                    <Image
                                        source={this.state.cardSymbolsInRand[0]}
                                        style={{ width: 200, height: 200, backgroundColor: 'white', borderRadius: 9 }}
                                    />
                                    :
                                    <Image
                                        source={require('./asset/card.png')}
                                        style={{ width: 200, height: 200, backgroundColor: 'white', borderRadius: 9, }}
                                    />
                                }

                            </View>
                            <View style={styles.mainBoard}>
                                {this.state.cardSymbolsInRand2.map((symbol, index) =>
                                    <Card key={index}
                                        onPress={() => this.cardPressHandler(index)}
                                        style={styles.button} width={30} height={30} title={symbol} cover={imgq} isShow={this.state.isOpen[index]} />
                                )}
                            </View>
                        </View>
                    </View>
                    :
                    <View style={styles.header1}>
                        <Image
                            source={require('./asset/scoreimage.png')}
                            style={{
                                resizeMode: 'contain',
                                width: 339.15,
                                height: 349.65,

                            }}
                        />
                        <Text style={styles.headingtitle} allowFontScaling={false}>總分：{this.state.correct}{"\n"}可獲得：{this.state.point}point</Text>
                        <TouchableOpacity
                            onPress={() => this.props.navigation.goBack()}
                        >
                            <View style={{
                                backgroundColor: 'white',
                                width: '80%',
                                alignItems: 'center',
                                margin: 40,
                                padding: 6,
                                borderRadius: 5,
                            }}>
                                <Text style={{ fontSize: 18 }} allowFontScaling={false}>　　返回星球　　</Text>
                            </View>

                        </TouchableOpacity>
                    </View>
                }

                {/* {this.state.isEnded ?
                    null
                    :
                    
                } */}
            </SafeAreaView>
        )
    }
}


export default test

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#04151f',
    },
    header: {
        width: wp('100%'),
        height: hp('10%'),
        justifyContent: 'flex-start',
        flexDirection: 'row',
        marginTop: hp('2%'),

    },
    heading_score: {
        fontSize: 35,
        fontWeight: "bold",
        height: '100%',
        color: 'lightgray',
        lineHeight: hp('10%'),
        textAlign: 'center',
        justifyContent: 'center',
        alignItems: 'center',
    },
    header1: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    heading: {//遊戲結果內容
        fontSize: 15,
        //fontWeight: "bold",
        textAlign: 'center',
        color: 'white',
        marginTop: 10
    },
    headingtitle: { //遊戲結果總分
        fontSize: 25,
        fontWeight: "bold",
        textAlign: 'center',
        color: 'white',
        //marginTop: 30
    },
    main: {
        flex: 3,
        //backgroundColor: '#453d34',
    },
    mainBoard: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignItems: 'center',
        alignContent: 'center',
        borderRadius: 8
    },
    timerposition: {
        flexDirection: 'row',
        justifyContent: 'center',
        flex: 1,
        height: '100%',
        resizeMode: 'contain',
        paddingRight: wp('5%')
    },
    button: {
        backgroundColor: 'white',
        borderRadius: 13,
        width: 75,
        height: 75,
        justifyContent: 'center',
        alignItems: 'center',
        margin: wp('2%')
    },
    buttonText: {
        fontSize: 18,//下一題
    },
    CloseText: { //開始遊戲
        fontSize: 18,
        color: '#ded7ca',
        fontWeight: 'bold',
        letterSpacing: 1,
        padding: 5
        //alignItems:'center'

    },
    modalText: { //回收成功
        fontSize: 26,
        color: '#a8392a',
        fontWeight: 'bold',
        marginTop: 30
    },
    modalText2: { //解說內容
        fontSize: 19,
        marginTop: 30,
        marginHorizontal: 40,
        justifyContent: 'center',
        alignItems: 'center',
        color: '#3C3C3C',

    },
    modalgameteachText: { //遊戲操作說明標題
        fontSize: 28,
        color: '#04151f',
        marginTop: 30,
        fontWeight: 'bold',
        letterSpacing: 2
    },
    modalgameteachText1: { //遊戲操作說明
        fontSize: 18,
        textAlign: 'center',
        color: '#3C3C3C',
        marginTop: 30,
        lineHeight: 30

    },
})