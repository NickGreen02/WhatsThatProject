import React, { Component } from 'react';
import { Text, View, StyleSheet } from 'react-native';

export default class Contact extends Component {
  // render first name and surname in a box for contact display
  render() {
    const { firstname, surname } = this.props;
    return (
      <View style={styles.contactBorder}>
        <Text style={styles.name}>
          {firstname}
          {' '}
          {surname}
        </Text>
      </View>
    );
  }
}

// stylesheet for the component
const styles = StyleSheet.create({
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
