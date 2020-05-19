import React from 'react';
import { View, Text, StyleSheet, Image, TouchableWithoutFeedback } from 'react-native';
import HomeStack from '../routes/homeStack';

export default function Home({navigation}) {
    return (
        <View style={styles.container}>
            <HomeStack />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
    },
  });