import React, {Component} from 'react';
import { View, Text, StyleSheet, Image, Modal } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

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
                            <Text style={styles.modalSongName}>{this.props.songName.split(".")[0]}</Text>
                        </View>

                        <View>
                            
                            <Text>{parseFloat(this.props.songDuration / 60).toFixed(2).split(".")[0]+':'+parseFloat(this.props.songDuration / 60).toFixed(2).split(".")[1]}</Text>
                            <Text>{this.props.songPath}</Text>
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