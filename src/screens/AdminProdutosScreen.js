import React, { useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import AdminProdutoListItem from '../components/AdminProdutoListItem';
import g from '../theme/globalStyles';
import { colors, spacing, radius, typography } from '../theme';
import useProdutos from '../hooks/useProdutos';
import produtoService from '../services/produtoService';

export default function AdminProdutosScreen({ navigation }) {
  const { produtos, isLoading, hasError, reload } = useProdutos('Todos');

  useFocusEffect(
    useCallback(() => {
      reload();
    }, [reload])
  );

  function handleGoBack() {
    navigation.goBack();
  }

  function handleNovoProduto() {
    navigation.navigate('AdminProdutoForm');
  }

  function handleEditProduto(produto) {
    navigation.navigate('AdminProdutoForm', { produto });
  }

  function handleDeleteProduto(produto) {
    Alert.alert(
      'Excluir produto',
      `Tem certeza que deseja excluir "${produto.title}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              await produtoService.deleteProduto(produto.id);
              reload();
            } catch (err) {
              Alert.alert('Erro', err.message || 'Não foi possível excluir o produto.');
            }
          },
        },
      ]
    );
  }

  return (
    <SafeAreaView style={g.screen}>
      <View style={styles.header}>
        <TouchableOpacity style={g.backButton} onPress={handleGoBack}>
          <Text style={g.backText}>← VOLTAR</Text>
        </TouchableOpacity>
        <Text style={styles.title}>ÁREA ADMIN</Text>
        <Text style={styles.subtitle}>Gerencie os produtos da loja</Text>
      </View>

      <TouchableOpacity style={styles.newButton} onPress={handleNovoProduto} activeOpacity={0.8}>
        <Text style={styles.newButtonText}>+ NOVO PRODUTO</Text>
      </TouchableOpacity>

      <FlatList
        style={styles.listFlex}
        data={Array.isArray(produtos) ? produtos : []}
        keyExtractor={(item, index) => String(item?.id ?? index)}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <AdminProdutoListItem
            produto={item}
            onEdit={() => handleEditProduto(item)}
            onDelete={() => handleDeleteProduto(item)}
          />
        )}
        ListEmptyComponent={
          !isLoading ? <Text style={styles.emptyText}>
            {hasError ? 'Erro ao carregar produtos.' : 'Nenhum produto cadastrado.'}
          </Text> : null
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header:        { paddingHorizontal: spacing.lg, paddingTop: spacing.md },
  title:         { ...typography.h2, color: colors.textPrimary },
  subtitle:      { ...typography.subtitle, color: colors.textSecondary, marginTop: spacing.xs, marginBottom: spacing.md },
  newButton:     { marginHorizontal: spacing.lg, marginBottom: spacing.md, height: 52, borderRadius: radius.md, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' },
  newButtonText: { ...typography.button, color: colors.primaryText },
  listFlex:      { flex: 1 },
  list:          { paddingHorizontal: spacing.lg, paddingBottom: spacing.xxl, flexGrow: 1 },
  emptyText:     { ...typography.small, color: colors.textSecondary, textAlign: 'center', marginTop: spacing.xl },
});
