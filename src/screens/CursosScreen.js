import React, { useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import CursoVideoCard from '../components/CursoVideoCard';
import g from '../theme/globalStyles';
import { spacing, typography, colors } from '../theme';
import useProdutos from '../hooks/useProdutos';

export default function CursosScreen({ navigation }) {
  const { produtos, reload } = useProdutos('Todos');
  const cursosComVideo       = produtos.filter(p => p.video);

  useFocusEffect(
    useCallback(() => {
      reload();
    }, [reload])
  );

  function handleGoBack() {
    navigation.goBack();
  }

  function handlePress(produto) {
    navigation.navigate('VideoPlayer', { video: produto.video, title: produto.title });
  }

  return (
    <SafeAreaView style={g.screen}>
      <View style={styles.header}>
        <TouchableOpacity style={g.backButton} onPress={handleGoBack}>
          <Text style={g.backText}>← VOLTAR</Text>
        </TouchableOpacity>
        <Text style={styles.title}>ÁREA DE CURSOS</Text>
        <Text style={styles.subtitle}>Assista aos vídeos de apresentação dos cursos</Text>
      </View>

      <FlatList
        data={cursosComVideo}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <CursoVideoCard produto={item} onPress={() => handlePress(item)} />
        )}
        ListEmptyComponent={
          <Text style={styles.empty}>Nenhum curso com vídeo disponível no momento.</Text>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header:   { paddingHorizontal: spacing.lg, paddingTop: spacing.md },
  title:    { ...typography.h2, color: colors.textPrimary, marginBottom: spacing.xs },
  subtitle: { ...typography.body, color: colors.textSecondary, marginBottom: spacing.md },
  list:     { paddingHorizontal: spacing.lg, paddingBottom: spacing.xxl },
  empty:    { ...typography.small, color: colors.textSecondary, textAlign: 'center', marginTop: spacing.xl },
});
