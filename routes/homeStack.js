import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import HomeNavigation from '../components/homeNavigation';
import Tracks from '../screens/tracks';
import Playlists from '../screens/playlists';
import Artists from '../screens/artists';

const Stack = createStackNavigator();

export default function HomeStack() {
    return (
            <Stack.Navigator initialRouteName='Tracks' screenOptions={{headerLeft: null, headerTintColor: '#444', headerStyle: { backgroundColor: '#a6fff0', height: 50}}}>
                <Stack.Screen name="Tracks" component={Tracks} options={({navigation}) => { return ( { headerTitle: () => <HomeNavigation navigation={navigation}/>})}}/>
                <Stack.Screen name="Playlists" component={Playlists} options={({navigation}) => { return ( { headerTitle: () => <HomeNavigation navigation={navigation}/>})}}/>
                <Stack.Screen name="Artists" component={Artists} options={({navigation}) => { return ( { headerTitle: () => <HomeNavigation navigation={navigation}/>})}}/>
            </Stack.Navigator>
    )
}