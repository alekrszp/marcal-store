import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing, radius } from '../theme';

function StatItem({ value, label }) {
  return (
    <View style={styles.stat}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

export default function HeroBanner() {
  return (
    <View style={styles.container}>
      <View style={styles.badge}>
        <Text style={styles.badgeText}>CHANCELADO POR PABLO MARÇAL</Text>
      </View>
      <Text style={styles.title}>Aprenda com quem{'\n'}domina o jogo.</Text>
      <Text style={styles.subtitle}>
        Mentorias e cursos de quem já chegou ao topo.
      </Text>
      <View style={styles.statsRow}>
        <StatItem value="VIP"  label="Acesso"   />
        <View style={styles.divider} />
        <StatItem value="50k+" label="Alunos"   />
        <View style={styles.divider} />
        <StatItem value="4.9★" label="Avaliação" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { margin: spacing.lg, padding: spacing.lg, backgroundColor: colors.surface, borderRadius: radius.xl, borderWidth: 1, borderColor: colors.border, gap: spacing.sm },
  badge:     { alignSelf: 'flex-start', backgroundColor: colors.primary, paddingHorizontal: spacing.sm, paddingVertical: 4, borderRadius: radius.full },
  badgeText: { fontSize: 9, fontWeight: '800', color: colors.primaryText, letterSpacing: 1.5 },
  title:     { fontSize: 26, fontWeight: '900', color: colors.textPrimary, letterSpacing: -0.5, lineHeight: 30, marginTop: spacing.xs },
  subtitle:  { fontSize: 13, color: colors.textSecondary, lineHeight: 20 },
  statsRow:  { flexDirection: 'row', marginTop: spacing.sm, paddingTop: spacing.md, borderTopWidth: 1, borderTopColor: colors.border },
  stat:      { flex: 1, alignItems: 'center' },
  statValue: { fontSize: 18, fontWeight: '900', color: colors.primary },
  statLabel: { fontSize: 11, color: colors.textSecondary, marginTop: 2 },
  divider:   { width: 1, backgroundColor: colors.border },
});