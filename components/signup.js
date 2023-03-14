import React, { Component } from 'react';
import { Text, TextInput, View,StyleSheet } from 'react-native';
import { TouchableOpacity } from 'react-native-web';
import * as EmailValidator from 'email-validator';

export default class SignupApp extends Component {
    constructor(props){
      super(props);
      this.state = {firstname: "", surname: "", email: "", password: "", error: "", submitted: false};
      this.signup = this.signup.bind(this);
    }

    //signup function
    signup(){
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
            this.setState({error: "Password isn't strong enough (One upper, one lower, one special, one number, at least 8 characters long)"})
            return;
        }
        
        //contact the API
        return fetch('http://localhost:3333/api/1.0.0/user',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            first_name: this.state.firstname,
            last_name: this.state.surname,
            email: this.state.email,
            password: this.state.password,
          })
        })
        .then((response) => {
          if (response.status === 201){
            return response.json();
          }
          else if (response.status === 400){
            throw "Email already exists or password isn't strong enough."
          }
          else{
            throw "Something went wrong"
          }
        })
        .then((rJson) => {
          console.log(rJson)
          this.setState({"error": "User added successfully"})
          this.setState({"submitted": false})
          this.props.navigation.navigate("Login")
        })
        .catch((error) => {
          this.setState({"error": error})
          this.setState({"submitted": false})
        });
      }
    
    componentDidMount(){
      const reset = this.props.navigation.addListener('focus', () => {
        this.setState({firstname: "", surname: "", email: "", password: "", error: "", submitted: false});
      });
      return reset;
    }

    //render the page
    render(){
        return(
            <View style={styles.container}>
                <View style={styles.formContainer}>
                    <View style={styles.firstname}>
                        <TextInput 
                        placeholder='Enter first name'
                        onChangeText={value=>{this.setState({firstname:value})}}
                        value={this.state.firstname}
                        />
                    </View>

                    <View style={styles.surname}>
                        <TextInput 
                        placeholder='Enter surname'
                        onChangeText={value=>{this.setState({surname:value})}}
                        value={this.state.surname}
                        />
                    </View>

                    <View style={styles.email}>
                        <TextInput 
                        placeholder='Enter email'
                        onChangeText={value=>{this.setState({email:value})}}
                        value={this.state.email}
                        />
                    </View>

                    <View style={styles.password}>
                        <TextInput 
                        placeholder='Enter password'
                        secureTextEntry={true}
                        onChangeText={value=>{this.setState({password:value})}}
                        value={this.state.password}
                        />
                    </View>

                    <View>
                        <TouchableOpacity onPress={() => this.signup()}>
                            <View style={styles.button}>
                                <Text style={styles.buttonText}>Sign up</Text>
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
    firstname: {
        margin:10,
    },
    surname: {
        margin:10,
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