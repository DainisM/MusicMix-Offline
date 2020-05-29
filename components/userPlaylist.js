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

    async componentDidUpdate() {
        const Playlists = await AsyncStorage.getItem(this.props.playlistModalName);

            if (Playlists != null) {
                await this.setState({allPlaylistSongs: JSON.parse(Playlists)});
            }

    }

    deletePlaylist = async () => {

        let filteredArray = this.props.allPlaylists.filter(item => item.name !== this.props.playlistModalName)

        await AsyncStorage.setItem('playlists', JSON.stringify(filteredArray))

        this.props.closeModal();

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
                            // Touchable item which toggles state and opens up modal
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
    songView: {
        flexDirection: 'row',
        height: 60,
		borderBottomWidth: 1,
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
        paddingLeft: 10,
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
  });