import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Input from '../components/Input';
import Button from '../components/Button';
import { MSLogo } from '../components/Logo';
import g from '../theme/globalStyles';
import { colors, spacing, radius } from '../theme';

export default function CadastroScreen({ navigation }) {
  const [form,    setForm]    = useState({ nome: '', email: '', senha: '', confirmar: '' });
  const [aceito,  setAceito]  = useState(false);
  const [errors,  setErrors]  = useState({});
  const [loading, setLoading] = useState(false);

  const setField = (field) => (value) => setForm(prev => ({ ...prev, [field]: value }));

  function validate() {
    const e = {};
    if (!form.nome.trim())                      e.nome      = 'Informe seu nome';
    if (!form.email.trim())                     e.email     = 'Informe seu e-mail';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email     = 'E-mail inválido';
    if (!form.senha)                            e.senha     = 'Crie uma senha';
    else if (form.senha.length < 6)             e.senha     = 'Mínimo 6 caracteres';
    if (form.confirmar !== form.senha)          e.confirmar = 'Senhas não coincidem';
    if (!aceito)                                e.aceito    = 'Aceite os termos para continuar';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleCadastro() {
    if (!validate()) return;
    setLoading(true);
    setTimeout(() => { setLoading(false); navigation.navigate('Home'); }, 1200);
  }

  return (
    <SafeAreaView style={g.screen}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">

          <TouchableOpacity style={g.backButton} onPress={() => navigation.goBack()}>
            <Text style={g.backText}>← VOLTAR</Text>
          </TouchableOpacity>

          {/* Card */}
          <View style={styles.card}>
            <View style={styles.cardTop}>
              <MSLogo size={44} />
              <View style={styles.cardTitles}>
                <Text style={styles.cardTitle}>CADASTRO</Text>
                <Text style={styles.cardSub}>Crie sua conta grátis</Text>
              </View>
            </View>

            <View style={styles.divider} />

            <Input label="Nome completo" value={form.nome} onChangeText={setField('nome')}
              placeholder="Seu nome" autoCapitalize="words" error={errors.nome} />
            <Input label="E-mail" value={form.email} onChangeText={setField('email')}
              placeholder="seu@email.com" keyboardType="email-address" error={errors.email} />
            <Input label="Senha" value={form.senha} onChangeText={setField('senha')}
              placeholder="Mínimo 6 caracteres" secureTextEntry error={errors.senha} />
            <Input label="Confirmar senha" value={form.confirmar} onChangeText={setField('confirmar')}
              placeholder="Repita a senha" secureTextEntry error={errors.confirmar} />

            <TouchableOpacity style={styles.terms} onPress={() => setAceito(a => !a)} activeOpacity={0.7}>
              <View style={[styles.checkbox, aceito && styles.checkboxOn]}>
                {aceito ? <Text style={styles.checkmark}>✓</Text> : null}
              </View>
              <Text style={styles.termsText}>
                Aceito os termos de uso e política de privacidade
              </Text>
            </TouchableOpacity>
            {errors.aceito ? <Text style={styles.errorText}>{errors.aceito}</Text> : null}

            <Button
              title="CRIAR CONTA"
              onPress={handleCadastro}
              loading={loading}
              style={{ marginTop: spacing.md }}
            />
          </View>

          <View style={g.footerRow}>
            <Text style={g.footerText}>Já tem conta?</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={g.footerLink}> Entrar</Text>
            </TouchableOpacity>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flexGrow: 1,
    padding: spacing.lg,
    justifyContent: 'center',
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  cardTitles: { flex: 1 },
  cardTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: colors.textPrimary,
    letterSpacing: 2,
  },
  cardSub: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 3,
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginBottom: spacing.lg,
  },
  terms: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.sm,
    gap: spacing.sm,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: colors.borderLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxOn:  { backgroundColor: colors.primary, borderColor: colors.primary },
  checkmark:   { color: colors.primaryText, fontSize: 12, fontWeight: '900' },
  termsText:   { flex: 1, fontSize: 12, color: colors.textSecondary, lineHeight: 18 },
  errorText:   { color: colors.danger, fontSize: 12, marginTop: spacing.xs },
});