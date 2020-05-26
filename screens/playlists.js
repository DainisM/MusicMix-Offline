import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, AsyncStorage } from 'react-native';

export default class Playlists extends React.Component {

    async componentDidMount() {
        const allPlaylists = await AsyncStorage.getItem('playlists');

            console.log(allPlaylists);
    }

    createPlaylist = async () => {
        await AsyncStorage.setItem('playlists', 'PlaylistName')
            .then(() => {
                this.props.navigation.replace('Playlists');
            })
            .catch((e) => {
                console.log(e);
            })
    }

    render() {
        return (
            <View style={styles.container}>
    
                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.playlistButton} onPress={this.createPlaylist}>
                        <Text style={styles.playlistBtnText}>Create playlist</Text>
                    </TouchableOpacity>
                </View>
    
                <Text>Playlists screen</Text>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#ccfffd',
    },
    buttonContainer: {
        padding: 30,
        alignItems: 'flex-end'
    },
    playlistButton: {
        width: 140,
        borderRadius: 30,
        padding: 10,
        backgroundColor: 'darkcyan'
    },
    playlistBtnText: {
        fontSize: 18,
        fontWeight: 'bold'
    }
  });