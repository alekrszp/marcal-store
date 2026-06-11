import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import ProdutoCard from '../components/ProdutoCard';
import CategoryFilterBar from '../components/CategoryFilterBar';
import g from '../theme/globalStyles';
import { colors, spacing, typography } from '../theme';
import useProdutos from '../hooks/useProdutos';
import useCategories from '../hooks/useCategories';

export default function ProdutosScreen({ navigation, route }) {
  const initialCategory                     = route.params?.category ?? 'Todos';
  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const { produtos, reload }                = useProdutos(activeCategory);
  const { categories }                      = useCategories();

  useFocusEffect(
    useCallback(() => {
      reload();
    }, [reload])
  );

  function handleProdutoPress(produto) {
    navigation.navigate('ProdutoDetail', { produto });
  }

  function handleGoBack() {
    navigation.goBack();
  }

  return (
    <SafeAreaView style={g.screen}>
      <View style={styles.header}>
        <TouchableOpacity style={g.backButton} onPress={handleGoBack}>
          <Text style={g.backText}>← VOLTAR</Text>
        </TouchableOpacity>
        <Text style={styles.title}>PRODUTOS</Text>
      </View>

      <CategoryFilterBar
        categories={categories}
        activeCategory={activeCategory}
        onSelect={setActiveCategory}
      />

      <FlatList
        data={produtos}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.grid}
        columnWrapperStyle={styles.row}
        renderItem={({ item }) => (
          <View style={styles.cardWrap}>
            <ProdutoCard
              produto={item}
              onPress={() => handleProdutoPress(item)}
              style={styles.cardGrid}
            />
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>Nenhum produto encontrado.</Text>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header:   { paddingHorizontal: spacing.lg, paddingTop: spacing.md },
  title:    { ...typography.h2, color: colors.textPrimary, marginBottom: spacing.md },
  grid:     { paddingHorizontal: spacing.lg, paddingBottom: spacing.xxl },
  row:      { justifyContent: 'space-between', marginBottom: spacing.md },
  cardWrap: { width: '48%' },
  cardGrid: { width: '100%' },
  emptyText:{ ...typography.small, color: colors.textSecondary, textAlign: 'center', marginTop: spacing.xl },
});
