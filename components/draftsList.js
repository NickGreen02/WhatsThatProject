import React, { Component } from 'react';
import {
  View, StyleSheet, Text, ActivityIndicator,
} from 'react-native';
import { FlatList, TouchableOpacity } from 'react-native-web';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default class DraftsList extends Component {
  constructor(props) {
    super(props);
    this.state = { drafts: '', isLoading: false, errorstate: '' };
  }

  componentDidMount() {
    const { navigation } = this.props;
    this.unsubscribe = navigation.addListener('focus', () => {
      this.checkLoggedIn();
    });
    console.log('Data displayed');
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  // check if logged in, if not, send back to login screen
  checkLoggedIn = async () => {
    const { navigation } = this.props;
    const value = await AsyncStorage.getItem('whatsthat_session_token');
    if (value == null || value === '') {
      navigation.navigate('Login');
    }
  };

  manageData(drafts) {
    // let s = JSON.parse(drafts);
    console.log(drafts);

    // const newObj = [];

    // drafts.drafts.forEach((value) => newObj.push({ 'draft': value }));
    // console.log(newObj);
  }

  // render drafts list with send draft buttons
  render() {
    return (
      <Text>Drafts list testing</Text>
    );
  //   const { drafts, isLoading, errorstate } = this.state;
  //   if (isLoading) {
  //     return (
  //       <View style={styles.container}>
  //         <ActivityIndicator />
  //       </View>
  //     );
  //   } else {
  //     return (
  //       <View style={styles.container}>
  //         <View style={styles.formContainer}>
  //           <>
  //             {errorstate && <Text style={styles.error}>{errorstate}</Text>}
  //           </>
  //           <FlatList
  //             data={drafts}
  //             renderItem={({ item }) => (
  //               <View>
  //                 <Text style={styles.draftMessage}>{item}</Text>
  //                 <TouchableOpacity onPress={() => this.addMember(item.user_id, `${item.first_name} ${item.last_name}`)}>
  //                   <View style={styles.addMemberButton}>
  //                     <Text style={styles.buttonText}>Add User</Text>
  //                   </View>
  //                 </TouchableOpacity>
  //               </View>
  //             )}
  //             keyExtractor={(item) => item.user_id}
  //           />
  //         </View>
  //       </View>
  //     );
  //   }
  // }
  }
}

// stylesheet for the page
const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    alignItems: 'stretch',
    justifyContent: 'flex-start',
  },
  formContainer: {
    flex: 1,
  },
  error: {
    color: 'red',
    textAlign: 'center',
    justifyContent: 'center',
    paddingTop: 10,
  },
});
