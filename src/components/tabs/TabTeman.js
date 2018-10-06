import React, { Component } from 'react';
import { Content, List, ListItem, Text } from 'native-base';

export default class TabTeman extends Component {
  render() {
    let temans = [
      'Simon Simanjuntak',
      'Nataniel Clyne',
      'Deja Loren',
      'Mama Sakho',
      'Emre Can'
    ]

    return (
      <Content>
          <List dataArray={temans} renderRow={(teman) =>
            <ListItem>
              <Text>{teman}</Text>
            </ListItem>
          }>
          </List>
      </Content> 
    )
  }
}