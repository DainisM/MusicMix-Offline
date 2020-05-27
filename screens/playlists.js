import React from 'react';
import { Dimensions, View, Text, StyleSheet, TouchableOpacity, AsyncStorage, FlatList, Image, Modal, TextInput } from 'react-native';

const { width: DEVICE_WIDTH, height: DEVICE_HEIGHT } = Dimensions.get('window');

export default class Playlists extends React.Component {
    constructor() {
        super()

        this.state= {
            allPlaylists: [],
            modalVisible: false,
            playlistName: '',
            newPlaylistError: '',
        }
    }

    async componentDidMount() {
        const Playlists = await AsyncStorage.getItem('playlists');

        if (Playlists != null) {
            await this.setState({allPlaylists: JSON.parse(Playlists)});
        }  
    }

    componentWillUnmount() {
        this.setState({allPlaylists: []});
    }

    createPlaylist = async () => {
        if (this.state.playlistName !== '') {
            const playlistsToSave = { 'name': this.state.playlistName}
            const existingProducts = await AsyncStorage.getItem('playlists')

            if (existingProducts !== null && existingProducts.includes(this.state.playlistName)) {
                this.setState({newPlaylistError: 'Name is already taken'})
            } else {

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
        } else {
            this.setState({newPlaylistError: 'Please enter a name for your playist'})
        }
        
    }

    render() {
        return (
            <View style={styles.container}>
    
                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.playlistButton} onPress={() => {this.setState({modalVisible: true})}}>
                        <Text style={styles.playlistBtnText}>Create playlist</Text>
                    </TouchableOpacity>
                </View>

                <FlatList
                    numColumns={2}
                    data={this.state.allPlaylists}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({item}) =>
                        <TouchableOpacity  key={Math.random()} style={styles.playlistContainer}>
                            <Image style={styles.playlistImage} source={require('../assets/music-icon.png')} />
                            <Text style={styles.playlistText}>{item.name}</Text>
                        </TouchableOpacity>

                    }
                /> 

                <Modal
                    style={styles.playlistModal}
                    animationType='slide'
                    visible={this.state.modalVisible}
                    transparent={true}
                >
                    <View style={styles.modalBackContainer}>
                        <View style={styles.modalContainer}>
                        
                        <View>
                            <Text>New playlist name:</Text>

                            <TextInput 
                                style={styles.playlistInput}
                                onChangeText={(text) => {this.setState({playlistName: text, newPlaylistError: ''})}}
                                // value={this.state.playlistName}
                            />

                            <Text style={styles.playlistErrorText}>{this.state.newPlaylistError}</Text>
                        </View>

                        <View style={styles.playlistButtonsContainer}>
                            <TouchableOpacity style={styles.buttonCancel} onPress={() => {this.setState({modalVisible: false})}}>
                                <Text style={styles.buttonText}>Cancel</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.buttonSave} onPress={this.createPlaylist}>
                                <Text  style={styles.buttonText}>Save playlist</Text>
                            </TouchableOpacity>
                        </View>
                            
                        </View>
                    </View>
                </Modal>

            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
    flex: 1,
      backgroundColor: '#ccfffd',
      alignItems: 'center',
    },
    buttonContainer: {
        padding: 30,
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
    },
    playlistContainer: {
        margin: '5%',
        alignItems: 'center',
        width: '40%',
        height: '80%',
    },
    playlistImage: {
        height: 100,
        width: 130,
    },
    playlistText: {
        fontWeight: 'bold',
        fontSize: 16,
    },
    modalBackContainer: {
        backgroundColor: '#000000aa',
        flex: 1, 
    },
    modalContainer: {
        alignSelf: 'center',
        marginVertical: '35%',
        backgroundColor: '#fff' ,
        minHeight: DEVICE_HEIGHT / 3.5,
        maxHeight: DEVICE_HEIGHT / 3.5,
        width: '70%',
        padding: 20, 
        borderRadius: 10,
        flex: 1, 
    },
    playlistButtonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    playlistInput: {
        marginVertical: '5%',
        borderWidth: 1,
    },
    buttonCancel: {
        padding: 10,
        backgroundColor: 'darkgrey',
        borderRadius: 10,
    },
    buttonSave: {
        padding: 10,
        backgroundColor: 'lightblue',
        borderRadius: 10,
    },
    buttonText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    playlistErrorText: {
        color: 'red',
        marginVertical: '5%',
    }
  });