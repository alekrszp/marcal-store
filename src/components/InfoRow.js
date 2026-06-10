import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing } from '../theme';

export default function InfoRow({ label, value }) {
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row:   { padding: spacing.lg, gap: 4 },
  label: { fontSize: 10, fontWeight: '700', letterSpacing: 2, color: colors.textSecondary },
  value: { fontSize: 16, fontWeight: '600', color: colors.textPrimary },
});