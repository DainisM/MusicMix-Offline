import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function Tracks() {
    return (
        <View style={styles.container}>
            <Text>Tracks screen</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
    },
  });