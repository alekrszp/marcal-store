import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing, radius, typography } from '../theme';

export default function ModuloItem({ title }) {
  return (
    <View style={styles.row}>
      <View style={styles.bullet} />
      <Text style={styles.text}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row:    { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  bullet: { width: spacing.sm, height: spacing.sm, borderRadius: radius.full, backgroundColor: colors.primary },
  text:   { ...typography.subtitle, color: colors.textPrimary, flex: 1 },
});