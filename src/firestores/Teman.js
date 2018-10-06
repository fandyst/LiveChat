import React, { Component } from 'react';
import { Content, List, ListItem, Text } from 'native-base';
import { Alert, StatusBar, isAndroid } from 'react-native'
import firebase from 'react-native-firebase'

export default class TabTeman extends Component {
  constructor() {
    super()
    this.state = {
      datas:[]
    }
  }

  componentDidMount() {
    this._navListener = this.props.navigation.addListener('didFocus', () => {
      StatusBar.setBackgroundColor('#c41c00');
    })

    firebase.auth().onAuthStateChanged((user) => {
      firebase.firestore().collection("users").doc(user.uid).collection("friends").onSnapshot((docFriends) => {
        const datafr = []
        docFriends.forEach((doc) => {
          datafr.push({
            nama: doc.data().nama,
            uid: doc.data().uid
          })
        })
        this.setState({datas:datafr})
      })
    })
  }

  deleteFriend(uid) {
    firebase.auth().onAuthStateChanged((user) => {
      firebase.firestore().collection("users").doc(user.uid).collection("friends").doc(uid).delete().then((docRemove) => {
      }).catch((error) => {
        console.log("Error Hapus Teman: "+error)
      })
    })
  }

  render() {
    const { navigate } = this.props.navigation
    let temans = [
      'Simon Simanjuntak',
      'Nataniel Clyne',
      'Deja Loren',
      'Mama Sakho',
      'Emre Can'
    ]

    return (
      <Content>
          <List dataArray={this.state.datas} renderRow={(teman) =>
            <ListItem onPress={() => navigate('SingleChat',  {uid:teman.uid}) } onLongPress={() => Alert.alert('Hapus '+teman.nama+'?','', [{text:'Tidak'}, {text: 'Ya', onPress: () => this.deleteFriend(teman.uid) }])}>
              <Text>{teman.nama}</Text>
            </ListItem>
          }>
          </List>
      </Content> 
    )
  }
}