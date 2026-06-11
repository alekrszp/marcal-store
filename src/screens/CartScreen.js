import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CartItemRow from '../components/CartItemRow';
import Button from '../components/Button';
import g from '../theme/globalStyles';
import { colors, spacing, typography } from '../theme';
import { formatCurrency } from '../utils/formatters';
import { useCartContext } from '../context/CartContext';

export default function CartScreen({ navigation }) {
  const { items, total, removeItem, updateQuantity } = useCartContext();

  function handleGoBack() {
    navigation.goBack();
  }

  function handleFinalizar() {
    navigation.navigate('Checkout');
  }

  return (
    <SafeAreaView style={g.screen}>
      <View style={styles.header}>
        <TouchableOpacity style={g.backButton} onPress={handleGoBack}>
          <Text style={g.backText}>← VOLTAR</Text>
        </TouchableOpacity>
        <Text style={styles.title}>CARRINHO</Text>
      </View>

      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <CartItemRow
            item={item}
            onIncrease={() => updateQuantity(item.id, item.quantity + 1)}
            onDecrease={() => updateQuantity(item.id, item.quantity - 1)}
            onRemove={() => removeItem(item.id)}
          />
        )}
        ListEmptyComponent={
          <Text style={styles.empty}>Seu carrinho está vazio.</Text>
        }
      />

      <View style={styles.footer}>
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>TOTAL</Text>
          <Text style={styles.totalValue}>{formatCurrency(total)}</Text>
        </View>
        <Button
          title="FINALIZAR COMPRA"
          onPress={handleFinalizar}
          disabled={items.length === 0}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header:     { paddingHorizontal: spacing.lg, paddingTop: spacing.lg },
  title:      { ...typography.h3, color: colors.textPrimary, marginBottom: spacing.lg },
  list:       { paddingHorizontal: spacing.lg, flexGrow: 1 },
  empty:      { ...typography.small, color: colors.textSecondary, textAlign: 'center', marginTop: spacing.xl },
  footer:     { padding: spacing.lg, borderTopWidth: 1, borderTopColor: colors.border, gap: spacing.md },
  totalRow:   { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  totalLabel: { ...typography.micro, color: colors.textSecondary },
  totalValue: { ...typography.h3, color: colors.primary },
});
