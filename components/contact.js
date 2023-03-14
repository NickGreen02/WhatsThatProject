import React, { Component } from 'react';
import { Text, View, StyleSheet } from 'react-native';

export default class Contact extends Component {
    render(){
        return(
        <View style={Styles.contactBorder}>
            <Text style={Styles.name}>{this.props.firstname}</Text>
            <Text style={Styles.name}>{this.props.surname}</Text>
        </View>
        )
    }
}

const Styles = StyleSheet.create({
    contactBorder:{
        borderLeftWidth: 'thin',
        borderRightWidth: 'thin',
        borderTopWidth: 'thin',
        borderBottomWidth: 'thin',
        borderRadius: 5,
        padding: 10,
        margin: 5,
        backgroundColor: '#1fad55',
        justifyContent: "stretch",
    },
    name:{
        fontSize: 20,
        color: 'white'
    }
})