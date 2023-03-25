import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { FlatList } from 'react-native-web';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default class ChatScreenApp extends Component {
  constructor(props) {
    super(props);
    this.state = { chat: {} };
  }

  componentDidMount() {
    this.getData();
  }

  async getData() {
    return fetch(
      'http://localhost:3333/api/1.0.0/chat/1',
      {
        method: 'GET',
        headers: { 'X-Authorization': await AsyncStorage.getItem('whatsthat_session_token') },
      },
    )
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        } if (response.status === 401) {
          throw new Error('Unauthorised');
        } else if (response.status === 500) {
          throw new Error('Server error');
        } else {
          throw new Error('Something went wrong');
        }
      })
      .then((rJson) => {
        console.log(rJson);
        this.setState({ chat: rJson });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  render() {
    const { chat } = this.state;
    return (
      <View style={Styles.container}>
        <View style={Styles.formContainer}>
          <FlatList
            data={chat.messages}
            renderItem={({ item }) => (
              <View style={Styles.messageBubbleTest}>
                <Text>
                  {item.author.first_name}
                  {' '}
                  {item.author.last_name}
                </Text>
                <Text>{item.message}</Text>
              </View>
            )}
            keyExtractor={(item) => item.message_id}
          />
        </View>
      </View>
    );
  }
}

// stylesheet for the page
const Styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    alignItems: 'stretch',
    justifyContent: 'flex-start',
  },
  formContainer: {
  },
  messageBubbleTest: {
    borderLeftWidth: 'thin',
    borderRightWidth: 'thin',
    borderTopWidth: 'thin',
    borderBottomWidth: 'thin',
    borderRadius: 5,
    padding: 10,
    margin: 5,
  },
});
