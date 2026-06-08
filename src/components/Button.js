import React from 'react';
import { Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { colors, radius, typography } from '../theme';

export default function Button({
  title, onPress, variant = 'primary',
  loading = false, disabled = false, style,
}) {
  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      disabled={isDisabled}
      style={[styles.base, styles[variant], isDisabled && styles.disabled, style]}
    >
      {loading
        ? <ActivityIndicator color={variant === 'primary' ? colors.primaryText : colors.primary} />
        : <Text style={[styles.text, styles[`${variant}Text`]]}>{title}</Text>
      }
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base:        { height: 58, borderRadius: radius.md, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24 },
  primary:     { backgroundColor: colors.primary },
  outline:     { borderWidth: 1, borderColor: colors.borderLight, backgroundColor: 'transparent' },
  ghost:       { backgroundColor: 'transparent' },
  disabled:    { opacity: 0.3 },
  text:        { ...typography.button },
  primaryText: { color: colors.primaryText },
  outlineText: { color: colors.textSecondary },
  ghostText:   { color: colors.textSecondary },
});