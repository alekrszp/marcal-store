import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MSLogo } from './Logo';
import { colors, spacing, radius, typography } from '../theme';

export default function AuthCard({ title, subtitle, children }) {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <MSLogo size={44} />
        <View style={styles.titles}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>{subtitle}</Text>
        </View>
      </View>
      <View style={styles.divider} />
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card:     { backgroundColor: colors.surface, borderRadius: radius.xl, padding: spacing.lg, borderWidth: 1, borderColor: colors.border },
  header:   { flexDirection: 'row', alignItems: 'center', gap: spacing.md, marginBottom: spacing.lg },
  titles:   { flex: 1 },
  title:    { fontSize: 22, fontWeight: '900', color: colors.textPrimary, letterSpacing: 2 },
  subtitle: { ...typography.caption, color: colors.textSecondary, marginTop: spacing.xs },
  divider:  { height: 1, backgroundColor: colors.border, marginBottom: spacing.lg },
});