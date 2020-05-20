import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';

export default function HomeNavigation({navigation}) {

    return (
        <View style={styles.container}>

            <TouchableOpacity style={styles.navLink} onPress={() => navigation.replace('Playlists')}>
                <Text style={styles.navText}>Playlists</Text>
            </TouchableOpacity>

            
            <TouchableOpacity style={styles.navLink} onPress={() => navigation.replace('Tracks')}>
                <Text style={styles.navText}>Tracks</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.navLink} onPress={() => navigation.replace('Artists')}>
                <Text style={styles.navText}>Artists</Text>
            </TouchableOpacity>

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        height: '100%',
        width: '100%',
        flexDirection: 'row',
        backgroundColor: '#a3fffb',
    },
    navLink: {
        flex: 1,
        marginHorizontal: 20,
    },
    navText: {
        fontSize: 19,
        textAlign: 'center',
    }
});