import React, { Component } from "react";
import {
  Animated,
  Dimensions,
  StyleSheet,
  Text,
  View,
  Image,
  ImageBackground,
  TouchableOpacity,
  Modal,
  TouchableHighlight,
  FlatList,
  DeviceEventEmitter,
} from 'react-native';
import LinearGradient from "react-native-linear-gradient";
import * as firebase from 'firebase'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
var mymission = [];
var planetImage = [
  { 1: require('./asset/planetImage/Earth1.png'), 2: require('./asset/planetImage/Earth2.png'), 3: require('./asset/planetImage/Earth3.png'), 4: require('./asset/planetImage/Earth4.png'), 5: require('./asset/planetImage/Earth5.png') },
  { 1: require('./asset/planetImage/pulotoplanet1.png'), 2: require('./asset/planetImage/pulotoplanet2.png'), 3: require('./asset/planetImage/pulotoplanet3.png'), 4: require('./asset/planetImage/pulotoplanet4.png'), 5: require('./asset/planetImage/pulotoplanet5.png') },
  { 1: require('./asset/planetImage/Browmstar1.png'), 2: require('./asset/planetImage/Browmstar2.png'), 3: require('./asset/planetImage/Browmstar3.png'), 4: require('./asset/planetImage/Browmstar4.png'), 5: require('./asset/planetImage/Browmstar5.png') },
  { 1: require('./asset/planetImage/redpalnet1.png'), 2: require('./asset/planetImage/redpalnet2.png'), 3: require('./asset/planetImage/redpalnet3.png'), 4: require('./asset/planetImage/redpalnet4.png'), 5: require('./asset/planetImage/redpalnet5.png') },
  { 1: require('./asset/planetImage/circlepalnet1.png'), 2: require('./asset/planetImage/circlepalnet2.png'), 3: require('./asset/planetImage/circlepalnet3.png'), 4: require('./asset/planetImage/circlepalnet4.png'), 5: require('./asset/planetImage/circlepalnet5.png') },
]

const { width } = Dimensions.get("window");
//_________________________control____ballscreen________________________
const SCREEN_WIDTH = Dimensions.get("window").width;
const xOffset = new Animated.Value(0);
const Screen = props => {
  return (
    <View style={styles.scrollPage}>
      <Animated.View style={[styles.screen, { paddingBottom: hp('10%') }, transitionAnimation(props.index)]}>
        <Image style={{
          //...styles.imagebackground,
          width: Platform.OS === 'ios' ? '80%' : '100%',
          height: Platform.OS === 'ios' ? '90%' : '98%',
          //marginLeft: props.marginLeft,
          resizeMode: 'contain',
          //backgroundColor:'green'
        }}
          source={props.img}>{props.imagebackground}</Image>
      </Animated.View>
    </View>
  );
};
const transitionAnimation = index => { //星球滑動
  return {
    transform: [
      { perspective: 800 },
      {
        scale: xOffset.interpolate({
          inputRange: [
            (index - 1) * SCREEN_WIDTH,
            index * SCREEN_WIDTH,
            (index + 1) * SCREEN_WIDTH
          ],
          outputRange: [-0.4, 1, -0.4]
        })
      },
      {
        rotateX: xOffset.interpolate({
          inputRange: [
            (index - 1) * SCREEN_WIDTH,
            index * SCREEN_WIDTH,
            (index + 1) * SCREEN_WIDTH
          ],
          outputRange: ["0deg", "0deg", "0deg"]
        })
      },
      {
        rotateY: xOffset.interpolate({
          inputRange: [
            (index - 1) * SCREEN_WIDTH,
            index * SCREEN_WIDTH,
            (index + 1) * SCREEN_WIDTH
          ],
          outputRange: ["0deg", "0deg", "0deg"]
        })
      }
    ]
  };
};


export default class HomePage extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      usetimes: '',
      rentaltimes: '',
      gameopen: false,
      data: {},
      modalVisible: false,
      level: 0,
      ball: [
        {
          picture: null, index: 0, width: wp('70%'), height: hp('54%'),
        }, {
          picture: null, index: 1, width: wp('70%'), height: hp('54%'),
        }, {
          picture: null, index: 2, width: wp('70%'), height: hp('54%'),
        }, {
          picture: null, index: 3, width: wp('70%'), height: hp('54%'),
        }, {
          picture: null, index: 4, width: wp('70%'), height: hp('54%'),
        }
      ]
    }
    this.showplanet();
    var RegisterUser = firebase.auth().currentUser;
    this.showmission();
    firebase.database().ref('users/' + RegisterUser.uid + '/otherdata').once('value', snapshot => {
      this.state.gameopen = snapshot.val().playgame;
    });
  }
  componentDidMount() {
    var RegisterUser = firebase.auth().currentUser;
    firebase.database().ref('users/' + RegisterUser.uid).once('value', snapshot => {
      this.setState({
        usetimes: snapshot.val().usetimes,
        planet: snapshot.val().planet,
        point: snapshot.val().point
      });
    })
    this.showplanet.bind(this);
    DeviceEventEmitter.addListener('gameOC', (dic) => {
      //打開遊戲
      firebase.database().ref('users/' + RegisterUser.uid).once('value', snapshot => {
        this.setState({ point: snapshot.val().point })
      })
      this.setState({
        gameopen: dic.text,
      });
    });
    DeviceEventEmitter.addListener('ChangeOrder', (dic) => {
      //租借歸還點數回饋
      this.setState({
        point: dic.r_point,
      });
      this.changemission(dic.r_times);
    });
    DeviceEventEmitter.addListener('GamePoint', (dic) => {
      //遊戲點數回饋
      this.setState({
        point: dic.r_point,
      })
    });
    DeviceEventEmitter.addListener('CouponPoint', (dic) => {
      //優惠券點數更新
      this.setState({
        point: dic.r_point,
      });
    });
    DeviceEventEmitter.addListener('Newplanet', (dic) => {
      //任務表更新
      this.showmission();
    });
    DeviceEventEmitter.addListener('OpenMissionGame', (dic) => {
      //任務表更新遊戲
      this.showmission();
    });
  }
  showmission() {
    var RegisterUser = firebase.auth().currentUser;
    firebase.database().ref('users/' + RegisterUser.uid + '/otherdata/').once('value', snapshot => {
      var level_log = snapshot.val().missionLevel
      this.setState({
        level: snapshot.val().missionLevel,
        allmission: snapshot.val().mission,
      });
      var getmission = 0;
      switch (level_log) {
        case 1: getmission = 1; break;
        case 2: getmission = 6; break;
        case 3: getmission = 11; break;
        case 4: getmission = 16; break;
        case 5: getmission = 21; break;
        default: break;
      }
      mymission = this.state.allmission.split(",");
      firebase.database().ref('mission/').once('value', (snapshot) => {
        var returnArray = [], i = 0, j = 0;
        snapshot.forEach((child) => {
          if (getmission <= (i + 1) && (i + 1) < (getmission + 5)) {
            returnArray.push({
              mymis: mymission[j],
              title: child.val().title,
              content: child.val().content,
              point: child.val().point,
              rentaltimes: child.val().rentaltimes
            })
            j++;
          }
          i++;
        })
        this.setState({ data: returnArray })
      });
    })
  }
  changemission(userretaltimes) {
    var RegisterUser = firebase.auth().currentUser;
    //level使用者任務階級
    //mymission使用者任務表_array
    //a使用者總租借次數
    //var missionstr = "mission";
    firebase.database().ref('users/' + RegisterUser.uid + '/otherdata/').once('value', snapshot => {
      var a = userretaltimes;//使用者總租借次數
      var level = snapshot.val().missionLevel;//使用者任務階級
      var allmission = snapshot.val().mission;//使用者任務表_firebase
      var mymission = [];
      mymission = allmission.split(",");//使用者任務表_array
      var missionArray = []
      switch (level) {
        case 1: missionArray = [{ m: 'mission1', c: 'g' }, { m: 'mission2', c: 1 }, { m: 'mission3', c: 3 }, { m: 'mission4', c: 5 }, { m: 'mission5', c: 8 }]; break;
        case 2: missionArray = [{ m: 'mission6', c: 'g' }, { m: 'mission7', c: 10 }, { m: 'mission8', c: 12 }, { m: 'mission9', c: 15 }, { m: 'mission10', c: 18 }]; break;
        case 3: missionArray = [{ m: 'mission11', c: 'g' }, { m: 'mission12', c: 20 }, { m: 'mission13', c: 22 }, { m: 'mission14', c: 25 }, { m: 'mission15', c: 28 }]; break;
        case 4: missionArray = [{ m: 'mission16', c: 'g' }, { m: 'mission17', c: 30 }, { m: 'mission18', c: 32 }, { m: 'mission19', c: 35 }, { m: 'mission20', c: 38 }]; break;
        case 5: missionArray = [{ m: 'mission21', c: 'g' }, { m: 'mission22', c: 40 }, { m: 'mission23', c: 42 }, { m: 'mission24', c: 45 }, { m: 'mission25', c: 48 }]; break;
        default: break;
      }
      for (var i = 0; i < 5; i++) {
        if (mymission[i] == "0" && a >= missionArray[i]['c']) {
          mymission[i] = "1"
          this.state.data[i]["mymis"] = "1";
        }
      }
      var newmission = mymission.toString();
      firebase.database().ref('users/' + RegisterUser.uid + '/otherdata/').update({
        mission: newmission,
      });
    })
  }
  showplanet() {
    var RegisterUser = firebase.auth().currentUser;
    firebase.database().ref('users/' + RegisterUser.uid + '/otherdata/').once('value', snapshot => {
      var logplanet = [];//存放使用者星球資料log
      var allplanet = snapshot.val().planet;
      logplanet = allplanet.split(",")//切割
      for (var i = 0; i < logplanet.length; i++) {
        if (logplanet[i] == "0") {
          this.state.ball[i]["picture"] = planetImage[i]['1']
        } else {
          this.state.ball[i]["picture"] = planetImage[i][logplanet[i]]
        }
      }
    })
  }
  getplanetId() {
    var RegisterUser = firebase.auth().currentUser;
    var myplanet = [];
    firebase.database().ref('users/' + RegisterUser.uid + '/otherdata/').once('value', snapshot => {
      var allplanet = snapshot.val().planet;
      myplanet = allplanet.split(",");
      var getplanet = 0;
      var planetclean = "5";
      for (var i = 0; i < myplanet.length; i++) {//4:all,3:21
        if (myplanet[i] == "4" || myplanet[i] == "3" || myplanet[i] == "2" || myplanet[i] == "1") {
          getplanet = i;
          planetclean = myplanet[i];
          break;
        }
        else if (myplanet[i] == "0") {
          getplanet = i + 1;
          planetclean = "4";
        }
      }
      var a = parseInt(myplanet[getplanet], 10);
      a--;
      myplanet[getplanet] = a.toString();
      var newplanet = myplanet.toString();
      if (a == 0) {
        this.state.ball[getplanet]["picture"] = planetImage[getplanet]['1'];
      } else {
        this.state.ball[getplanet]["picture"] = planetImage[getplanet][a];
      }
      this.state.planet = (getplanet + 1);
      var RegisterUser = firebase.auth().currentUser;
      firebase.database().ref('users/' + RegisterUser.uid).update({
        planet: this.state.planet
      });

      firebase.database().ref('users/' + RegisterUser.uid + '/otherdata/').update({
        planet: newplanet,
      });
    });
  }
  completemission(id, point) {
    this.getplanetId();
    var mpoint = point;
    var RegisterUser = firebase.auth().currentUser;
    firebase.database().ref('users/' + RegisterUser.uid).once('value', snapshot => {
      this.setState({
        point: snapshot.val().point
      });
      var usrpoint = this.state.point;
      var sumpoint = (usrpoint + mpoint);
      this.state.point = sumpoint;
      firebase.database().ref('users/' + RegisterUser.uid).update({
        point: sumpoint
      });

    });
    var misid;
    switch (id) {
      case 0: mymission[0] = "2"; misid = 0; break;
      case 1: mymission[1] = "2"; misid = 1; break;
      case 2: mymission[2] = "2"; misid = 2; break;
      case 3: mymission[3] = "2"; misid = 3; break;
      case 4: mymission[4] = "2"; misid = 4; break;
      default: break;
    }
    var allcomplete = false;
    for (var i = 0; i < 5; i++) {
      if (mymission[i] != "2") {
        allcomplete = false;
        break;
      }
      else {
        allcomplete = true;
      }
    }
    if (allcomplete) {
      for (var a = 0; a < 5; a++) {
        mymission[a] = "0";
      }
      this.state.level += 1;
      this.state.planet += 1;
      alert("恭喜你完成所有任務！\n可以解鎖下一顆星球了！");
      DeviceEventEmitter.emit('Newplanet', { text: 'newplant' });
    } else {
      alert("兌換完成！");
      this.state.data[misid]["mymis"] = "2";
    }
    this.state.modalVisible = false;
    var newmission = mymission.toString();

    firebase.database().ref('users/' + RegisterUser.uid + '/otherdata/').update({
      mission: newmission,
      missionLevel: this.state.level,
    });
    firebase.database().ref('users/' + RegisterUser.uid).update({
      planet:this.state.planet
    });
    this.showplanet.bind(this)
  }
  renderItem = ({ item, index }) => {
    return (
      <LinearGradient
        colors={['#D2B48C', '#FDF5E6']}
        start={{ x: 0, y: 1.5 }} end={{ x: 0, y: 0 }}
        style={styles.item}
      >
        <Text style={{ color: '#444444', fontSize: 15, paddingTop: 7, paddingLeft: 10, fontWeight: 'bold' }} allowFontScaling={false}>{item.title}</Text>
        <Text style={{ color: '#696969', paddingTop: 5, fontSize: 14, paddingLeft: 10 }} allowFontScaling={false}>{item.content}</Text>
        <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
          {
            item.mymis == "1" ?
              <TouchableOpacity onPress={() => this.completemission(index, item.point)}>
                <View>
                  <Text style={{
                    backgroundColor: '#FDF5E6',
                    fontSize: 15,
                    borderRadius: 5,
                    paddingHorizontal: 25,
                    marginTop: 8,
                    color: '#696969',
                    textAlign: 'center'
                  }} allowFontScaling={false}>完成</Text>
                </View>
              </TouchableOpacity> :
              <View style={{}}>
                <Text style={{
                  backgroundColor: 'white',
                  fontSize: 15,
                  borderRadius: 5,
                  paddingHorizontal: 20,
                  color: 'lightgray',
                  marginTop: 8,
                  textAlign: 'center',
                }} allowFontScaling={false}>{item.mymis == "0" ? "未解鎖" : "已兌換"}</Text>
              </View>
          }
        </View>

      </LinearGradient>
    )
  }
  ItemSeparatorComponent = () => {
    return (
      <View
        style={{
          height: 15,
          width: 300
        }}
      />
    )
  }
  setModalVisible = (visible) => {
    this.setState({ modalVisible: visible });
  }
  render() {
    const { modalVisible } = this.state;
    return (
      <ImageBackground
        style={styles.container}
        source={require("./asset/homebackground.png")}
      >
        {/**____________上面星球金幣任務表__________________ */}
        <View style={{
          //height: hp('11%'),
          flexDirection: 'row',
          justifyContent: 'space-evenly',
          alignItems: 'center',
          marginTop: Platform.OS === 'ios' ? hp('6%') : hp('3%'),
          marginRight: Platform.OS === 'ios' ? hp('1%') : hp('0.5%')
        }}>
          <Image source={require("./asset/planet_total.png")}
            style={styles.planettotal} />
          <View style={styles.scoreView}>

            <Text style={styles.shownum} allowFontScaling={false}>{this.state.level}</Text>

          </View>
          <Image source={require("./asset/point.png")}
            style={styles.money} />

          <View style={styles.scoreView}>
            <Text style={styles.shownum} allowFontScaling={false}>{this.state.point}</Text>
          </View>

          <TouchableOpacity style={{ backgroundColor: '#022633', padding: 10, borderRadius: 10, paddingHorizontal: Platform.OS === 'ios' ? 10 : 10, }} onPress={() => { this.setModalVisible(true); }}>
            <Image //太空人
              source={require("../Images/gameicon.png")}
              style={{ height: hp('8%'), width: wp('15%'), resizeMode: 'contain' }}
              imageStyle={{
                position: 'absolute',
                top: Platform.OS === 'ios' ? 2 : 1,
              }}>
            </Image>
          </TouchableOpacity>
        </View>
        {/**________________遊戲按鈕____________________ */}
        <View style={{ flexDirection: 'row', justifyContent: 'flex-end', paddingTop: hp('5%'), paddingRight: wp('10%') }}>
          {this.state.gameopen ? <TouchableOpacity
            visible={true}
            //disabled={!this.state.gameopen}
            onPress={() => this.props.navigation.navigate('GameScreen')}>
            <Image //火箭
              source={require("../Images/火箭2.png")}
              style={{ height: wp('15%'), width: wp('15%'), resizeMode: 'contain' }}
            >
            </Image>
          </TouchableOpacity>
            : <View><Image //火箭
              source={require("../Images/火箭3.png")}
              style={{ height: wp('15%'), width: wp('15%'), resizeMode: 'contain' }}
            ></Image></View>}

        </View>
        {/**_________________星球畫面___________________ */}
        <Animated.ScrollView
          scrollEventThrottle={16}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { x: xOffset } } }],
            { useNativeDriver: true }
          )}
          horizontal
          pagingEnabled
          style={styles.scrollView}
          showsHorizontalScrollIndicator={false}
        >
          {this.state.ball.map((i) =>
            <Screen img={i.picture} text={i.ballname} index={i.index} width={i.width} hei={i.height} marginLeft={i.marginLeft} />
          )}
        </Animated.ScrollView>
        {/**__________________垃圾_____________________ 
        <View style={{ position: 'absolute', top: 280, left: 25, }}>
          <Viewport />
        </View>
        <View style={{ position: 'absolute', top: 280, left: 299, }}>
          <Viewport />
        </View>
        <View style={{ position: 'absolute', top: 200, left: 150, }}>
          <Viewport />
        </View>
        <View style={{ position: 'absolute', top: 350, left: 150, }}>
          <Viewport />
        </View>*/}
        {/**______________任務表內容處Modal______________ */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            this.setModalVisible(false)
          }}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.modalText} allowFontScaling={false}>任務表</Text>
              <FlatList
                data={this.state.data}
                renderItem={this.renderItem}
                keyExtractor={(item, index) => index.toString()}
                ItemSeparatorComponent={this.ItemSeparatorComponent}
                showsVerticalScrollIndicator={false}
                style={{ width: '100%' }}
              />
              <TouchableHighlight
                style={{ ...styles.openButton, backgroundColor: "#D2B48C" }}
                onPress={() => {
                  this.setModalVisible(!modalVisible);
                }}
              >
                <Text style={styles.textStyle} allowFontScaling={false}>CLOSE</Text>
              </TouchableHighlight>
            </View>
          </View>
        </Modal>
      </ImageBackground>
    )
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    //paddingTop: 25,
    backgroundColor: '#04151f',
  },
  scrollView: {
    //flex: 1,
    flexDirection: "row",
    //backgroundColor: 'red',
    //paddingTop: Platform.OS === 'ios' ? 50 : 10,
  },
  scrollPage: {
    width: SCREEN_WIDTH,
    //paddingTop: Platform.OS === 'ios' ? 20 : 0,
    //backgroundColor:'blue'
  },
  screen: {
    //height: 100,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 2,
  },

  money: {
    height: 40,
    width: wp('9%'),
    resizeMode: 'contain',
    marginRight: Platform.OS === 'ios' ? 5 : '0%',
  },
  planettotal: {
    marginLeft: Platform.OS === 'ios' ? 9 : 0,
    marginRight: Platform.OS === 'ios' ? 5 : '0%',
    height: Platform.OS === 'ios' ? 50 : 45,
    width: Platform.OS === 'ios' ? wp('9%') : wp('8%'),
    resizeMode: 'contain',
    //backgroundColor:'green'
  },
  scoreView: {
    width: hp('10%'),
    backgroundColor: '#e8e8e8',
    borderRadius: 9,
    paddingHorizontal: 10,
    paddingVertical: 3,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 20,
  },
  shownum: {
    textAlign: 'center',
    justifyContent: 'center',
    height: Platform.OS === 'ios' ? 25 : 20,
    marginTop: Platform.OS === 'ios' ? 5 : '5%',
    //fontSize: 20,
  },
  power: {
    height: 15,
    width: 300,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    //margin: 20,
    backgroundColor: "#FAF0E6",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    height: hp('60%'),
    width: wp('90%'),
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  openButton: {
    borderRadius: 20,
    height: hp('5%'),
    width: wp('20%'),
    elevation: 2,
    marginTop: 5,
    justifyContent: 'center'
  },
  textStyle: {
    color: 'white',
    fontWeight: "bold",
    textAlign: "center"
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
    fontSize: 30,
    color: '#696969'
  },
  item: {
    flex: 1,
    padding: 10,
    borderRadius: 10
  },
  label: {
    fontSize: 24,
    color: "black",
    position: "absolute",
    zIndex: 1,
    alignSelf: "center",
  },
});
