import { createStackNavigator, createMaterialTopTabNavigator } from 'react-navigation'
import Login from './firestores/Login'
import Teman from './firestores/Teman'
import Chat from './firestores/Chat'
import Search from './firestores/Search'
import SingleChat from './firestores/SingleChat'

const TabNavigation = createMaterialTopTabNavigator({
    Teman: {screen: Teman},
    Chat: {screen: Chat},
    Search: {screen: Search}
}, {
  tabBarOptions : {
    style: {
      backgroundColor: '#ff5722',
    }
  }
})

export const Route = createStackNavigator({
    Login: {screen: Login},
    Main: {
            screen: TabNavigation,
            navigationOptions: {
            title: 'Live Chat',
            headerStyle: {
                backgroundColor: '#ff5722',
                elevation: 0,
                shadowOpacity: 0,
            },
            headerTintColor: '#ffffff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
            statusBarStyle: '#ff5722'}
        },
    SingleChat: {screen: SingleChat}
})

