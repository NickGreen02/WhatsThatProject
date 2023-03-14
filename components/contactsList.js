import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import { FlatList } from 'react-native-web';
import AsyncStorage from '@react-native-async-storage/async-storage';

import Contact from './contact';

export default class ContactListApp extends Component {
    constructor(props){
        super(props);
        this.state = {chats: {}};
    }

    componentDidMount(){
      this.unsubscribe = this.props.navigation.addListener('focus', () => {
        this.checkLoggedIn();
      })
      this.refreshChats = this.props.navigation.addListener('focus', () =>{
        this.getData();
      })
      console.log("Data displayed")
    }

    componentWillUnmount(){
      this.unsubscribe();
      this.refreshChats
    }

    checkLoggedIn = async () => {
      const value = await AsyncStorage.getItem('whatsthat_session_token')
      if(value == null){
        this.props.navigation.navigate('Login')
      }
    }

    async getData(){
      return fetch('http://localhost:3333/api/1.0.0/contacts',
      {
        method: 'GET',
        headers: {'X-Authorization': await AsyncStorage.getItem('whatsthat_session_token')}
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
        this.setState({contacts: rJson})
      })
      .catch((error) => {
        console.log(error);
      });
    }

    async logout(){
      console.log("Logout")

      return fetch('http://localhost:3333/api/1.0.0/logout',
        {
          method: 'POST',
          headers: {'X-Authorization': await AsyncStorage.getItem('whatsthat_session_token')},
        })
        .then(async (response) =>  {
          if(response.status === 200){
            await AsyncStorage.removeItem("whatsthat_session_token")
            await AsyncStorage.removeItem("whatsthat_user_id")
            this.props.navigation.navigate("Login")
          }
          else if(response.status === 401){
            console.log("Unauthorized")
            await AsyncStorage.removeItem("whatsthat_session_token")
            await AsyncStorage.removeItem("whatsthat_user_id")
            this.props.navigation.navigate("Login")
          }
          else{
            throw "Something went wrong"
          }
        })
        .catch((error) => {
          this.setState({"error": error})
          this.setState({"submitted": false})
        })
    }

    render(){
        return(
            <View style={styles.container}>
                <View style={styles.formContainer}>
                    <FlatList
                      data={this.state.contacts}
                      renderItem={({item}) => <Contact firstname={item.first_name} surname={item.last_name}/>}
                      keyExtractor={item => item.user_id}
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
      alignItems:"stretchc",
      justifyContent:"flex-start"
    },
    formContainer: {
      
    },
    error: {
      color: 'red',
      textAlign: 'center',
      justifyContent: 'center',
      paddingTop: 10,
    }
  })