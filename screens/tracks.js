import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import * as MediaLibrary from 'expo-media-library';
import * as Permissions from 'expo-permissions';

export default class Tracks extends React.Component {
    constructor() {
        super();

        this.state = {
            songs: []
        }
    }

    async componentDidMount() {
        const cameraPermission = await Permissions.askAsync(Permissions.CAMERA_ROLL);

        const media = await MediaLibrary.getAssetsAsync({
            mediaType: MediaLibrary.MediaType.audio,
        })
        this.setState({songs: media.assets});
        media.assets.map(m => {
            console.log(m);
        })
    }

    render() {
        return (
            <View style={styles.container}>
                <FlatList 
                    data={this.state.songs}
                    renderItem={({item}) => 
                        <View key={item.id}>
                            <Text>{item.filename}</Text>
                            <Text>{parseFloat(item.duration / 60).toFixed(2)}</Text>
                        </View>
                    }
                />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
    },
  });