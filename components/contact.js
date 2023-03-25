import React, { Component } from 'react';
import { Text, View, StyleSheet } from 'react-native';

export default class Contact extends Component {
  render() {
    const { firstname, surname } = this.props;
    return (
      <View style={Styles.contactBorder}>
        <Text style={Styles.name}>{firstname}</Text>
        <Text style={Styles.name}>{surname}</Text>
      </View>
    );
  }
}

const Styles = StyleSheet.create({
  contactBorder: {
    borderLeftWidth: 'thin',
    borderRightWidth: 'thin',
    borderTopWidth: 'thin',
    borderBottomWidth: 'thin',
    borderRadius: 5,
    padding: 10,
    margin: 5,
    backgroundColor: '#1fad55',
    justifyContent: 'stretch',
  },
  name: {
    fontSize: 20,
    color: 'white',
  },
});
