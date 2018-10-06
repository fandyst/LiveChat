import React, { Component } from 'react';
import { Content, List, ListItem, Left, Thumbnail, Body, Right, Button, Text } from 'native-base';
import { Alert, FlatList } from 'react-native'
import firebase from 'react-native-firebase'

export default class TabChat extends Component {
    constructor() {
        super()
        this.state = {
            chats:[]
        }
        this.db = firebase.firestore().collection("lastmessages")
    }

    componentDidMount() {
        firebase.auth().onAuthStateChanged((user) => {
          this.db.doc(user.uid).collection("lastchats").onSnapshot((docChats) => {
            //console.log(docChats)
            
            const datachat = []
            docChats.forEach((doc) => {
              datachat.push({
                message: doc.data().message,
                uid: doc.data().uid,
                nama: doc.data().nama
              })
            })
            this.setState({chats:datachat})
            
          })
        })
    }

    render() {
        const { navigate } = this.props.navigation
        return (
          <Content>
                <FlatList
                    data={this.state.chats}
                    extraData={this.state}
                    renderItem={({item}) => 
                        <ListItem thumbnail onLongPress={() => Alert.alert('Hapus Simon Simanjuntak?','', [{text:'Tidak'}, {text: 'Ya'}])}>
                            <Left>
                                <Thumbnail square source={{ uri: item.photo }} />
                            </Left>
                            <Body>
                                <Text>{item.nama}</Text>
                                <Text note>{item.message}</Text>
                            </Body>
                            <Right>
                                <Button transparent>
                                    <Text onPress={() => navigate('SingleChat',  {uid:item.uid}) }>Lihat</Text>
                                </Button>
                            </Right>
                        </ListItem>
                } />
          </Content> 
        )
    }
}