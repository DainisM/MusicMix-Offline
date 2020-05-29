import React, {Component} from 'react';
import { Dimensions, View, Text, StyleSheet, Modal, TouchableOpacity, FlatList, AsyncStorage, Image } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const { width: DEVICE_WIDTH, height: DEVICE_HEIGHT } = Dimensions.get('window');

export default class AddToPlaylist extends Component {
    constructor(props) {
        super(props);

        this.state = {
            allPlaylistSongs: []
        }
    }

    // //Showing all songs for the playlist
    async componentDidUpdate(prevProps) {
        //Updating modal if props value changes
        if (prevProps.playlistModalName !== this.props.playlistModalName) {
            const Playlists = await AsyncStorage.getItem(this.props.playlistModalName);

            if (Playlists != null) {
                await this.setState({allPlaylistSongs: JSON.parse(Playlists)});
            }
        }
    }

    //Method used to delete playlist
    deletePlaylist = async () => {
        //Filtering out array by playlist name and save new array in variable (without given playlist)
        let filteredArray = this.props.allPlaylists.filter(item => item.name !== this.props.playlistModalName)
        //Savig new array instead of old
        await AsyncStorage.setItem('playlists', JSON.stringify(filteredArray))
        //Closing Modal
        this.props.closeModal();
    }

    //Method used to remove 1 song from playlist
    removeSong = async (ID) => {
        //Filtering out song from array by song ID
        let removedSong = this.state.allPlaylistSongs.filter(item => item.ID !== ID)
        //Saving new array (without the song) in storage
        await AsyncStorage.setItem(this.props.playlistModalName, JSON.stringify(removedSong))
        //Updating state
        this.setState({allPlaylistSongs: removedSong})
    }

    render() {
        //Variable that is given props value
        let modalVisible = this.props.playlistModal;

        return (
            <Modal
            
            animationType= 'slide'
            visible={modalVisible}
            >
                <View style={styles.container}>
                    <View style={styles.modalControls}>
                        {/* Back icon to close modal onPress */}
                        <MaterialIcons 
                            name="reply"
                            size={34}
                            onPress={this.props.closeModal}
                        />

                        <View style={{flexDirection: 'row'}}>
                            <Text style={styles.playlistName}>{this.props.playlistModalName}</Text>

                            {/* Icon used to delete playlist on click */}
                            <MaterialIcons 
                            onPress={this.deletePlaylist}
                            name="delete"
                            size={28}
                        />
                        </View>
                        
                    </View>


                    {/* List that shows all audio files */}
                    <FlatList
                        data={this.state.allPlaylistSongs}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={({item}) =>
                            <View style={styles.songContainer}>
                                {/* Touchable item which toggles state and opens up modal */}
                                <TouchableOpacity style={styles.songView} key={item.index}
                                // onPress={() => {this.openModal(item.id)}}
                                >
                                    <Image style={styles.tracksImages} source={require('../assets/audio_icon.png')} />

                                    <View style={styles.songText}>
                                        <Text style={{fontWeight: 'bold'}}>{item.name.split(".")[0].split(" - ")[1]}</Text>
                                        <Text>{item.name.split(".")[0].split(" - ")[0]}</Text>
                                    </View>
                                    
                                    <Text style={styles.songDuration}>{item.duration}</Text>

                                    
                                </TouchableOpacity>
                                {/* Icon used to remove song from playlist on click */}
                                <MaterialIcons 
                                        style={styles.removeSong}
                                        onPress={ () => this.removeSong(item.ID)}
                                        name='clear'
                                        size={24}
                                    />
                                
                            </View>
                        }
                    />
                </View>	
            </Modal>
        )
    }
}

const styles = StyleSheet.create({
    container: {
		flex: 1,
        backgroundColor: '#ccfffd',
    },
    songContainer: {
        flexDirection: 'row',
        height: 60,
		borderBottomWidth: 1,
    },
    songView: {
        flexDirection: 'row',
        width: '90%',
    },
    songText: {
        height: 50,
        flex: 6,
        alignSelf: 'flex-start',
        paddingVertical: 10,
        paddingLeft: 10,
    },
    songDuration: {
        height: 50,
        flex: 1,
        alignSelf: 'flex-end',
        paddingVertical: 15,
        paddingLeft: 20,
        marginRight: 20,
    },
    tracksImages: {
        height: 50,
        width: 50,
        margin: 5,
    },
    modalControls: {
        paddingVertical: 15,
        flexDirection: 'row',
        height: '10%',
        backgroundColor: '#a3fffb',
        justifyContent: 'space-between',
        elevation: 5,
    },
    playlistName: {
        fontSize: 20,
        marginHorizontal: 20,
    },
    removeSong: {
        width: '10%',
        marginVertical: '5%',
    }
  });