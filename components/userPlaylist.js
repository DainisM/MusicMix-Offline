import React, {Component} from 'react';
import { Dimensions, View, Text, StyleSheet, Modal, TouchableOpacity, FlatList, AsyncStorage, Image } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Audio } from 'expo-av';

import SongModal from '../components/songModal';

const { width: DEVICE_WIDTH, height: DEVICE_HEIGHT } = Dimensions.get('window');
const LOADING_STRING = 'Loading...';

export default class AddToPlaylist extends Component {
    constructor(props) {
        super(props);

        this.index = 0;
		this.isSeeking = false;
		this.shouldPlayAtEndOfSeek = false;
		this.playbackInstance = null;
        this.state = {
            allPlaylistSongs: [],
            songID: "",
            modalVisible: false,
            playbackInstanceName: LOADING_STRING,
			playbackInstancePosition: null,
			playbackInstanceDuration: null,
			shouldPlay: false,
			isPlaying: false,
			isBuffering: false,
			isLoading: true,
			volume: 1.0,
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

        await AsyncStorage.removeItem(this.props.playlistModalName);
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

    //Method used to load an audio file
    async loadNewPlaybackInstance(playing) {
		if (this.playbackInstance != null) {
			await this.playbackInstance.unloadAsync();
			this.playbackInstance.setOnPlaybackStatusUpdate(null);
			this.playbackInstance = null;
		}

        //Finding the URI from playlist array using index
        const source = { uri: this.state.allPlaylistSongs[this.index].path };
		const initialStatus = {
			shouldPlay: playing,
			volume: this.state.volume,
		};

		const { sound, status } = await Audio.Sound.createAsync(
			source,
			initialStatus,
			this.onPlaybackStatusUpdate
		);
		this.playbackInstance = sound;

		this.updateScreenForLoading(false);
    }
    
    //Method used when making screen ready to play sound
    updateScreenForLoading(isLoading) {
		if (isLoading) {
			this.setState({
				isPlaying: false,
				playbackInstanceName: LOADING_STRING,
				playbackInstanceDuration: null,
				playbackInstancePosition: null,
				isLoading: true,
			});
		} else {
			this.setState({
				playbackInstanceName: this.state.allPlaylistSongs[this.index].name,
				isLoading: false,
			});
		}
	}

    //Method used to manipulate audio when it is playing
    onPlaybackStatusUpdate = status => {
		if (status.isLoaded) {
			this.setState({
				playbackInstancePosition: status.positionMillis,
				playbackInstanceDuration: status.durationMillis,
				shouldPlay: status.shouldPlay,
				isPlaying: status.isPlaying,
				isBuffering: status.isBuffering,
				volume: status.volume,
            });
            //When song finishes it jumps to next song in playlist array
			if (status.didJustFinish) {
				this.advanceIndex(true);
				this.updatePlaybackInstanceForIndex(true);
			}
		} else {
			if (status.error) {
				console.log(`FATAL PLAYER ERROR: ${status.error}`);
			}
		}
    };
    
    //Method to jump o next song using indexes in array
    advanceIndex(forward) {
		this.index =
			(this.index + (forward ? 1 : this.state.allPlaylistSongs.length - 1)) %
			this.state.allPlaylistSongs.length;
	}

    //Calling methods or updating screen data and loading new song in PlaybackInstance
    async updatePlaybackInstanceForIndex(playing) {
		this.updateScreenForLoading(true);

		this.loadNewPlaybackInstance(playing);
    }
    
    //Method used to toggle between playing song or pausing
    onPlayPausePressed = () => {
		if (this.playbackInstance != null) {
			if (this.state.isPlaying) {
				this.playbackInstance.pauseAsync();
			} else {
				this.playbackInstance.playAsync();
			}
		}
    };

    //Method used to go to next song in array
	onForwardPressed = () => {
		if (this.playbackInstance != null) {
			this.advanceIndex(true);
			this.updatePlaybackInstanceForIndex(this.state.shouldPlay);
		}
	};

    //Method used to go back to previous song in array
	onBackPressed = () => {
		if (this.playbackInstance != null) {
			this.advanceIndex(false);
			this.updatePlaybackInstanceForIndex(this.state.shouldPlay);
		}
	};

    //Method used to pause sound and find value on slider when using slider
	onSeekSliderValueChange = async value => {
		if (this.playbackInstance != null && !this.isSeeking) {
			this.isSeeking = true;
			this.shouldPlayAtEndOfSeek = this.state.shouldPlay;
			this.playbackInstance.pauseAsync();
		}
	};

    //Method used to start song from position(value) from slider
	onSeekSliderSlidingComplete = async value => {
		if (this.playbackInstance != null) {
			this.isSeeking = false;
			const seekPosition = value * this.state.playbackInstanceDuration;
			if (this.shouldPlayAtEndOfSeek) {
				this.playbackInstance.playFromPositionAsync(seekPosition);
			} else {
				this.playbackInstance.setPositionAsync(seekPosition);
			}
		}
	};

    //Method used to find adn set slider positino
	getSeekSliderPosition() {
		if (
			this.playbackInstance != null &&
			this.state.playbackInstancePosition != null &&
			this.state.playbackInstanceDuration != null
		) {
			return (
				this.state.playbackInstancePosition /
				this.state.playbackInstanceDuration
			);
		}
		return 0;
    }
    
    //Method used to get milliseconds of audio file and show then as minutes:seconds
    getMMSSFromMillis(millis) {
		const totalSeconds = millis / 1000;
		const seconds = Math.floor(totalSeconds % 60);
		const minutes = Math.floor(totalSeconds / 60);

		const padWithZero = number => {
			const string = number.toString();
			if (number < 10) {
				return '0' + string;
			}
			return string;
		};
		return padWithZero(minutes) + ':' + padWithZero(seconds);
	}

    //Method used to show sound current play time
	getTimestamp() {
		if (
			this.playbackInstance != null &&
			this.state.playbackInstancePosition != null &&
			this.state.playbackInstanceDuration != null
		) {
			return `${this.getMMSSFromMillis(
				this.state.playbackInstancePosition
			)}`;
		}
		return '';
    }
  
    //Method used to get audio full duration 
    getDuration() {
    if (
			this.playbackInstance != null &&
			this.state.playbackInstancePosition != null &&
			this.state.playbackInstanceDuration != null
		) {
			return `${this.getMMSSFromMillis(
				this.state.playbackInstanceDuration
			)}`;
		}
		return '';
    }

    //Method used by child component to toggle state and close modal
    closeModal = () => {
        this.setState(state => ({
            modalVisible: !state.modalVisible,
        }));
        this.index = 0;
    }

    //Metho used to open modal, update state with song info by the ID which song was clikked
    openModal = (songID) => {

        this.loadNewPlaybackInstance(false)
        
        this.setState({modalVisible: true})

        for (const item of this.state.allPlaylistSongs) {
            if (item.ID === songID) {

                this.index = this.state.allPlaylistSongs.findIndex(songs => songs.ID === songID);

                this.setState({songID: item.ID})
            }
        }
    }

    render() {
        //Variable that is given props value
        let modalVisible = this.props.playlistModal;

        return (
            <Modal
            
            animationType= 'slide'
            visible={modalVisible}
            >

                {/* Calling component which holds modal and passing props */}
                <SongModal closeModal={this.closeModal} 
                    IsVisible={this.state.modalVisible} 
                    songs={this.state.allPlaylistSongs}
					// songID={this.state.songID}
					// source={this.state.source}
                    playbackInstanceName={this.state.playbackInstanceName}
                    isLoading={this.state.isLoading}
                    isBuffering={this.state.isBuffering}
                    isPlaying={this.state.isPlaying}
                    getTimestamp={this.getTimestamp()}
                    getSeekSliderPosition={this.getSeekSliderPosition()}
                    onSeekSliderValueChange={this.onSeekSliderValueChange}
                    onSeekSliderSlidingComplete={this.onSeekSliderSlidingComplete}
                    getDuration={this.getDuration()}
                    onBackPressed={this.onBackPressed}
                    onPlayPausePressed={this.onPlayPausePressed}
                    onForwardPressed={this.onForwardPressed}
                    fromPlaylist={true}
                />

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
                                onPress={() => {this.openModal(item.ID)}}
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