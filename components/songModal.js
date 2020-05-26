import React, {Component} from 'react';
import { Dimensions, View, Text, StyleSheet, Image, Modal, TouchableHighlight } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import Slider from 'react-native-slider';
import { Audio } from 'expo-av';

export default class Tracks extends Component {
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
                        <MaterialIcons 
                            name="reply"
                            size={34}
                            onPress={this.props.closeModal}
                        />
                        
                        <View>
                            <Image style={styles.modalImage} source={require('../assets/Music.png')}/>
                            <Text style={styles.modalSongName}>Song name</Text>
                        </View>

                        <View>
                            <Text>{this.props.songID}</Text>
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
    },
    modalImage: {
        paddingTop: 30,
        alignSelf: 'center',
        height: '70%',
        width: '70%',
    },
    modalSongName: {
        paddingTop: 20,
        alignSelf: 'center',
        fontSize: 26,
        height: 60
    }, 
  });