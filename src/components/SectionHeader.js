import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, spacing, typography } from '../theme';

export default function SectionHeader({ title, onVerTudo }) {
  return (
    <View style={styles.row}>
      <Text style={styles.title}>{title}</Text>
      {onVerTudo ? (
        <TouchableOpacity onPress={onVerTudo}>
          <Text style={styles.link}>Ver tudo</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row:   { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: spacing.lg, marginTop: spacing.lg, marginBottom: spacing.md },
  title: { ...typography.h3, color: colors.textPrimary },
  link:  { ...typography.caption, fontWeight: '700', color: colors.primary, letterSpacing: 0.5 },
});