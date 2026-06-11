import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import OrderListItem from '../components/OrderListItem';
import g from '../theme/globalStyles';
import { colors, spacing, typography } from '../theme';
import useOrders from '../hooks/useOrders';

export default function OrderHistoryScreen({ navigation }) {
  const { orders } = useOrders();

  function handleGoBack() {
    navigation.goBack();
  }

  function handleOrderPress(order) {
    navigation.navigate('Receipt', { order });
  }

  return (
    <SafeAreaView style={g.screen}>
      <View style={styles.header}>
        <TouchableOpacity style={g.backButton} onPress={handleGoBack}>
          <Text style={g.backText}>← VOLTAR</Text>
        </TouchableOpacity>
        <Text style={styles.title}>HISTÓRICO DE COMPRAS</Text>
      </View>

      <FlatList
        data={orders}
        keyExtractor={(order) => order.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <OrderListItem order={item} onPress={() => handleOrderPress(item)} />
        )}
        ListEmptyComponent={
          <Text style={styles.empty}>Você ainda não fez nenhuma compra.</Text>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: { paddingHorizontal: spacing.lg, paddingTop: spacing.lg },
  title:  { ...typography.h3, color: colors.textPrimary, marginBottom: spacing.lg },
  list:   { paddingHorizontal: spacing.lg, flexGrow: 1 },
  empty:  { ...typography.small, color: colors.textSecondary, textAlign: 'center', marginTop: spacing.xl },
});
