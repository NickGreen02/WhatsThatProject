import React, { useState } from 'react';
import {
  Text, View, StyleSheet,
} from 'react-native';
import { Camera, CameraType } from 'expo-camera';
import { TouchableOpacity } from 'react-native-web';

export default function TakePhoto() {
  const [type, setType] = useState(CameraType.back);
  const [permission, requestPermission] = Camera.useCameraPermissions();

  function toggleCameraType() {
    setType((current) => (current === CameraType.back ? CameraType.front : CameraType.back));
    console.log('Camera: ', type);
  }

  function takePhoto() {
    // if (camera) {
    //   const options = {quality: 0.5, }
    // }
    console.log('Photo taken TEST');
  }

  if (!permission || !permission.granted) {
    return (<Text>No access to camera</Text>);
  } else {
    return (
      <View style={Styles.container}>
        <Camera type={type}>
          <View style={Styles.buttonContainer}>
            <TouchableOpacity style={Styles.button} onPress={toggleCameraType}>
              <Text style={Styles.text}>Flip Camera</Text>
            </TouchableOpacity>
          </View>
          <View style={Styles.buttonContainer}>
            <TouchableOpacity style={Styles.button} onPress={takePhoto}>
              <Text style={Styles.text}>Take Photo</Text>
            </TouchableOpacity>
          </View>
        </Camera>
      </View>
    );
  }
}

const Styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  buttonContainer: {
    alignSelf: 'flex-end',
    padding: 5,
    margin: 5,
    backgroundColor: '#25D366',
  },
  button: {
    width: '20vw',
    height: '100%',
  },
  text: {
    fontSize: 14,
    color: 'white',
  },
});
