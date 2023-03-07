import React, { Component } from 'react';
import { Text, TextInput, View, StyleSheet } from 'react-native';
import { FlatList, ScrollView, TouchableOpacity } from 'react-native-web';
//import ChatPreview component (make it!)

export default class ChatlistApp extends Component {
    constructor(props){
        super(props);
        this.state = {chats: {}};
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