import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CategoryChip from '../components/CategoryChip';
import Button from '../components/Button';
import g from '../theme/globalStyles';
import { colors, spacing, typography } from '../theme';
import { formatCurrency } from '../utils/formatters';
import { useCartContext } from '../context/CartContext';
import orderService from '../services/orderService';

const PAYMENT_METHODS = ['Pix', 'Cartão de Crédito', 'Boleto'];

export default function CheckoutScreen({ navigation }) {
  const { items, total, clearCart }   = useCartContext();
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [error,           setError]           = useState(null);

  function handleGoBack() {
    navigation.goBack();
  }

  async function handleConfirmar() {
    if (!selectedPayment) {
      setError('Selecione uma forma de pagamento');
      return;
    }

    setError(null);
    const order = await orderService.createOrder({ items, paymentMethod: selectedPayment, total });
    await clearCart();
    navigation.replace('Receipt', { order });
  }

  return (
    <SafeAreaView style={g.screen}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        <TouchableOpacity style={g.backButton} onPress={handleGoBack}>
          <Text style={g.backText}>← VOLTAR</Text>
        </TouchableOpacity>

        <Text style={styles.title}>CHECKOUT</Text>

        <Text style={styles.sectionTitle}>RESUMO DO PEDIDO</Text>
        <View style={styles.summaryCard}>
          {items.map((item) => (
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
        <View style={styles.paymentRow}>
          {PAYMENT_METHODS.map((method) => (
            <CategoryChip
              key={method}
              label={method}
              isActive={selectedPayment === method}
              onPress={() => setSelectedPayment(method)}
            />
          ))}
        </View>
        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>TOTAL</Text>
          <Text style={styles.totalValue}>{formatCurrency(total)}</Text>
        </View>

        <Button title="CONFIRMAR COMPRA" onPress={handleConfirmar} style={styles.confirmButton} />

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  scroll:        { padding: spacing.lg },
  title:         { ...typography.h3, color: colors.textPrimary, marginBottom: spacing.lg },
  sectionTitle:  { ...typography.micro, color: colors.textSecondary, marginBottom: spacing.md },
  summaryCard:   { backgroundColor: colors.surface, borderRadius: 18, borderWidth: 1, borderColor: colors.border, padding: spacing.md, marginBottom: spacing.lg, gap: spacing.sm },
  summaryRow:    { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: spacing.sm },
  summaryItem:   { ...typography.body, color: colors.textPrimary, flexShrink: 1 },
  summaryValue:  { ...typography.bodyBold, color: colors.primary, flexShrink: 0 },
  paymentRow:    { flexDirection: 'row', flexWrap: 'wrap', marginBottom: spacing.sm },
  errorText:     { ...typography.caption, color: colors.danger, marginBottom: spacing.sm },
  totalRow:      { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: spacing.lg, marginBottom: spacing.lg },
  totalLabel:    { ...typography.micro, color: colors.textSecondary },
  totalValue:    { ...typography.h3, color: colors.primary },
  confirmButton: { marginBottom: spacing.lg },
});
