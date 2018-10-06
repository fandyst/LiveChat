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
      sender_name:'',
      messages: []
    }
    this.db = firebase.firestore()
    let messageId = "";
  }

  componentDidMount() {
    const { params } = this.props.navigation.state
    const { setParams } = this.props.navigation
    

    this.setState({receiver:params.uid})

    firebase.auth().onAuthStateChanged((user) => {
      this.setState({sender:user.uid})
    })

    this.db.collection("users").doc(params.uid).get().then((doc) => {
      setParams({ title: doc.data().nama })
    }).catch((error) => {
      console.log("Error: "+error)
    })

    firebase.auth().onAuthStateChanged((user) => {
      this.setState({sender:user.uid})
      this.setState({sender_name:user.displayName})
      if( user.uid < params.uid) {
        messageId=user.uid+params.uid
      }else {
        messageId=params.uid+user.uid
      }
    })

    this.db.collection("messages").doc(messageId).collection("chats").orderBy("timestamp", "asc").onSnapshot((docMessages) => {
      const datamsg = []
      docMessages.forEach((doc) => {
        datamsg.push({
          message: doc.data().message,
          timestamp: doc.data().timestamp,
          uid_sender: doc.data().uid_sender,
          uid_receiver: doc.data().uid_receiver
        })
      })
      this.setState({messages:datamsg})
    })
  }

  componentDidUpdate() {
    this.flatList.scrollToEnd()
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

  renderMessage = ({item}) => {
    if(item.uid_sender === this.state.sender) {
      return (
        <Card style={{width:Dimensions.get('window').width-100 }}>
          <CardItem style={{backgroundColor:'#F2F3F4'}}>
            <Body>
              <Text>{item.message}</Text>
            </Body>
          </CardItem>
          <Text note style={{textAlign:'right',backgroundColor:'#F2F3F4'}}>{ moment.unix(Math.floor(item.timestamp/1000)).format('HH:mm') }</Text>
        </Card>
      )
    }else if(item.uid_receiver === this.state.sender) {
      return (
      <Right>
        <Card style={{width:Dimensions.get('window').width-100,marginLeft:100 }}>
          <CardItem style={{backgroundColor:'#ffddc1'}}>
            <Body>
              <Text>{item.message}</Text>
            </Body>
          </CardItem>
          <Text note style={{textAlign:'right',backgroundColor:'#ffddc1'}}>{ moment.unix(Math.floor(item.timestamp/1000)).format('HH:mm') }</Text>
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
    const timestamp = firebase.firestore.FieldValue.serverTimestamp()
    
    this.db.collection("messages").doc(messageId).collection("chats").add({
      message: this.state.msgsend,
      uid_sender: this.state.sender,
      uid_receiver: this.state.receiver,
      timestamp: timestamp
    }).catch((error) => {
      console.log("Error Send Message : "+error)
    })

    
    this.db.collection("lastmessages").doc(this.state.receiver).collection("lastchats").doc(this.state.sender).set({
      uid:this.state.sender,
      nama:this.state.sender_name,
      message:this.state.msgsend
    })

    this.input._root.clear()
  }
  

  render() {
    return (
      <Container>
        <Grid>
          <Row size={9}>
            <FlatList
              ref={(ref) => { this.flatList = ref }}
              data={this.state.messages}
              extraData={this.state} //opsional
              renderItem={this.renderMessage.bind(this)}
              keyExtractor={(item, index) => index.toString()} />
            </Row>

            <Row size={1}>
              <Col size={6}>
                <Item reguler>
                  <Input onChangeText={(msgsend) => this.setState({msgsend})} ref={(input) => { this.input = input }} placeholder='ketik pesan disini'/>
                </Item>
              </Col>
              <Col size={1} style={{alignSelf:'center'}}>
                <Button transparent onPress={() => {this.sendMessage()}}><Icon name='send' style={{color:'#ff5722'}} /></Button>
              </Col>
            </Row>

          </Grid>
      </Container> 
    )
  }
}