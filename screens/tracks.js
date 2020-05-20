import React, {Component} from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Modal } from 'react-native';
import * as MediaLibrary from 'expo-media-library';
import * as Permissions from 'expo-permissions';

import SongModal from '../components/songModal';

export default class Tracks extends Component {
    constructor() {
        super();

        this.state = {
            songs: [],
            modalVisible: false,
            songID: "",
            songName: "",
            songDuration: null,
            songPath: "",
        }

        this.closeModal = this.closeModal.bind(this);
    }

    //Method which is fired up on this screen loading
    async componentDidMount() {
        //Asking permission to us method to find audio files
        const cameraPermission = await Permissions.askAsync(Permissions.CAMERA_ROLL);

        //If permissions is allowed then method gets all audio files from device
        const media = await MediaLibrary.getAssetsAsync({
            mediaType: MediaLibrary.MediaType.audio,
        })
        //Sets found audio files in state in array
        this.setState({songs: media.assets});
    }

    //Method used by child component to toggle state and close modal
    closeModal() {
        this.setState(state => ({
            modalVisible: !state.modalVisible
        }));
    }


    render() {

        return (
            <View style={styles.container}>

                {/* Calling component which holds modal */}
                <SongModal closeModal={this.closeModal} IsVisible={this.state.modalVisible} />

                {/* List with scrollbar that shows all audio files */}
                <FlatList 
                    data={this.state.songs}
                    renderItem={({item}) => 
                        // Touchable item which toggles state and opens up modal
                        <TouchableOpacity key={item.id} style={styles.songView} onPress={() => {this.setState({modalVisible: true})}}>
                            <View style={styles.songText}>
                                <Text style={{fontWeight: 'bold'}}>{item.filename.split(".")[0].split(" - ")[1]}</Text>
                                <Text>{item.filename.split(".")[0].split(" - ")[0]}</Text>
                            </View>
                            
                            <Text style={styles.songDuration}>{parseFloat(item.duration / 60).toFixed(2).split(".")[0]}:{parseFloat(item.duration / 60).toFixed(2).split(".")[1]}</Text>
                        </TouchableOpacity>
                    }
                />
            </View>
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
    
  });