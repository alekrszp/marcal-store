import React, { useState } from 'react';
import { Text, StyleSheet, ScrollView, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Input from '../components/Input';
import Button from '../components/Button';
import AuthCard from '../components/AuthCard';
import g from '../theme/globalStyles';
import { colors, spacing, typography } from '../theme';
import userService from '../services/userService';

export default function LoginScreen({ navigation }) {
  const [email,     setEmail]     = useState('');
  const [senha,     setSenha]     = useState('');
  const [errors,    setErrors]    = useState({});
  const [isLoading, setIsLoading] = useState(false);

  function validateForm() {
    const newErrors = {};
    if (!email.trim())                     newErrors.email = 'Informe seu e-mail';
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'E-mail inválido';
    if (!senha)                            newErrors.senha = 'Informe sua senha';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleLogin() {
    if (!validateForm()) return;
    setIsLoading(true);
    try {
      await userService.login(email, senha);
      navigation.reset({ index: 0, routes: [{ name: 'Home' }] });
    } catch (err) {
      setErrors({ geral: err.message || 'E-mail ou senha incorretos.' });
    } finally {
      setIsLoading(false);
    }
  }

  function handleGoBack()       { navigation.goBack(); }
  function handleGoToCadastro() { navigation.navigate('Cadastro'); }

  return (
    <SafeAreaView style={g.screen}>
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">

          <TouchableOpacity style={g.backButton} onPress={handleGoBack}>
            <Text style={g.backText}>← VOLTAR</Text>
          </TouchableOpacity>

          <AuthCard title="ENTRAR" subtitle="Acesse sua conta">
            <Input label="E-mail" value={email} onChangeText={setEmail}
              placeholder="seu@email.com" keyboardType="email-address" error={errors.email} />
            <Input label="Senha" value={senha} onChangeText={setSenha}
              placeholder="••••••••" secureTextEntry error={errors.senha} />

            {errors.geral ? <Text style={styles.errorGeral}>{errors.geral}</Text> : null}

            <TouchableOpacity style={styles.forgot}>
              <Text style={styles.forgotText}>ESQUECI MINHA SENHA</Text>
            </TouchableOpacity>

            <Button title="ENTRAR" onPress={handleLogin} loading={isLoading} />
          </AuthCard>

          <TouchableOpacity style={g.footerRow} onPress={handleGoToCadastro}>
            <Text style={g.footerText}>Não tem conta?</Text>
            <Text style={g.footerLink}> Cadastre-se</Text>
          </TouchableOpacity>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex:       { flex: 1 },
  scroll:     { flexGrow: 1, padding: spacing.lg, justifyContent: 'center' },
  forgot:     { alignSelf: 'flex-end', marginBottom: spacing.lg },
  forgotText: { ...typography.nano, color: colors.textSecondary, letterSpacing: 1.5 },
  errorGeral: { ...typography.caption, color: colors.danger, marginBottom: spacing.md, textAlign: 'center' },
});