import React from 'react';
import { StyleSheet, Text, View, Image, TouchableWithoutFeedback } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

export default function Header({navigation}) {

    return (
        <View style={styles.header}>

                <TouchableWithoutFeedback onPress={() => navigation.navigate('Home')}>
                    <Image style={styles.headerImage} source={require('../assets/MusicMix_logo.png')}/>
                </TouchableWithoutFeedback>


                <View style={styles.headerButtonsView}>
                    <MaterialIcons
                        style={styles.headerButton} 
                        name='search'
                        size={36}
                        onPress={() => navigation.navigate('Search')}
                    />

                    <MaterialIcons
                        style={styles.headerButton}  
                        name='settings'
                        size={36}
                        onPress={() => navigation.navigate('Settings')}
                    />                

                </View>

            </View>
    );
}

const styles = StyleSheet.create({
    header: {
        height: '100%',
        width: '100%',
        flex: 1,
        flexDirection: 'row',
        height: 50,
        paddingTop: 0,
    },
    headerButton: {
        paddingHorizontal: 10,
        color: 'darkcyan',
    },
    headerButtonsView: {
        position: 'absolute',
        paddingTop: 20,
        right: 20,
        flexDirection: 'row',
    },
    headerImage: {
        height: 60,
    },
});