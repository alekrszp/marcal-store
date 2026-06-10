import React, { useState } from 'react';
import { Text, StyleSheet, ScrollView, TouchableOpacity, KeyboardAvoidingView, Platform, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Input from '../components/Input';
import Button from '../components/Button';
import AuthCard from '../components/AuthCard';
import g from '../theme/globalStyles';
import { colors, spacing, radius, typography } from '../theme';
import userService from '../services/userService';

export default function CadastroScreen({ navigation }) {
  const [form,      setForm]      = useState({ nome: '', email: '', senha: '', confirmar: '' });
  const [hasAceito, setHasAceito] = useState(false);
  const [errors,    setErrors]    = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const setField = (field) => (value) => setForm(prev => ({ ...prev, [field]: value }));

  function validateForm() {
    const newErrors = {};
    if (!form.nome.trim())                      newErrors.nome      = 'Informe seu nome';
    if (!form.email.trim())                     newErrors.email     = 'Informe seu e-mail';
    else if (!/\S+@\S+\.\S+/.test(form.email)) newErrors.email     = 'E-mail inválido';
    if (!form.senha)                            newErrors.senha     = 'Crie uma senha';
    else if (form.senha.length < 6)             newErrors.senha     = 'Mínimo 6 caracteres';
    if (form.confirmar !== form.senha)          newErrors.confirmar = 'Senhas não coincidem';
    if (!hasAceito)                             newErrors.aceito    = 'Aceite os termos para continuar';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleCadastro() {
    if (!validateForm()) return;
    setIsLoading(true);
    try {
      await userService.register(form.nome, form.email, form.senha);
      navigation.reset({ index: 0, routes: [{ name: 'Home' }] });
    } catch (err) {
      setErrors({ geral: err.message || 'Erro ao criar conta. Tente novamente.' });
    } finally {
      setIsLoading(false);
    }
  }

  function handleGoBack()    { navigation.goBack(); }
  function handleGoToLogin() { navigation.navigate('Login'); }

  return (
    <SafeAreaView style={g.screen}>
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">

          <TouchableOpacity style={g.backButton} onPress={handleGoBack}>
            <Text style={g.backText}>← VOLTAR</Text>
          </TouchableOpacity>

          <AuthCard title="CADASTRO" subtitle="Crie sua conta grátis">
            <Input label="Nome completo" value={form.nome} onChangeText={setField('nome')}
              placeholder="Seu nome" autoCapitalize="words" error={errors.nome} />
            <Input label="E-mail" value={form.email} onChangeText={setField('email')}
              placeholder="seu@email.com" keyboardType="email-address" error={errors.email} />
            <Input label="Senha" value={form.senha} onChangeText={setField('senha')}
              placeholder="Mínimo 6 caracteres" secureTextEntry error={errors.senha} />
            <Input label="Confirmar senha" value={form.confirmar} onChangeText={setField('confirmar')}
              placeholder="Repita a senha" secureTextEntry error={errors.confirmar} />

            {errors.geral ? <Text style={styles.errorGeral}>{errors.geral}</Text> : null}

            <TouchableOpacity style={styles.terms} onPress={() => setHasAceito(a => !a)} activeOpacity={0.7}>
              <View style={[styles.checkbox, hasAceito && styles.checkboxOn]}>
                {hasAceito ? <Text style={styles.checkmark}>✓</Text> : null}
              </View>
              <Text style={styles.termsText}>Aceito os termos de uso e política de privacidade</Text>
            </TouchableOpacity>
            {errors.aceito ? <Text style={styles.errorText}>{errors.aceito}</Text> : null}

            <Button title="CRIAR CONTA" onPress={handleCadastro} loading={isLoading} style={{ marginTop: spacing.md }} />
          </AuthCard>

          <TouchableOpacity style={g.footerRow} onPress={handleGoToLogin}>
            <Text style={g.footerText}>Já tem conta?</Text>
            <Text style={g.footerLink}> Entrar</Text>
          </TouchableOpacity>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex:       { flex: 1 },
  scroll:     { flexGrow: 1, padding: spacing.lg, justifyContent: 'center' },
  terms:      { flexDirection: 'row', alignItems: 'center', marginTop: spacing.sm, gap: spacing.sm },
  checkbox:   { width: 20, height: 20, borderRadius: radius.sm, borderWidth: 1, borderColor: colors.borderLight, alignItems: 'center', justifyContent: 'center' },
  checkboxOn: { backgroundColor: colors.primary, borderColor: colors.primary },
  checkmark:  { ...typography.caption, fontWeight: '900', color: colors.primaryText },
  termsText:  { ...typography.caption, color: colors.textSecondary, lineHeight: 18, flex: 1 },
  errorText:  { ...typography.caption, color: colors.danger, marginTop: spacing.xs },
  errorGeral: { ...typography.caption, color: colors.danger, marginBottom: spacing.md, textAlign: 'center' },
});