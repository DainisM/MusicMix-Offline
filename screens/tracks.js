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
    }

    render() {
        return (
            <View style={styles.container}>
                <FlatList 
                    data={this.state.songs}
                    renderItem={({item}) => 
                        <View key={item.id} style={styles.songView}>
                            <View style={styles.songText}>
                                <Text style={{fontWeight: 'bold'}}>{item.filename.split(".")[0].split(" - ")[1]}</Text>
                                <Text>{item.filename.split(".")[0].split(" - ")[0]}</Text>
                            </View>
                            
                            <Text style={styles.songDuration}>{parseFloat(item.duration / 60).toFixed(2).split(".")[0]}:{parseFloat(item.duration / 60).toFixed(2).split(".")[1]}</Text>
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