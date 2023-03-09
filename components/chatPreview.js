import React, { Component } from 'react';
import { Text, View, StyleSheet } from 'react-native';

export default class ChatPreview extends Component {
    render(){
        return(
        <View>
            <Text>{this.props.name}</Text>
            <Text>Creator: {this.props.creatorName}</Text>
            <Text>Last message: {this.props.lastMessage}</Text>
        </View>
        )
    }
}