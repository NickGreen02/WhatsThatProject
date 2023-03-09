import React, { Component } from 'react';
import { Text, TextInput, View, StyleSheet } from 'react-native';
import { TouchableOpacity } from 'react-native-web';
import * as EmailValidator from 'email-validator';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default class LoginApp extends Component {
  constructor(props){
    super(props);
    this.state = {email: "", password: "", error: "", submitted: false};
    this.login = this.login.bind(this);
  }

  //login function
  login(){
    this.setState({submitted: true});

    //validation for user data
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
        this.setState({error: "Invalid passwordgrlkwngwrgnwrgnhwroghwrwuwru."})
        return;
    }

    //contact the API
    return fetch('http://localhost:3333/api/1.0.0/login',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: this.state.email,
        password: this.state.password,
      })
    })
    .then((response) => {
      if (response.status === 200){
        return response.json();
      }
      else if (response.status === 400){
        throw "Invalid email or password supplied"
      }
      else{
        throw "Something went wrong"
      }
    })
    .then(async (rJson) => {
      console.log(rJson)
      try{
        await AsyncStorage.setItem("whatsthat_user_id", rJson.id)
        await AsyncStorage.setItem("whatsthat_session_token", rJson.token)

        this.setState({submitted: true})

        this.props.navigation.navigate("MainAppNav")
      }
      catch{
        throw "Something went wrong"
      }
    })
    .catch((error) => {
      console.error(error);
    });
  }   
  
  componentDidMount(){
    const reset = this.props.navigation.addListener('focus', () => {
      this.setState({email: "", password: "", error: "", submitted: false});
    });
    return reset;
  }

  //render the page
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

//stylesheet for the page
const styles = StyleSheet.create({
  container:{
    flex: 1,
    width: "100%",
    alignItems:"center",
    justifyContent:"center"
  },
  formContainer: {
    width: "70vw"
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