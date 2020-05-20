import React, {Component} from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

export default class Tracks extends Component {
    constructor(props) {
        super(props);

        this.state = {
        
        }
    }

    render() {

        let modalVisible = this.props.IsVisible;

        return (
            <View style={styles.container}>

                <Modal 
                    animationType= 'slide'
                    visible={modalVisible}
                >
                    <View>
                        <MaterialIcons 
                            name="reply"
                            size={34}
                            onPress={this.props.closeModal}
                        />
                        
                        <View>
                            <Text>Hello World!</Text>
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
  });