import React, { Component } from 'react';
import { Container, Header, Content, Icon, Text, Left, Right, Body, Title, Button, Card, CardItem, Item, Input, List, ListItem } from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { Alert } from 'react-native'
import firebase from 'react-native-firebase'

export default class Search extends Component {
  constructor() {
    super()
    this.state = {
      nama:'',
      users:[]
    }
  }
  searchUsers() {
    if(this.state.nama) {
    let that = this
    firebase.database().ref('users').orderByChild('nama').startAt(this.state.nama).endAt(this.state.nama+'\uf8ff').on('value', function(dataUsers) {
      if(dataUsers.val()) {
        that.setState({users:dataUsers.val()})
      }
    })
    this.input._root.clear()
    }
  }

  addFriend(uid, nama) {
    let that = this

    firebase.auth().onAuthStateChanged((user) => {
      firebase.database().ref("friends").child(user.uid).child(uid).set({
        nama: nama,
        uid: uid
      }).then((data) => {
        this.props.navigation.navigate('Teman')
      }).catch((error) => {

      })
    })
  }

  render() {
    return (
      <Content>
        <Grid>
          <Row size={1}>
            <Col size={6}>
                <Item reguler>
                  <Input onChangeText={(nama) => this.setState({nama})} ref={(input) => { this.input = input }} placeholder='ketik nama'/>
                </Item>
              </Col>
              <Col size={1} style={{alignSelf:'center'}}>
                <Button transparent onPress={() => {this.searchUsers()}}><Icon name='search' /></Button>
              </Col>
            </Row>
            <Row size={1}>
              <Content>
                <Text style={{ padding:5, backgroundColor:'#ff0000', textAlign:'center' }}>Hasil Pencarian</Text>
              </Content>
            </Row>
            <Row size={8}>
              <List
                dataArray={this.state.users}
                renderRow={(user) =>
                  <ListItem style={{marginLeft:0}} onPress={() => this.addFriend(user.uid, user.nama)}>
                    <Text>{user.nama}</Text>
                  </ListItem>
              }/>
            </Row>

          </Grid>
      </Content> 
    )
  }
}