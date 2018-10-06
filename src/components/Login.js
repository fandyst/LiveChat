import React, { Component } from 'react';
import { Container, Header, Tab, Tabs, TabHeading, Icon, Text, Left, Right, Body, Title, Button, Content } from 'native-base';
import { GoogleSignin, GoogleSigninButton, statusCodes } from 'react-native-google-signin'
import firebase from 'react-native-firebase'
import { StackActions, NavigationActions } from 'react-navigation'

export default class Login extends Component {
  static navigationOptions = {
    title: 'Live Chat',
    headerStyle: {
      backgroundColor: '#f4511e',
    },
    headerTintColor: '#fff',
    headerTitleStyle: {
      fontWeight: 'bold',
    },
  }
  constructor() {
    super()
    this.state = {
      loginProgress:false 
    }
  }

  componentDidMount() {
    this.isSignedIn()
  }

  loginGoogle = async() => {
      const { dispatch } = this.props.navigation
      try {
          await GoogleSignin.configure();
          await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true});
          const data = await GoogleSignin.signIn();
          const credential = firebase.auth.GoogleAuthProvider.credential(data.idToken, data.accessToken)
          const currentUser = await firebase.auth().signInAndRetrieveDataWithCredential(credential);
          console.info(currentUser.user._user)
          console.info(currentUser.user._user.displayName)
          firebase.database().ref("users").child(currentUser.user._user.uid).set({
            email: currentUser.user._user.email,
            nama: currentUser.user._user.displayName,
            uid: currentUser.user._user.uid
          })
          dispatch(mainAction)
      }catch(error) {
          console.log(error);
      }
      this.setState({loginProgress:true})
  }

  isSignedIn = async () => {
    const { dispatch } = this.props.navigation
    const isSignedIn = await GoogleSignin.isSignedIn()
    if(isSignedIn == true) {
      dispatch(mainAction)
    }
  } 

  render() {
    return (
      <GoogleSigninButton
        style={{ height: 50 }}
        size={GoogleSigninButton.Size.Wide}
        color={GoogleSigninButton.Color.Dark}
        onPress={this.loginGoogle.bind(this)}
        disabled={this.state.loginProgress} />
    )
  }
}

const mainAction = StackActions.reset({
    index:0,
    actions: [
    NavigationActions.navigate({routeName: 'Main'})]
})