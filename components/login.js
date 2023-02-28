import React, { Component, useState } from 'react';
import { Text, TextInput, View, Button, Alert, StyleSheet } from 'react-native';
import { TouchableOpacity } from 'react-native-web';
import * as EmailValidator from 'email-validator';

export default class loginApp extends Component {
  constructor(props){
    super(props);
    this.state = {email: "", password: "", error: ""}; //ADD SUBMITTED CHECK? FREEZE SCREEN THINGY
    this.login = this.login.bind(this);
  }

  // componentDidMount(){
    
  // }

  login(){
    if (!(this.state.email && this.state.password)){
      this.setState({error:"Please enter an email and a password."})
      return;
    }
    if (!EmailValidator.validate(this.state.email)){
      this.setState({error:"Please enter a valid email address."})
      return;
    }

    const PASSWORD_REGEX = new RegExp("^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$")
    if(!PASSWORD_REGEX.test(this.state.password)){
        this.setState({error: "Password isn't strong enough (One upper, one lower, one special, one number, at least 8 characters long)"})
        return;
    }
    console.log("Email: " + this.state.email + "\nPassword: " + this.state.password)
    console.log("Login successful")
  }
  

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.formContainer}>
          <View style={styles.email}>
            <TextInput 
            placeholder='Enter email'
            onChangeText={value=>{this.setState({email:value})}}
            />
          </View>

          <View style={styles.password}>
            <TextInput 
            placeholder='Enter password'
            secureTextEntry={true}
            onChangeText={value=>{this.setState({password:value})}}
            />
          </View>

          <View>
            <TouchableOpacity onPress={this.login}>
                <View style={styles.button}>
                    <Text style={styles.buttonText}>Login</Text>
                </View>
            </TouchableOpacity>
          </View>

          <View>
            <TouchableOpacity onPress={() => this.props.navigation.navigate('Signup')}>
                <View style={styles.button}>
                    <Text style={styles.buttonText}>No account? Sign up!</Text>
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
    padding: 10,
  }
})