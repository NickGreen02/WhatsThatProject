import React, { Component } from 'react';
import { Text, TextInput, View, StyleSheet } from 'react-native';
import { TouchableOpacity } from 'react-native-web';

export default class CreateChatApp extends Component {  
  constructor(props){
    super(props);
    this.state = {name: "", submitted: false};
    this.createChat = this.createChat.bind(this);
  }

  createChat(){
    this.setState({submitted: true});
    console.log("Chat '" + this.state.name + "' created.")  //insert API call into this function
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
            <TouchableOpacity onPress={this.createChat}>
              <View style={styles.button}>
                <Text style={styles.buttonText}>Create new chat</Text>
              </View>
            </TouchableOpacity>
          </View>
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
});
