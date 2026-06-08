import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors, radius, spacing, typography } from '../theme';

export default function Input({
  label, value, onChangeText, placeholder,
  secureTextEntry = false, keyboardType = 'default',
  autoCapitalize = 'none', error,
}) {
  const [focused, setFocused] = useState(false);
  const [hidden,  setHidden]  = useState(secureTextEntry);

  return (
    <View style={styles.container}>
      {label ? <Text style={styles.label}>{label.toUpperCase()}</Text> : null}
      <View style={[styles.wrapper, focused && styles.focused, error && styles.errorBorder]}>
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.textMuted}
          secureTextEntry={hidden}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        />
        {secureTextEntry
          ? <TouchableOpacity onPress={() => setHidden(h => !h)}>
              <Text style={styles.toggle}>{hidden ? 'VER' : 'OCULTAR'}</Text>
            </TouchableOpacity>
          : null
        }
      </View>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container:   { marginBottom: spacing.md },
  label:       { fontSize: 10, fontWeight: '700', letterSpacing: 2, color: colors.textSecondary, marginBottom: spacing.sm },
  wrapper:     { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surfaceAlt, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border, paddingHorizontal: spacing.md },
  focused:     { borderColor: colors.primary },
  errorBorder: { borderColor: colors.danger },
  input:       { flex: 1, height: 54, color: colors.textPrimary, fontSize: 16, fontWeight: '500' },
  toggle:      { fontSize: 10, fontWeight: '700', letterSpacing: 1, color: colors.textSecondary },
  errorText:   { color: colors.danger, fontSize: 12, marginTop: spacing.xs },
});