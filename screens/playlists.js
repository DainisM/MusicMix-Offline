import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function Playlists() {
    return (
        <View style={styles.container}>
            <Text>Playlists screen</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
    },
  });