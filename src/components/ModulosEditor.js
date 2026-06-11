import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, spacing, radius, typography } from '../theme';

export default function ModulosEditor({ modulos, onChange }) {
  const [novoModulo, setNovoModulo] = useState('');

  function handleAdd() {
    const titulo = novoModulo.trim();
    if (!titulo) return;
    onChange([...modulos, titulo]);
    setNovoModulo('');
  }

  function handleRemove(index) {
    onChange(modulos.filter((_, i) => i !== index));
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>MÓDULOS</Text>

      {modulos.map((modulo, index) => (
        <View key={`${modulo}-${index}`} style={styles.item}>
          <Text style={styles.itemText} numberOfLines={1}>{modulo}</Text>
          <TouchableOpacity onPress={() => handleRemove(index)}>
            <Text style={styles.remove}>REMOVER</Text>
          </TouchableOpacity>
        </View>
      ))}

      <View style={styles.addRow}>
        <TextInput
          style={styles.input}
          value={novoModulo}
          onChangeText={setNovoModulo}
          placeholder="Nome do módulo"
          placeholderTextColor={colors.textMuted}
          onSubmitEditing={handleAdd}
        />
        <TouchableOpacity style={styles.addButton} onPress={handleAdd}>
          <Text style={styles.addButtonText}>ADICIONAR</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container:    { marginBottom: spacing.md },
  label:        { fontSize: 10, fontWeight: '700', letterSpacing: 2, color: colors.textSecondary, marginBottom: spacing.sm },
  item:         { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: colors.surfaceAlt, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border, paddingHorizontal: spacing.md, height: 48, marginBottom: spacing.sm },
  itemText:     { ...typography.body, color: colors.textPrimary, flex: 1, marginRight: spacing.sm },
  remove:       { ...typography.nano, color: colors.danger },
  addRow:       { flexDirection: 'row', gap: spacing.sm },
  input:        { flex: 1, height: 48, backgroundColor: colors.surfaceAlt, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border, paddingHorizontal: spacing.md, color: colors.textPrimary, fontSize: 16 },
  addButton:    { paddingHorizontal: spacing.md, height: 48, borderRadius: radius.md, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' },
  addButtonText:{ ...typography.nano, color: colors.primaryText },
});
