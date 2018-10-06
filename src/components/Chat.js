import React, { Component } from 'react';
import { Content, List, ListItem, Left, Thumbnail, Body, Right, Button, Text } from 'native-base';
import { Alert } from 'react-native'

export default class TabChat extends Component {
  render() {
    const { navigate } = this.props.navigation
    return (
      <Content>
          <List>
            <ListItem thumbnail onLongPress={() => Alert.alert('Hapus Simon Simanjuntak?','', [{text:'Tidak'}, {text: 'Ya'}])}>
                <Left>
                    <Thumbnail square source={{ uri: 'https://firebasestorage.googleapis.com/v0/b/batikelfana.appspot.com/o/products%2Fbe917.jpg?alt=media&token=c3357bbe-0107-469d-bf66-b368c5437db9 '}} />
                </Left>
                <Body>
                    <Text>Simon Simanjuntak</Text>
                    <Text note numberOfLines={1}>Lagi dudukan aja bang</Text>
                </Body>
                <Right>
                    <Button transparent>
                        <Text onPress={() => navigate('SingleChat') }>Lihat</Text>
                    </Button>
                </Right>
            </ListItem>


            <ListItem thumbnail>
                <Left>
                    <Thumbnail square source={{ uri: 'https://firebasestorage.googleapis.com/v0/b/batikelfana.appspot.com/o/products%2Fbe912.jpg?alt=media&token=dbdb0f2c-d5aa-4ab3-8e88-430de1f5ef10'}} />
                </Left>
                <Body>
                    <Text>Nataniel Clyne</Text>
                    <Text note numberOfLines={1}>Kapan-kapan aja ya bro</Text>
                </Body>
                <Right>
                    <Button transparent>
                        <Text>Lihat</Text>
                    </Button>
                </Right>
            </ListItem>
          </List>
      </Content> 
    )
  }
}