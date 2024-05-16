import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Home from '../Home/Home';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import Text_to_Signs from '../Text_to_Signs/Text_to_Signs';
import Signs_to_Text from '../Signs_to_Text/Signs_to_Text';





const BottomTabs = () => {
    const Tab = createMaterialBottomTabNavigator();

    return (
      <Tab.Navigator
      initialRouteName="Home"
      
      inactiveColor="#000000"
      barStyle={{ backgroundColor: '#007AFF' }}
    >
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="home" color={color} size={26} />
          ),
        }}
      />
      <Tab.Screen
        name="Signs_to_Text"
        component={Signs_to_Text}
        options={{
          tabBarLabel: 'Signs_to_Text',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="comment" color={color} size={26} />
          ),
        }}
      />
      <Tab.Screen
        name="Text_to_Signs"
        component={Text_to_Signs}
        options={{
          tabBarLabel: 'Text_to_Signs',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="hand-okay" color={color} size={26} />
          ),
        }}
        
      />
     
      
    </Tab.Navigator>
      );
}


export default BottomTabs