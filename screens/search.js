import React from 'react';
import { Dimensions, View, Text, StyleSheet, TextInput, FlatList, TouchableOpacity, Image } from 'react-native';
import * as MediaLibrary from 'expo-media-library';
import { Audio } from 'expo-av';

import SongModal from '../components/songModal';

const LOADING_STRING = 'Loading...';
const { width: DEVICE_WIDTH, height: DEVICE_HEIGHT } = Dimensions.get('window');

export default class Search extends React.Component {
    constructor(props) {
        super(props)

        this.index = 0;
		this.isSeeking = false;
		this.shouldPlayAtEndOfSeek = false;
		this.playbackInstance = null;
        this.state = {
            search: '',
            allSongs: [],
            searchSongs: [],
            searchSongError: false,
            modalVisible: false,
			songID: "",
			source: '',
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

    async componentDidMount() {
        //If permissions is allowed then method gets all audio files from device
        const media = await MediaLibrary.getAssetsAsync({
            mediaType: MediaLibrary.MediaType.audio,
        })
        //Sets found audio files in state in array
        await this.setState({allSongs: media.assets});

        //Starting audio mode using Expo.Audio
        Audio.setAudioModeAsync({
			allowsRecordingIOS: false,
			interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
			playsInSilentModeIOS: true,
			shouldDuckAndroid: true,
			interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
        });
    }

    componentWillUnmount() {
        this.setState({allSongs: [], searchSongs: [], search: ''})
    }

    //Method used to search for song by user input
    searchForSong(songSearch) {
        //Found songs is set into this variable
        let foundSongs = this.state.allSongs.filter(song => song.filename.split('.')[0].toLowerCase().match(new RegExp(`${songSearch.toLowerCase()}`)))
        
        //If foundSongs array is longer that 0 (there is songs)
        if(foundSongs.length > 0) {
            //Set state array with found songs and songError to false
            this.setState({searchSongs: foundSongs, searchSongError: false});

        } else {
            //If there is no songs in foundSongs variable set state array to empty and error to true
            this.setState({searchSongs: [], searchSongError: true})
        }

    }

    //Method used to load an audio file
    async loadNewPlaybackInstance(playing) {
		if (this.playbackInstance != null) {
			await this.playbackInstance.unloadAsync();
			this.playbackInstance.setOnPlaybackStatusUpdate(null);
			this.playbackInstance = null;
		}

        //Finding the URI from playlist array using index
        const source = { uri: this.state.searchSongs[this.index].uri };
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

		this.setState({source: this.state.searchSongs[this.index].uri});
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
				playbackInstanceName: this.state.searchSongs[this.index].filename,
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
			(this.index + (forward ? 1 : this.state.searchSongs.length - 1)) %
			this.state.searchSongs.length;
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

        for (const item of this.state.searchSongs) {
            if (item.id === songID) {

                this.index = this.state.searchSongs.findIndex(songs => songs.id === songID);

                this.setState({songID: item.id})
            }
        }
    }

    render() {
        return (
            <View style={styles.container}>

                {/* Calling component which holds modal and passing props */}
                <SongModal closeModal={this.closeModal} 
                    IsVisible={this.state.modalVisible} 
                    songs={this.state.searchSongs}
					songID={this.state.songID}
					source={this.state.source}
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
                />

                <View style={styles.searchContainer}>
                    <TextInput
                        style={styles.searchInput} 
                        placeholder='Search for song...'
                        onSubmitEditing={(event) => this.searchForSong(event.nativeEvent.text)}
                    />
                </View>

                <View>
                    {/* If state error is true then show only this text */}
                    {this.state.searchSongError ? (
                        <Text>No songs found</Text>
                    ): (
                        //If state error is false then show this View with Flatlist that holds and show
                        // a list of all found songs
                        <View style={styles.foundSongsContainer}>
                        {/* List with scrollbar that shows all audio files */}
                        <FlatList
                        data={this.state.searchSongs}
                        renderItem={({item}) => 
                            // Touchable item which toggles state and opens up modal
                            <TouchableOpacity key={item.id} style={styles.songView} onPress={() => {this.openModal(item.id)}}>
                                <Image style={styles.tracksImages} source={require('../assets/audio_icon.png')} />

                                <View style={styles.songText}>
                                    <Text style={{fontWeight: 'bold'}}>{item.filename.split(".")[0].split(" - ")[1]}</Text>
                                    <Text>{item.filename.split(".")[0].split(" - ")[0]}</Text>
                                </View>
                                
                                <Text style={styles.songDuration}>{Math.floor(item.duration / 60)}:{Math.floor(item.duration % 60)}</Text>
                            </TouchableOpacity>
                        }
                    />
                    </View>
                    )}

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
    searchContainer: {
        height: 80,
    },
    searchInput: {
        height: 40,
        marginVertical: 20,
        marginHorizontal: 20,
        paddingVertical: 5,
        paddingLeft: 10,
        borderWidth: 1,
        borderRadius: 20,
        backgroundColor: 'lightcyan',
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
    foundSongsContainer: {
        height: DEVICE_HEIGHT - 180,
    }, 
  });