import React, { Component } from 'react';
import { Text, TextInput, View, StyleSheet } from 'react-native';
import { TouchableOpacity } from 'react-native-web';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default class CreateChatApp extends Component {  
  constructor(props){
    super(props);
    this.state = {name: "", error: "", submitted: false};
    this.createChat = this.createChat.bind(this);
  }

  componentDidMount(){
    this.unsubscribe = this.props.navigation.addListener('focus', () => {
      this.checkLoggedIn();
    })
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

  async createChat(){
    this.setState({submitted: true});

    //contact the API
    return fetch('http://localhost:3333/api/1.0.0/chat',
    {
      method: 'POST',
      headers: {'Content-Type': 'application/json', 'X-Authorization': await AsyncStorage.getItem('whatsthat_session_token')},
      body: JSON.stringify({
        name: this.state.name
      })
    })
    .then((response) => {
      if (response.status === 201){
        return response.json();
      }
      else if (response.status === 400){
        throw "Invalid request"
      }
      else if (response.status === 401){
        throw "Unauthorised"
      }
      else{
        throw "Something went wrong"
      }
    })
    .then((rJson) => {
      console.log(rJson)
      this.setState({"error": "New chat created"})
      this.setState({"submitted": false})
      this.props.navigation.navigate("Chats")
    })
    .catch((error) => {
      this.setState({"error": error})
      this.setState({"submitted": false})
    });
  }

  render(){
    return(
      <View style={styles.container}>
        <View style={styles.formContainer}>
          <View style={styles.inputContainer}>
            <TextInput style={styles.name}
            placeholder='Enter chat name'
            onChangeText={value=>{this.setState({name:value})}}
            />
          </View>
        <View>
            <TouchableOpacity onPress={() => this.createChat()}>
              <View style={styles.button}>
                <Text style={styles.buttonText}>Create new chat</Text>
              </View>
            </TouchableOpacity>
          </View>

          <>
              {this.state.error &&
                  <Text style={styles.error}>{this.state.error}</Text>
              }
          </>

        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container:{
    flex: 1,
    width: "100%",
    alignItems:"center",
    justifyContent:"center"
  },
  formContainer: {
    
  },
  inputContainer:{
    borderLeftWidth: 2,
    borderRightWidth: 2,
    borderTopWidth: 2,
    borderBottomWidth: 2,
    borderColor: "#25D366",
    borderRadius: 5,
  },
  name: {
    margin: 10,
    textAlign: "center",
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
    padding: 10,
  }
});
