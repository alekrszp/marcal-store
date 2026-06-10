import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Input from '../components/Input';
import Button from '../components/Button';
import { MSLogo } from '../components/Logo';
import g from '../theme/globalStyles';
import { colors, spacing, radius } from '../theme';

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

  // INTEGRAÇÃO: substituir setTimeout por chamada real à API
  // Endpoint: POST /api/auth/login
  // Body: { email, senha }
  // Resposta esperada: { token, user: { id, nome, email } }
  // Salvar token em AsyncStorage e user no contexto global
  async function handleLogin() {
    if (!validateForm()) return;
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      navigation.navigate('Home');
    }, 1200);
  }

  function handleGoBack()       { navigation.goBack(); }
  function handleGoToCadastro() { navigation.navigate('Cadastro'); }

  return (
    <SafeAreaView style={g.screen}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">

          <TouchableOpacity style={g.backButton} onPress={handleGoBack}>
            <Text style={g.backText}>← VOLTAR</Text>
          </TouchableOpacity>

          <View style={styles.card}>
            <View style={styles.cardTop}>
              <MSLogo size={44} />
              <View style={styles.cardTitles}>
                <Text style={styles.cardTitle}>ENTRAR</Text>
                <Text style={styles.cardSub}>Acesse sua conta</Text>
              </View>
            </View>

            <View style={styles.divider} />

            <Input label="E-mail" value={email} onChangeText={setEmail}
              placeholder="seu@email.com" keyboardType="email-address" error={errors.email} />
            <Input label="Senha" value={senha} onChangeText={setSenha}
              placeholder="••••••••" secureTextEntry error={errors.senha} />

            <TouchableOpacity style={styles.forgot}>
              <Text style={styles.forgotText}>ESQUECI MINHA SENHA</Text>
            </TouchableOpacity>

            <Button title="ENTRAR" onPress={handleLogin} loading={isLoading} />
          </View>

          <View style={g.footerRow}>
            <Text style={g.footerText}>Não tem conta?</Text>
            <TouchableOpacity onPress={handleGoToCadastro}>
              <Text style={g.footerLink}> Cadastre-se</Text>
            </TouchableOpacity>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  scroll:      { flexGrow: 1, padding: spacing.lg, justifyContent: 'center' },
  card:        { backgroundColor: colors.surface, borderRadius: radius.xl, padding: spacing.lg, borderWidth: 1, borderColor: colors.border },
  cardTop:     { flexDirection: 'row', alignItems: 'center', gap: spacing.md, marginBottom: spacing.lg },
  cardTitles:  { flex: 1 },
  cardTitle:   { fontSize: 22, fontWeight: '900', color: colors.textPrimary, letterSpacing: 2 },
  cardSub:     { fontSize: 12, color: colors.textSecondary, marginTop: 3, fontWeight: '500' },
  divider:     { height: 1, backgroundColor: colors.border, marginBottom: spacing.lg },
  forgot:      { alignSelf: 'flex-end', marginBottom: spacing.lg },
  forgotText:  { fontSize: 10, fontWeight: '700', color: colors.textSecondary, letterSpacing: 1.5 },
});