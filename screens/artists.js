import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function Artists() {
    return (
        <View style={styles.container}>
            <Text>Artists screen</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
    },
  });