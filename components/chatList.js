import React, { Component } from 'react';
import { Text, TextInput, View, StyleSheet } from 'react-native';
import { FlatList, ScrollView, TouchableOpacity } from 'react-native-web';
import AsyncStorage from '@react-native-async-storage/async-storage';

import ChatPreview from './chatPreview';

export default class ChatlistApp extends Component {
    constructor(props){
        super(props);
        this.state = {chats: {}};
    }

    componentDidMount(){
      this.unsubscribe = this.props.navigation.addListener('focus', () => {
        this.checkLoggedIn();
      })

      return fetch('http://localhost:3333/api/1.0.0/chat',
      {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      })
      .then((response) => {
        if (response.status === 200){
          return response.json();
        }
        else if (response.status === 401){
          throw "Unauthorised"
        }
        else if (response.status === 500){
          throw "Server error"
        }
        else{
          throw "Something went wrong"
        }
      })
      .then((rJson) => {
        console.log(rJson)
        this.setState({chats: rJson})
      });
    }

    componentWillUnmount(){
      this.unsubscribe();
    }

    checkLoggedIn = async () => {
      const value = await AsyncStorage.getItem('whatsthat_session_token')
      if(value == null){
        this.props.navigation.navigate('Login')
      }
    }

    render(){
        return(
            <View style={styles.container}>
                <View style={styles.formContainer}>
                    <FlatList
                      data={this.state.chats}
                      renderItem={({item}) => <ChatPreview name={item.name} creatorName = {item.creator.first_name} messagePreview = {item.last_message.message}/>}
                      keyExtractor={item => item.chat_id}
                    />
                </View>
            </View>
        )
    }
}

//stylesheet for the page
const styles = StyleSheet.create({
    container:{
      flex: 1,
      width: "100%",
      alignItems:"center",
      justifyContent:"center"
    },
    formContainer: {
      
    },
    email: {
      margin:10,
    },
    password: {
      margin:10,
    },
    button: {
      backgroundColor: '#25D366',
      margin: 10,
    },
    buttonText: {
      textAlign: 'center',
      padding: 20,
      color: 'white'
    },
    error: {
      color: 'red',
      textAlign: 'center',
      justifyContent: 'center',
      paddingTop: 10,
    }
  })