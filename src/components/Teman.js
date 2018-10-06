import React, { Component } from 'react';
import { Content, List, ListItem, Text } from 'native-base';
import { Alert } from 'react-native'
import firebase from 'react-native-firebase'

export default class TabTeman extends Component {
  constructor() {
    super()
    this.state = {
      datas:[]
    }
  }

  componentDidMount() {
    let that = this
    firebase.auth().onAuthStateChanged((user) => {
      firebase.database().ref("friends").child(user.uid).on('value', function(dataFriends) {
        if(dataFriends.val()) {
          that.setState({datas:dataFriends.val()})
        }
      })
    })
  }

  deleteFriend(uid) {
    firebase.auth().onAuthStateChanged((user) => {
      firebase.database().ref("friends").child(user.uid).child(uid).remove()
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