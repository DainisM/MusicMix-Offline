import React, {Component} from 'react';
import { Dimensions, View, Text, StyleSheet, Image, Modal, TouchableHighlight } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import Slider from 'react-native-slider';

const { width: DEVICE_WIDTH, height: DEVICE_HEIGHT } = Dimensions.get('window');
const BACKGROUND_COLOR = '#ccfffd';
const DISABLED_OPACITY = 0.5;
const FONT_SIZE = 18;
const BUFFERING_STRING = '00:00';

export default class SongModal extends Component {
    constructor(props) {
        super(props);
    }

    render() {

        //Variable that is given props value
        let modalVisible = this.props.IsVisible;

        return (
            <View>
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

                            <MaterialIcons 
                                name="playlist-add"
                                size={34}
                                
                            />
                        </View>

                        
                        {/* View which holds image */}
                        <View>
                            <Image style={styles.modalImage} source={require('../assets/Music.png')}/>
                        </View>

                        {/* View which holds text with audio full name passed by props */}
                        <View style={styles.detailsContainer}>
					        <Text style={styles.text}>
						        {this.props.playbackInstanceName.split('.')[0]}
					        </Text>
				        </View>
				
                        {/* View that holds audio player time info and slider */}
                        <View
                            style={[
                                styles.playbackContainer,
                                {
                                    opacity: this.props.isLoading
                                        ? DISABLED_OPACITY
                                        : 1.0,
                                },
                            ]}
                        >
                            {/* Text that shows audio timestamp passed by props */}
                            <Text style={styles.timeStampText}>
                                {this.props.isBuffering ? (
                                    BUFFERING_STRING
                                    ) : (
                                    this.props.getTimestamp
                                )}
                            </Text>

                            {/* Slider which shows audio progress and can be used to
                                seek forward or backward in song by using props
                            */}
                            <Slider
                                style={styles.playbackSlider}
                                value={this.props.getSeekSliderPosition}
                                onValueChange={this.props.onSeekSliderValueChange}
                                onSlidingComplete={this.props.onSeekSliderSlidingComplete}
                                thumbTintColor="#000000"
                                minimumTrackTintColor="#4CCFF9"
                                disabled={this.props.isLoading}
                            />

                            {/* Text that shows full duration of song passed by props */}
                            <Text style={styles.timeStampText}>
                                {this.props.isBuffering ? (
                                    BUFFERING_STRING
                                ) : (
                                    this.props.getDuration
                                )}
                            </Text>
				        </View>

                        {/* View that holds audio player control buttons */}
                        <View
                            style={[
                                styles.buttonsContainerBase,
                                {
                                    opacity: this.props.isLoading
                                        ? DISABLED_OPACITY
                                        : 1.0,
                                },
                            ]}
                        >
                            {/* Previous song button that jumps back to previous song by using props */}
                            <TouchableHighlight
                                underlayColor={BACKGROUND_COLOR}
                                style={styles.wrapper}
                                onPress={this.props.onBackPressed}
                                disabled={this.props.isLoading}
                            >
                                <View>
                                    <MaterialIcons
                                        name="fast-rewind"
                                        size={40}
                                        color="darkcyan"
                                    />
                                </View>
					        </TouchableHighlight>
                            {/* Play/Pause button that toggles between playing and pausing song using props */}
                            <TouchableHighlight
                                underlayColor={BACKGROUND_COLOR}
                                style={styles.wrapper}
                                onPress={this.props.onPlayPausePressed}
                                disabled={this.props.isLoading}
                            >
                                <View>
                                    {this.props.isPlaying ? (
                                        <MaterialIcons
                                            name="pause"
                                            size={40}
                                            color="darkcyan"
                                        />
                                    ) : (
                                        <MaterialIcons
                                            name="play-arrow"
                                            size={40}
                                            color="darkcyan"
                                        />
                                    )}
                                </View>
                            </TouchableHighlight>
                            {/* Next button used to go to next song by using props */}
                            <TouchableHighlight
                                underlayColor={BACKGROUND_COLOR}
                                style={styles.wrapper}
                                onPress={this.props.onForwardPressed}
                                disabled={this.props.isLoading}
                            >
                                <View>
                                    <MaterialIcons
                                        name="fast-forward"
                                        size={40}
                                        color="darkcyan"
                                    />
                                </View>
                            </TouchableHighlight>
				        </View>

                    </View>
                </Modal>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
		justifyContent: 'space-between',
		alignItems: 'center',
		alignSelf: 'stretch',
        backgroundColor: BACKGROUND_COLOR,
        height: '100%'
    },
    modalControls: {
        justifyContent: 'space-between',
		alignSelf: 'stretch',
        flexDirection: 'row',
        margin: 20,
        maxHeight: '5%',
    },
    modalImage: {
        alignSelf: 'center',
        height: DEVICE_HEIGHT / 1.8,
        width: DEVICE_WIDTH / 1.2,
    },
    detailsContainer: {
		height: 40,
		marginTop: 40,
		alignItems: 'center',
	},
	playbackContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
		alignItems: 'center',
        alignSelf: 'stretch',
        height: 50,
	},
	playbackSlider: {
		alignSelf: 'stretch',
		margin: 10,
        width: DEVICE_WIDTH / 1.5,
        height: 30,
    },
    timeStampText: {
        margin: 10,
    },
	text: {
		fontSize: FONT_SIZE,
        minHeight: FONT_SIZE,
        fontWeight: 'bold',
	},
	buttonsContainerBase: {
		flexDirection: 'row',
		alignItems: 'center',
        justifyContent: 'space-between',
        minWidth: DEVICE_WIDTH / 2.0,
		maxWidth: DEVICE_WIDTH / 2.0,
        marginBottom: 30
	},
  });