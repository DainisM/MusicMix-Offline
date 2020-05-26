import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, AsyncStorage } from 'react-native';

export default class Playlists extends React.Component {
    constructor() {
        super()

        this.state= {
            allPlaylists: [],
        }
    }

    async componentDidMount() {
        const Playlists = await AsyncStorage.getItem('playlists');
        await this.setState({allPlaylists: JSON.parse(Playlists)});
    }

    createPlaylist = async () => {
        const playlistsToSave = { 'name': 'More Music'}
        const existingProducts = await AsyncStorage.getItem('playlists')

        let newPlaylists = JSON.parse(existingProducts);
        if( !newPlaylists ){
            newPlaylists = []
        }

        newPlaylists.push( playlistsToSave )

        await AsyncStorage.setItem('playlists', JSON.stringify(newPlaylists))
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

                <View>
                    {this.state.allPlaylists.map(item => {
                        return <Text>{item.name}</Text>
                    })}
                </View>

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