import React, {Component} from 'react';
import { Dimensions, View, Text, StyleSheet, Modal, TouchableOpacity, FlatList, AsyncStorage } from 'react-native';

const { width: DEVICE_WIDTH, height: DEVICE_HEIGHT } = Dimensions.get('window');

export default class AddToPlaylist extends Component {
    constructor(props) {
        super(props);

        this.state = {
            allPlaylists: [],
            success: false,
            error: false,
            successMessage: 'Song added to playlist',
            errorMessage: 'Song already exists in playlist'
        }
    }

    //Method which finds all saved playlists on device and sets them in array in state
    async componentDidMount() {
        const Playlists = await AsyncStorage.getItem('playlists');

        if (Playlists != null) {
            await this.setState({allPlaylists: JSON.parse(Playlists)});
        }  
    }

    //Method used to save song to playlist
    saveToPlaylist = async (playlist) => {


        //Variable that holds current song metadata
        const songToSave = {'ID': this.props.songID, 'name': this.props.songName, 'path': this.props.songPath, 'duration': this.props.songDuration}
        //Get playlist that user wants to save song to
        const existingSongs = await AsyncStorage.getItem(playlist);

        //Check if playlist has songs in it
        let newSong = JSON.parse(existingSongs);

        //If playlist is empty make new empty array
        if (!newSong) {
            newSong = []
        }

        //Checks if there already is song with this ID
        if ( newSong !== [] && newSong.find(item => item.ID === this.props.songID)) {
            //If it exists then sets error state to true (to show error message)
            this.setState({error: true});

            //Timeout method to set error state back after 1 second
            setTimeout(() => {
                this.setState({error: false})
            }, 1000)
        } else {

            //Push new song into the playlist array
            newSong.push(songToSave);

            //Save updated array localy
            await AsyncStorage.setItem(playlist, JSON.stringify(newSong))
                .then(() => {
                    //Setting success state to true
                    this.setState({success: true})
                    //Setting success state back to false
                    setTimeout(() => {
                        this.setState({success: false})
                    }, 1000)
                })
                .catch((e) => alert('Something went wrong!'));
        }

    }

    render() {
        //Variable that is given props value
        let modalVisible = this.props.ModalVisible;

        return (
                <Modal
                    style={styles.playlistModal}
                    animationType='fade'
                    visible={modalVisible}
                    transparent={true}
                >
                    <View style={styles.modalBackContainer}>
                        <View style={styles.modalContainer}>
                        
                        <Text style={styles.modalText}>Add song to one of the playlists:</Text>
                        
                        {/* List that shows all user playlists and upon clicking on one
                            trigggers method which saves sog to clicked playlist    
                        */}
                        <View style={styles.playistListContainer}>
                            <FlatList
                                data={this.state.allPlaylists}
                                keyExtractor={(item, index) => index.toString()}
                                renderItem={({item}) =>
                                    <TouchableOpacity style={styles.playlistToAdd}  key={Math.random()} onPress={ () => this.saveToPlaylist(item.name)}>
                                        <Text>{item.name}</Text>
                                    </TouchableOpacity>
                                }
                            />
                        </View> 

                        {/* Text that will be shown when success in state is true */}
                        {this.state.success ? (
                            <Text style={styles.successText}>{this.state.successMessage}</Text>
                        ): (null)}

                        {/* Text that will show when error state is true */}
                        {this.state.error ? (
                            <Text style={styles.errorText}>{this.state.errorMessage}</Text>
                        ): (null)}
                        

                        {/* Button used to close modal */}
                        <View style={styles.ButtonsContainer}>
                            <TouchableOpacity style={styles.buttonCancel} onPress={this.props.closeModal}>
                                <Text style={styles.buttonText}>Close</Text>
                            </TouchableOpacity>
                        </View>
                            
                        </View>
                    </View>
                </Modal>
        )
    }
}

const styles = StyleSheet.create({
    container: {
		justifyContent: 'space-between',
		alignItems: 'center',
		alignSelf: 'stretch',
        backgroundColor: '#ccfffd',
        height: '100%'
    },
    modalText: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 30,
    },
    playistListContainer: {
        minHeight: '100%',
        maxHeight: '100%',
    },
    playlistToAdd: {
        paddingHorizontal: '5%',
        paddingVertical: '2.5%',
        margin: 2,
        backgroundColor: '#d4fffc',
    },
    modalBackContainer: {
        backgroundColor: '#000000aa',
        flex: 1, 
    },
    modalContainer: {
        alignSelf: 'center',
        marginVertical: '35%',
        backgroundColor: '#fff' ,
        width: '70%',
        padding: 20, 
        borderRadius: 10,
        flex: 1, 
    },
    ButtonsContainer: {
        marginTop: '10%',
        flexDirection: 'row',
        justifyContent: 'center',
    },
    playlistInput: {
        marginVertical: '5%',
        borderWidth: 1,
    },
    buttonCancel: {
        alignItems: 'center',
        width: 150,
        padding: 10,
        backgroundColor: 'darkgrey',
        borderRadius: 10,
    },
    buttonText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    successText: {
        color: 'green',
        alignSelf: 'center',
    },
    errorText: {
        color: 'red',
        alignSelf: 'center',
    }
  });