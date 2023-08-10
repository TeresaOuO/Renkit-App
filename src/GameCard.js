import React, { Component } from 'react';
import {
    StatusBar,
    SafeAreaView,
    View,
    Text,
    TouchableOpacity,
    Image

} from 'react-native';

class Card extends Component {
    render() {
        return (
            <TouchableOpacity onPress={this.props.onPress} style={{ ...this.props.style }}>
                <Image source={this.props.isShow ? this.props.title : this.props.cover} style={{ width:75,height:75 }} />
            </TouchableOpacity>
        )
    }
}
export default Card