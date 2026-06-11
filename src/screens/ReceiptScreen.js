import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Button from '../components/Button';
import g from '../theme/globalStyles';
import { colors, spacing, radius, typography } from '../theme';
import { formatCurrency, formatDate } from '../utils/formatters';

export default function ReceiptScreen({ navigation, route }) {
  const { order } = route.params;

  function handleVoltarInicio() {
    navigation.popToTop();
  }

  return (
    <SafeAreaView style={g.screen}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        <View style={styles.successIcon}>
          <Text style={styles.successIconText}>✓</Text>
        </View>
        <Text style={styles.title}>COMPRA CONFIRMADA</Text>
        <Text style={styles.subtitle}>Pedido #{order.id}</Text>
        <Text style={styles.date}>{formatDate(order.date)}</Text>

        <Text style={styles.sectionTitle}>ITENS</Text>
        <View style={styles.summaryCard}>
          {order.items.map((item) => (
            <View key={item.id} style={styles.summaryRow}>
              <Text style={styles.summaryItem} numberOfLines={1}>
                {item.title} {item.quantity > 1 ? `(x${item.quantity})` : ''}
              </Text>
              <Text style={styles.summaryValue}>
                {formatCurrency(item.price * item.quantity)}
              </Text>
            </View>
          ))}
        </View>

        <Text style={styles.sectionTitle}>FORMA DE PAGAMENTO</Text>
        <Text style={styles.paymentMethod}>{order.paymentMethod}</Text>

        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>TOTAL</Text>
          <Text style={styles.totalValue}>{formatCurrency(order.total)}</Text>
        </View>

        <Button title="VOLTAR PARA O INÍCIO" onPress={handleVoltarInicio} style={styles.homeButton} />

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  scroll:          { padding: spacing.lg, alignItems: 'center' },
  successIcon:     { width: 64, height: 64, borderRadius: radius.full, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center', marginTop: spacing.xl, marginBottom: spacing.md },
  successIconText: { ...typography.h2, color: colors.primaryText },
  title:           { ...typography.h3, color: colors.textPrimary },
  subtitle:        { ...typography.bodyBold, color: colors.textSecondary, marginTop: spacing.xs },
  date:            { ...typography.caption, color: colors.textSecondary, marginTop: spacing.xs, marginBottom: spacing.lg },
  sectionTitle:    { ...typography.micro, color: colors.textSecondary, marginBottom: spacing.md, alignSelf: 'flex-start' },
  summaryCard:     { width: '100%', backgroundColor: colors.surface, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.border, padding: spacing.md, marginBottom: spacing.lg, gap: spacing.sm },
  summaryRow:      { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: spacing.sm },
  summaryItem:     { ...typography.body, color: colors.textPrimary, flexShrink: 1 },
  summaryValue:    { ...typography.bodyBold, color: colors.primary, flexShrink: 0 },
  paymentMethod:   { ...typography.bodyBold, color: colors.textPrimary, alignSelf: 'flex-start', marginBottom: spacing.lg },
  totalRow:        { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%', marginBottom: spacing.lg },
  totalLabel:      { ...typography.micro, color: colors.textSecondary },
  totalValue:      { ...typography.h3, color: colors.primary },
  homeButton:      { width: '100%', marginBottom: spacing.lg },
});
