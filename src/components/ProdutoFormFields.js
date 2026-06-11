import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Input from './Input';
import CategoryFilterBar from './CategoryFilterBar';
import ProdutoImagePicker from './ProdutoImagePicker';
import ModulosEditor from './ModulosEditor';
import { colors, spacing, typography } from '../theme';

export default function ProdutoFormFields({ form, errors, setField, setModulos, categories, onPickImage }) {
  return (
    <View>
      <Input
        label="Título"
        value={form.title}
        onChangeText={setField('title')}
        placeholder="Nome do produto"
        autoCapitalize="sentences"
        error={errors.title}
      />
      <Input
        label="Mentor / Autor"
        value={form.mentor}
        onChangeText={setField('mentor')}
        placeholder="Quem ministra o curso"
        autoCapitalize="words"
        error={errors.mentor}
      />
      <Input
        label="Preço (R$)"
        value={form.price}
        onChangeText={setField('price')}
        placeholder="Ex: 497.00"
        keyboardType="decimal-pad"
        maxLength={8}
        error={errors.price}
      />
      <Input
        label="Tag (opcional)"
        value={form.tag}
        onChangeText={setField('tag')}
        placeholder="Ex: TOP, NOVO"
        autoCapitalize="characters"
      />

      <Text style={styles.label}>CATEGORIA</Text>
      <CategoryFilterBar
        categories={categories}
        activeCategory={form.category}
        onSelect={setField('category')}
      />
      {errors.category ? <Text style={styles.errorText}>{errors.category}</Text> : null}

      <ProdutoImagePicker
        image={form.image}
        onPress={onPickImage}
        error={errors.image}
      />
      <Input
        label="Descrição (opcional)"
        value={form.descricao}
        onChangeText={setField('descricao')}
        placeholder="Sobre o curso"
        autoCapitalize="sentences"
      />
      <Input
        label="Carga horária (opcional)"
        value={form.cargaHoraria}
        onChangeText={setField('cargaHoraria')}
        placeholder="Ex: 24h"
      />

      <ModulosEditor modulos={form.modulos} onChange={setModulos} />
    </View>
  );
}

const styles = StyleSheet.create({
  label:     { fontSize: 10, fontWeight: '700', letterSpacing: 2, color: colors.textSecondary, marginBottom: spacing.sm },
  errorText: { ...typography.caption, color: colors.danger, marginBottom: spacing.md },
});
