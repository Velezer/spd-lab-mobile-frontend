import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { Colors } from '../constants/colors';

const Button = ({
  title,
  onPress,
  variant = 'primary',
  loading = false,
  disabled = false,
  style,
}) => {
  const isDisabled = disabled || loading;

  const buttonStyles = [
    styles.base,
    variant === 'primary' && styles.primary,
    variant === 'secondary' && styles.secondary,
    variant === 'danger' && styles.danger,
    isDisabled && styles.disabled,
    style,
  ];

  const textStyles = [
    styles.text,
    variant === 'primary' && styles.primaryText,
    variant === 'secondary' && styles.secondaryText,
    variant === 'danger' && styles.dangerText,
    isDisabled && styles.disabledText,
  ];

  return (
    <TouchableOpacity
      style={buttonStyles}
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === 'secondary' ? Colors.black : Colors.white}
          size="small"
        />
      ) : (
        <Text style={textStyles}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },
  primary: {
    backgroundColor: Colors.buttonPrimary,
  },
  secondary: {
    backgroundColor: Colors.buttonSecondary,
    borderWidth: 1.5,
    borderColor: Colors.gray900,
  },
  danger: {
    backgroundColor: Colors.danger,
  },
  disabled: {
    opacity: 0.5,
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
  },
  primaryText: {
    color: Colors.buttonPrimaryText,
  },
  secondaryText: {
    color: Colors.buttonSecondaryText,
  },
  dangerText: {
    color: Colors.white,
  },
  disabledText: {
    opacity: 0.7,
  },
});

export default Button;
