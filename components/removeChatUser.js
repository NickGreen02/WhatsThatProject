import React, { Component } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { ActivityIndicator, FlatList, TouchableOpacity } from 'react-native-web';
import AsyncStorage from '@react-native-async-storage/async-storage';

import Contact from './contact';

export default class RemoveChatUser extends Component {
  constructor(props) {
    super(props);
    this.state = { members: {}, isLoading: false };
  }

  componentDidMount() {
    const { navigation } = this.props;
    this.unsubscribe = navigation.addListener('focus', () => {
      this.checkLoggedIn();
    });
    this.refreshMembers = navigation.addListener('focus', () => {
      this.getData();
    });
    console.log('Data displayed');
  }

  componentWillUnmount() {
    this.unsubscribe();
    this.refreshMembers();
  }

  async getData() {
    const { route } = this.props;
    const { chatJSON } = route.params;

    let membersJSON = chatJSON.members;
    const loggedInUser = await AsyncStorage.getItem('whatsthat_user_id');
    console.log(loggedInUser);
    console.log(membersJSON);

    // remove current logged in user from list of members
    membersJSON = membersJSON.filter((obj) => parseInt(obj.user_id, 10) !== parseInt(loggedInUser, 10));
    console.log(membersJSON);

    this.setState({ members: membersJSON });
  }

  checkLoggedIn = async () => {
    const { navigation } = this.props;
    const value = await AsyncStorage.getItem('whatsthat_session_token');
    if (value == null || value === '') {
      navigation.navigate('Login');
    }
  };

  async removeMember(userID) {
    const { navigation, route } = this.props;
    const { chatId } = route.params;
    return fetch(
      `http://localhost:3333/api/1.0.0/chat/${chatId}/user/${userID}`,
      {
        method: 'DELETE',
        headers: { 'X-Authorization': await AsyncStorage.getItem('whatsthat_session_token') },
      },
    )
      .then((response) => {
        if (response.status === 200) {
          navigation.goBack();
          return response.json();
        } if (response.status === 401) {
          throw new Error('Unauthorised access');
        } if (response.status === 403) {
          throw new Error('Forbidden by server');
        } if (response.status === 404) {
          throw new Error('Not found');
        } if (response.status === 500) {
          throw new Error('Server error');
        } else {
          throw new Error('Something went wrong');
        }
      })
      .then((rJson) => {
        console.log(rJson);
        this.setState({ members: rJson, isLoading: true });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  render() {
    const { members, isLoading } = this.state;
    if (isLoading) {
      return (
        <View style={Styles.container}>
          <ActivityIndicator />
        </View>
      );
    } else {
      return (
        <View style={Styles.container}>
          <View style={Styles.formContainer}>
            <FlatList
              data={members}
              renderItem={({ item }) => (
                <View>
                  <Contact firstname={item.first_name} surname={item.last_name} />
                  <TouchableOpacity onPress={() => this.removeMember(item.user_id)}>
                    <View style={Styles.removeMemberButton}>
                      <Text style={Styles.buttonText}>Remove User</Text>
                    </View>
                  </TouchableOpacity>
                </View>
              )}
              keyExtractor={(item) => item.user_id}
            />
          </View>
        </View>
      );
    }
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
  optionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeMemberButton: {
    justifyContent: 'center',
    backgroundColor: '#25D366',
    marginTop: 2,
    marginBottom: 8,
    margin: 5,
  },
  buttonText: {
    padding: 10,
    color: 'white',
  },
});
