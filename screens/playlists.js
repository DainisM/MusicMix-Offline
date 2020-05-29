import React from 'react';
import { Dimensions, View, Text, StyleSheet, TouchableOpacity, AsyncStorage, FlatList, Image, Modal, TextInput } from 'react-native';
import UserPlaylist from '../components/userPlaylist';

const { width: DEVICE_WIDTH, height: DEVICE_HEIGHT } = Dimensions.get('window');

export default class Playlists extends React.Component {
    constructor() {
        super()

        this.state= {
            allPlaylists: [],
            addPlaylistModal: false,
            playlistModal: false,
            playlistModalName: '',
            playlistName: '',
            newPlaylistError: '',
        }
    }

    //Method that is executed when component renders which gets all playlists items in storage
    // and if received data is not null sets them in state array
    async componentDidMount() {
        const Playlists = await AsyncStorage.getItem('playlists');

        if (Playlists != null) {
            await this.setState({allPlaylists: JSON.parse(Playlists)});
        }  
    }

    //Sets state array back to empty when component unmounts
    componentWillUnmount() {
        this.setState({allPlaylists: []});
    }

    //Method used to create new playists
    createPlaylist = async () => {
        //First it checks user input and it cannot be empty
        if (this.state.playlistName !== '') {
            //Saves user input in variable
            const playlistsToSave = { 'name': this.state.playlistName}
            //Saves storage data in varable (playlists in storage)
            const existingProducts = await AsyncStorage.getItem('playlists')

            //If data erceived from storage is not null and it is the same as user input --->
            if (existingProducts !== null && existingProducts.includes(this.state.playlistName)) {
                // ---> state updates with this string which is shown in modal
                this.setState({newPlaylistError: 'Name is already taken'})
            } else {

                //If everything is ok then we parse starage data and set it into variable
                let newPlaylists = JSON.parse(existingProducts);
                //If storage data is empty then set it as new empty array
                if( !newPlaylists ){
                    newPlaylists = []
                }

                //Push new playlist name into the array
                newPlaylists.push( playlistsToSave )

                //Saving data in storage
                await AsyncStorage.setItem('playlists', JSON.stringify(newPlaylists))
                    .then(() => {
                        //Re-renderig screen to show changes
                        this.props.navigation.replace('Playlists');
                    })
                    .catch((e) => {
                        //If there is errorrs then log them
                        console.log(e);
                    })

            }
            //If user input empty, then sets state to this string which is shown in modal
        } else {
            this.setState({newPlaylistError: 'Please enter a name for your playist'})
        }
        
    }

    //Method used to open modal by updating state
    openPlaylist(playlistName) {
        this.setState({playlistModal : true, playlistModalName: playlistName})
    }

    //Method used to close modal by updating state
    closePlaylist = () => {
        this.setState({playlistModal: false, playlistModalName: ''});
        this.props.navigation.replace('Playlists');
    }

    render() {
        return (
            <View style={styles.container}>

                <UserPlaylist 
                    playlistModal={this.state.playlistModal}
                    playlistModalName={this.state.playlistModalName}
                    closeModal={this.closePlaylist}
                    allPlaylists={this.state.allPlaylists}
                />
    
                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.playlistButton} onPress={() => {this.setState({addPlaylistModal: true})}}>
                        <Text style={styles.playlistBtnText}>Create playlist</Text>
                    </TouchableOpacity>
                </View>

                <FlatList
                    numColumns={2}
                    data={this.state.allPlaylists}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({item}) =>
                        <TouchableOpacity  key={Math.random()} style={styles.playlistContainer} onPress={() => {this.openPlaylist(item.name)}}>
                            <Image style={styles.playlistImage} source={require('../assets/music-icon.png')} />
                            <Text style={styles.playlistText}>{item.name}</Text>
                        </TouchableOpacity>

                    }
                /> 

                <Modal
                    style={styles.playlistModal}
                    animationType='slide'
                    visible={this.state.addPlaylistModal}
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
                            <TouchableOpacity style={styles.buttonCancel} onPress={() => {this.setState({addPlaylistModal: false})}}>
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