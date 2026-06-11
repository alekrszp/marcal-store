import React, { useState } from 'react';
import { Text, ScrollView, TouchableOpacity, KeyboardAvoidingView, Platform, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Button from '../components/Button';
import ProdutoFormFields from '../components/ProdutoFormFields';
import g from '../theme/globalStyles';
import { colors, spacing, typography } from '../theme';
import useProdutoForm from '../hooks/useProdutoForm';
import useCategories from '../hooks/useCategories';
import useImagePicker from '../hooks/useImagePicker';
import produtoService from '../services/produtoService';

export default function AdminProdutoFormScreen({ navigation, route }) {
  const produto                           = route.params?.produto;
  const isEdicao                          = !!produto;
  const { form, errors, setField, setModulos, validate, toProdutoData } = useProdutoForm(produto);
  const { categories }                    = useCategories();
  const { pickImage }                     = useImagePicker();
  const [isSaving, setIsSaving]           = useState(false);

  const categoriasSelecionaveis = categories.filter(c => c !== 'Todos');

  function handleGoBack() {
    navigation.goBack();
  }

  async function handlePickImage() {
    const uri = await pickImage({
      aspect:            [16, 9],
      permissionMessage: 'Permita o acesso à galeria para escolher uma imagem.',
    });
    if (uri) setField('image')(uri);
  }

  async function handleSalvar() {
    if (!validate()) return;

    setIsSaving(true);
    try {
      const data = toProdutoData();
      if (isEdicao) {
        await produtoService.updateProduto(produto.id, data);
      } else {
        await produtoService.createProduto(data);
      }
      navigation.goBack();
    } catch (err) {
      Alert.alert('Erro', err.message || 'Não foi possível salvar o produto.');
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <SafeAreaView style={g.screen}>
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">

          <TouchableOpacity style={g.backButton} onPress={handleGoBack}>
            <Text style={g.backText}>← VOLTAR</Text>
          </TouchableOpacity>

          <Text style={styles.title}>{isEdicao ? 'EDITAR PRODUTO' : 'NOVO PRODUTO'}</Text>

          <ProdutoFormFields
            form={form}
            errors={errors}
            setField={setField}
            setModulos={setModulos}
            categories={categoriasSelecionaveis}
            onPickImage={handlePickImage}
          />

          <Button
            title={isEdicao ? 'SALVAR ALTERAÇÕES' : 'CADASTRAR PRODUTO'}
            onPress={handleSalvar}
            loading={isSaving}
            style={styles.saveButton}
          />

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex:       { flex: 1 },
  scroll:     { flexGrow: 1, padding: spacing.lg },
  title:      { ...typography.h2, color: colors.textPrimary, marginBottom: spacing.lg },
  saveButton: { marginTop: spacing.sm, marginBottom: spacing.xl },
});
