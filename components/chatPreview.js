import React, { Component } from 'react';
import { Text, View, StyleSheet } from 'react-native';

export default class ChatPreview extends Component {
    render(){
        return(
        <View style={Styles.chatBorder}>
            <Text style={Styles.title}>{this.props.name}</Text>
            <Text style={Styles.creator}>Creator: {this.props.creatorName}</Text>
            <Text style={Styles.lastMessage}>Last message: {this.props.messagePreview}</Text>
        </View>
        )
    }
}

const Styles = StyleSheet.create({
    chatBorder:{
        borderLeftWidth: 'thin',
        borderRightWidth: 'thin',
        borderTopWidth: 'thin',
        borderBottomWidth: 'thin',
        borderRadius: 5,
        padding: 10,
        margin: 5,
        backgroundColor: '#1fad55'
    },
    title:{
        fontWeight: 'bold',
        fontSize: 20,
        color: 'white'
    },
    creator:{
        fontSize: 15,
        color: 'white'
    },
    lastMessage:{
        fontSize: 13,
        color: 'white'
    }
})