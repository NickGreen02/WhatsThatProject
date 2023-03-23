import React, { Component } from 'react';
import {
  Text, View, Image, StyleSheet,
} from 'react-native';
// import AsyncStorage from '@react-native-async-storage/async-storage';

export default class UserProfileApp extends Component {
  // constructor(props) {
  //   super(props);
  //   // eslint-disable-next-line react/no-unused-state
  //   this.state = { userData: {} };
  // }

  // componentDidMount() {
  //   const { navigation } = this.props;
  //   this.unsubscribe = navigation.addListener('focus', () => {
  //     this.checkLoggedIn();
  //   });
  //   this.getData();
  //   console.log('Data displayed');
  // }

  // componentWillUnmount() {
  //   this.unsubscribe();
  // }

  // async getData() {
  //   return fetch(
  //     'http://localhost:3333/api/1.0.0/contacts',
  //     {
  //       method: 'GET',
  //       headers: { 'X-Authorization': await AsyncStorage.getItem('whatsthat_session_token') },
  //     },
  //   )
  //     .then((response) => {
  //       if (response.status === 200) {
  //         return response.json();
  //       } if (response.status === 401) {
  //         throw new Error('Unauthorised');
  //       } else if (response.status === 500) {
  //         throw new Error('Server error');
  //       } else {
  //         throw new Error('Something went wrong');
  //       }
  //     })
  //     .then((rJson) => {
  //       console.log(rJson);
  //       this.setState({ userData: rJson });
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //     });
  // }

  // checkLoggedIn = async () => {
  //   const { navigation } = this.props;
  //   const value = await AsyncStorage.getItem('whatsthat_session_token');
  //   if (value == null) {
  //     navigation.navigate('Login');
  //   }
  // };

  render() {
    return (
      <View style={Styles.container}>
        <View style={Styles.formContainer}>
          <Image />
          <Text style={Styles.name}>Firstname Lastname</Text>
          <Text style={Styles.email}>Email address</Text>
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
  name: {
    fontSize: 20,
  },
  email: {
    fontSize: 15,
  },
});
