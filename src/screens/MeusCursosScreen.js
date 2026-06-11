import React, { useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import CursoVideoCard from '../components/CursoVideoCard';
import g from '../theme/globalStyles';
import { spacing, typography, colors } from '../theme';
import useMeusCursos from '../hooks/useMeusCursos';

export default function MeusCursosScreen({ navigation }) {
  const { cursos, isLoading, hasError, reload } = useMeusCursos();

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
        <Text style={styles.title}>MEUS CURSOS</Text>
        <Text style={styles.subtitle}>Assista às aulas dos cursos que você comprou</Text>
      </View>

      <FlatList
        data={cursos}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <CursoVideoCard produto={item} onPress={() => handlePress(item)} />
        )}
        ListEmptyComponent={
          !isLoading ? <Text style={styles.empty}>
            {hasError
              ? 'Erro ao carregar seus cursos.'
              : 'Você ainda não comprou nenhum curso com aulas em vídeo.'}
          </Text> : null
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
