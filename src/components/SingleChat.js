import React, { Component } from 'react';
import { Container, Header, Content, Icon, Text, Left, Right, Body, Title, Button, Card, CardItem, Item, Input, List, ListItem } from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { Dimensions, FlatList } from 'react-native'
import firebase from 'react-native-firebase'
import moment from 'moment'

export default class SingleChat extends Component {
  constructor() {
    super()
    this.state = {
      sender:'',
      receiver:'',
      msgsend:'',
      user: [],
      messages: []
    }
  }

  componentDidMount() {
    const { params } = this.props.navigation.state
    const { setParams } = this.props.navigation

    this.setState({receiver:params.uid})

    let that = this
    firebase.auth().onAuthStateChanged((user) => {
      firebase.database().ref("users").child(params.uid).on('value', function(dataUser) {
        that.setState({user:dataUser.val()})
        that.setState({sender:user.uid})
        setParams({ title: dataUser.val().nama })
        console.log(dataUser.val())
      })


      firebase.database().ref('messages').child(user.uid).child(params.uid).on('value', function(dataMessages) {
        if(dataMessages.val()) {
          that.setState({messages:dataMessages.val()})
        }
      })

    })
  }

  static navigationOptions = ({ navigation }) => ({
    title: navigation.state.params.title,
    headerStyle: {
      backgroundColor: '#f4511e',
    },
    headerTintColor: '#fff',
    headerTitleStyle: {
      fontWeight: 'bold',
    },
  })

  renderMessage = (msg) => {
    if(msg.sender === this.state.sender) {
      return (
        <Card style={{width:Dimensions.get('window').width-100, transform: [{scaleY: -1}] }}>
          <CardItem style={{backgroundColor:'#F2F3F4'}}>
            <Body>
              <Text>{msg.message}</Text>
            </Body>
          </CardItem>
          <Text note style={{textAlign:'right',backgroundColor:'#F2F3F4'}}>{ moment.unix(Math.floor(msg.timestamp/1000)).format('HH:mm') }</Text>
        </Card>
      )
    }else if(msg.sender === this.state.receiver) {
      return (
      <Right>
        <Card style={{width:Dimensions.get('window').width-100,marginLeft:100, transform: [{scaleY: -1}] }}>
          <CardItem style={{backgroundColor:'#D5F5E3'}}>
            <Body>
              <Text>{msg.message}</Text>
            </Body>
          </CardItem>
          <Text note style={{textAlign:'right',backgroundColor:'#D5F5E3'}}>{ moment.unix(Math.floor(msg.timestamp/1000)).format('HH:mm') }</Text>
        </Card>
      </Right>
      )
    }else {
      return (
        <Text>Nothing message!</Text>
      )
    }
  }

  sendMessage() {
    let sendFrom = firebase.database().ref("messages").child(this.state.sender).child(this.state.receiver).push()
    let sendTo = firebase.database().ref("messages").child(this.state.receiver).child(this.state.sender).push()
    sendFrom.set({
      message: this.state.msgsend,
      sender: this.state.sender,
      timestamp: firebase.database.ServerValue.TIMESTAMP
    })

    sendTo.set({
      message: this.state.msgsend,
      sender: this.state.sender,
      timestamp: firebase.database.ServerValue.TIMESTAMP
    })

    this.input._root.clear()
  }

  render() {
    return (
      <Container>
        <Grid>

          <Row size={9}>
            <Content>
            <List
              dataArray={this.state.messages}
              renderRow={this.renderMessage.bind(this)}
              style={{ transform: [{scaleY: -1}] }} />
            </Content>
            </Row>

            <Row size={1}>
              <Col size={6}>
                <Item reguler>
                  <Input onChangeText={(msgsend) => this.setState({msgsend})} ref={(input) => { this.input = input }} placeholder='ketik pesan disini'/>
                </Item>
              </Col>
              <Col size={1} style={{alignSelf:'center'}}>
                <Button transparent onPress={() => {this.sendMessage()}}><Icon name='send' /></Button>
              </Col>
            </Row>

          </Grid>
      </Container> 
    )
  }
}