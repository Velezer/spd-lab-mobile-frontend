import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/colors';

const EmptyState = ({ icon = 'cube-outline', title, subtitle }) => {
  return (
    <View style={styles.container}>
      <Ionicons name={icon} size={64} color={Colors.gray300} />
      <Text style={styles.title}>{title}</Text>
      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingVertical: 48,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginTop: 16,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: Colors.textMuted,
    marginTop: 8,
    textAlign: 'center',
  },
});

export default EmptyState;
