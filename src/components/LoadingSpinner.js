import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { Colors } from '../constants/colors';

const LoadingSpinner = () => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={Colors.black} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
  },
});

export default LoadingSpinner;
