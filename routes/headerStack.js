import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Search from '../screens/search';
import Settings from '../screens/settings';
import Home from '../screens/home';
import { NavigationContainer } from '@react-navigation/native';
import Header from '../components/header';

const Stack = createStackNavigator();

export default function HeaderStack() {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName='Home' screenOptions={{ headerTitleStyle: {fontSize: 30, fontWeight: '600'}, headerTintColor: '#444', headerStyle: { backgroundColor: '#a6fff0', height: 100}}}>
                <Stack.Screen name="Home" component={Home} options={({navigation}) => { return ( { headerTitle: () => <Header navigation={navigation}/>})}}/>
                <Stack.Screen name="Search" component={Search} options={{title: 'Search'}}/>
                <Stack.Screen name="Settings" component={Settings} options={{title: 'Settings'}}/>
            </Stack.Navigator>
        </NavigationContainer>
    )
}