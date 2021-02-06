import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { Ionicons } from '@expo/vector-icons'


import {store, persistor} from './redux/store'
import { PersistGate } from 'redux-persist/integration/react'
import {Provider} from 'react-redux'

import RandomLocationScreen from './screens/RandomLocationScreen'
import LocationDetailsScreen from './screens/LocationDetailsScreen'
import PreferencesScreen from './screens/PreferencesScreen'
import SavedLocationsScreen from './screens/SavedLocationsScreen'

const HomeStack = createStackNavigator()

function HomeStackScreen() {
  return (
    <HomeStack.Navigator>
      <HomeStack.Screen name="Spin the globe!" component={RandomLocationScreen} />
      <HomeStack.Screen name="Location details" component={LocationDetailsScreen} />
      <HomeStack.Screen name="Preferences" component={PreferencesScreen} />
    </HomeStack.Navigator>
  );
}

const Tab = createBottomTabNavigator()

export default class App extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <NavigationContainer>
            <Tab.Navigator
              screenOptions={({route}) => ({
                tabBarIcon: ({ focused, color, size}) => {
                  let iconName
                  if (route.name === "Spin the globe!") {
                    iconName = "globe"
                  } else {
                    iconName = "folder"
                  }
                  return <Ionicons name={iconName} color={color} size={28}/>
                }
              })}
              tabBarOptions={{
                activeTintColor: 'forestgreen',
                inactiveTintColor: 'gray',
                labelStyle: {fontSize: 14},
              }}
            >
              <Tab.Screen name="Spin the globe!" component={HomeStackScreen} />
              <Tab.Screen name="Saved locations" component={SavedLocationsScreen} />
            </Tab.Navigator>
          </NavigationContainer>
        </PersistGate>
      </Provider>
    )
  }
}