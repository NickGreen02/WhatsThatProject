import React, { useState } from 'react';
import {
  Text, View, StyleSheet,
} from 'react-native';
import { Camera, CameraType } from 'expo-camera';
import { TouchableOpacity } from 'react-native-web';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

export default function TakePhoto() {
  const [type, setType] = useState(CameraType.back);
  const [permission, requestPermission] = Camera.useCameraPermissions();
  const [camera, setCamera] = useState(null);
  const navigation = useNavigation();

  function toggleCameraType() {
    setType((current) => (current === CameraType.back ? CameraType.front : CameraType.back));
    console.log('Camera: ', type);
  }

  async function takePhoto() {
    if (camera) {
      const options = { quality: 0.5, base64: true, onPictureSaved: (data) => sendToServer(data) };
      await camera.takePictureAsync(options);
    }
  }

  async function sendToServer(data) {
    console.log(data.uri);
    const user = await AsyncStorage.getItem('whatsthat_user_id');

    const res = await fetch(data.uri);
    const blob = await res.blob();

    return fetch(
      `http://localhost:3333/api/1.0.0/user/${user}/photo`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'image/png',
          'X-Authorization': await AsyncStorage.getItem('whatsthat_session_token'),
        },
        body: blob,
      },
    )
      .then((response) => {
        if (response.status === 200) {
          console.log('Picture added', response);
          navigation.navigate('YourProfile');
        } if (response.status === 401) {
          throw new Error('Unauthorised access');
        } if (response.status === 403) {
          throw new Error('Forbidden by server');
        } if (response.status === 404) {
          throw new Error('Not found');
        } if (response.status === 500) {
          throw new Error('Server error');
        } else {
          throw new Error('Something went wrong');
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  if (!permission || !permission.granted) {
    return (<Text>No access to camera</Text>);
  } else {
    return (
      <View style={styles.container}>
        <Camera type={type} ref={(ref) => setCamera(ref)}>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={toggleCameraType}>
              <Text style={styles.text}>Flip Camera</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={takePhoto}>
              <Text style={styles.text}>Take Photo</Text>
            </TouchableOpacity>
          </View>
        </Camera>
      </View>
    );
  }
}

const styles = StyleSheet.create({
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
