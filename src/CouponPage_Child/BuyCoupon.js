import React from "react";
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    Image,
    TouchableOpacity,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import AntDesign from "react-native-vector-icons/AntDesign";
import * as firebase from 'firebase';
import { storage } from 'firebase'

//*price改point*//

export default class BuyCoupon extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            point: '',
            name: '',
            content: '',
            image: '',
            data: []
        };
    }
    componentDidMount() {
        firebase.storage().ref().child('coupon_image/ts_logo.png').getDownloadURL().then((url) => {
            this.setState({
                url: url
            })
            //console.log(url);
        }).catch(err => console.log(err));

        //setInterval(() => {
        const that = this;
        firebase.database().ref('coupon/').once('value', (snapshot) => {
            var returnArray = [];
            snapshot.forEach((child) => {
                returnArray.push({
                    //key: child.key,
                    name: child.val().name,
                    content: child.val().content,
                    point: child.val().point,
                    image: child.val().image

                })
            })
            storage
            this.setState({ data: returnArray })
            //console.log(this.state.data);
        });
        // }, 1000);
    }
    renderItem = ({ item }) => {
        return (
            <LinearGradient
                colors={['#ded7ca', '#04151f']}
                start={{ x: 0, y: 20 }} end={{ x: 1, y: 0 }}
                style={styles.item}
            >
                {
                    // <View style={styles.image_container}>
                    <Image
                        source={{ uri: item.image }}
                        style={styles.image}
                    />
                    // </View>
                }

                <View style={styles.content}>
                    <Text style={{
                        paddingLeft: 10,
                        color: '#ded7ca',
                        fontWeight: 'bold',
                        fontSize: 16
                    }} allowFontScaling={false}>{item.name}</Text>
                    <Text style={{
                        paddingLeft: 10,
                        paddingTop: 10,
                        color: '#ded7ca',
                        fontWeight: 'bold',
                        fontSize: 14,
                    }} allowFontScaling={false}>{item.content}</Text>
                    <View style={{
                        alignItems: 'flex-end'
                    }}>
                        <Text style={{
                            color: '#ded7ca',
                            fontSize: 14
                        }} allowFontScaling={false}>{item.point} points</Text>
                    </View>

                </View>
                <TouchableOpacity
                    onPress={() => this.props.props.navigation.navigate("DetailScreen", {
                        //key: item.key,
                        image: item.image,
                        point: item.point,
                        name: item.name,
                        content: item.content,
                        /*refresh: function () {
                            this.init=()=>{
                                this.forceUpdate();
                            };
                        }*/
                    })
                    }
                    style={styles.button}>
                    <AntDesign
                        name="arrowright"
                        color="#ded7ca"
                        size={17}
                    />
                </TouchableOpacity>
            </LinearGradient>

        )
    }

    ItemSeparatorComponent = () => {
        return (
            <View
                style={{
                    height: 10
                }}
            />
        )
    }

    render() {
        return (
            <View style={styles.container}>

                <FlatList style={{ width: '100%' }}
                    data={this.state.data}
                    renderItem={this.renderItem}
                    keyExtractor={(item, index) => index.toString()}
                    ItemSeparatorComponent={this.ItemSeparatorComponent}
                    showsVerticalScrollIndicator={false}

                />
            </View>
        )
    }
}

var styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingBottom: 5,
        width: '100%'

    },
    flatList: {
        flex: 1,
        marginTop: 10
    },
    item: {
        flex: 1,
        paddingVertical: 10,
        paddingHorizontal: 10,
        flexDirection: 'row',
        borderRadius: 10
    },
    image_container: {
        width: 70,
        height: 70,
    },
    image: {
        width: 70,
        height: 70,
        borderWidth: 3,
        borderColor: '#ded7ca',
        borderRadius: 10
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 10,
        paddingTop: 6
    },
    button: {
        width: 30,
        height: 30,
        backgroundColor: '#04151f',
        borderRadius: 15,
        borderWidth: 1,
        borderColor: '#ded7ca',
        justifyContent: 'center',
        alignItems: 'center'
    },
})