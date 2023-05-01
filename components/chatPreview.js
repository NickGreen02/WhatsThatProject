import React, { Component } from 'react';
import { Text, View, StyleSheet } from 'react-native';

export default class ChatPreview extends Component {
  // render a chat preview box, with chat name, last message preview and chat creator name
  render() {
    const { creatorName, messagePreview, name } = this.props;
    return (
      <View style={styles.chatBorder}>
        <Text style={styles.title}>{name}</Text>
        <Text style={styles.creator}>
          Creator:
          {' '}
          {creatorName}
        </Text>
        <Text style={styles.lastMessage}>
          Last message:
          {' '}
          {messagePreview}
        </Text>
      </View>
    );
  }
}

// stylesheet for the component
const styles = StyleSheet.create({
  chatBorder: {
    borderLeftWidth: 'thin',
    borderRightWidth: 'thin',
    borderTopWidth: 'thin',
    borderBottomWidth: 'thin',
    borderRadius: 5,
    padding: 10,
    margin: 5,
    backgroundColor: '#1fad55',
  },
  title: {
    fontWeight: 'bold',
    fontSize: 20,
    color: 'white',
  },
  creator: {
    fontSize: 15,
    color: 'white',
  },
  lastMessage: {
    fontSize: 13,
    color: 'white',
  },
});
