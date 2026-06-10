import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MSLogo } from '../components/Logo';
import { colors, spacing, radius } from '../theme';

export default function WelcomeScreen({ navigation }) {
  const logoY  = useRef(new Animated.Value(-30)).current;
  const logoOp = useRef(new Animated.Value(0)).current;
  const textOp = useRef(new Animated.Value(0)).current;
  const textY  = useRef(new Animated.Value(30)).current;
  const btnsOp = useRef(new Animated.Value(0)).current;
  const btnsY  = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    startLogoAnimation();
    startTextAnimation();
    startButtonsAnimation();
  }, []);

  function startLogoAnimation() {
    Animated.parallel([
      Animated.timing(logoOp, { toValue: 1, duration: 700, useNativeDriver: true }),
      Animated.spring(logoY,  { toValue: 0, friction: 7,   useNativeDriver: true }),
    ]).start();
  }

  function startTextAnimation() {
    setTimeout(() => {
      Animated.parallel([
        Animated.timing(textOp, { toValue: 1, duration: 600, useNativeDriver: true }),
        Animated.spring(textY,  { toValue: 0, friction: 7,   useNativeDriver: true }),
      ]).start();
    }, 350);
  }

  function startButtonsAnimation() {
    setTimeout(() => {
      Animated.parallel([
        Animated.timing(btnsOp, { toValue: 1, duration: 600, useNativeDriver: true }),
        Animated.spring(btnsY,  { toValue: 0, friction: 7,   useNativeDriver: true }),
      ]).start();
    }, 600);
  }

  function handleStart() {
    navigation.navigate('Cadastro');
  }

  function handleLogin() {
    navigation.navigate('Login');
  }

  return (
    <SafeAreaView style={styles.safe}>
      <Animated.View style={[styles.logoArea, { opacity: logoOp, transform: [{ translateY: logoY }] }]}>
        <MSLogo size={80} />
      </Animated.View>

      <Animated.View style={[styles.textArea, { opacity: textOp, transform: [{ translateY: textY }] }]}>
        <Text style={styles.label}>O ECOSSISTEMA OFICIAL</Text>
        <Text style={styles.bigTitle}>MARÇAL{'\n'}STORE.</Text>
        <Text style={styles.sub}>
          Conhecimento de elite.{'\n'}Aprenda com quem chegou ao topo.
        </Text>
      </Animated.View>

      <Animated.View style={[styles.buttons, { opacity: btnsOp, transform: [{ translateY: btnsY }] }]}>
        <TouchableOpacity style={styles.btnPrimary} activeOpacity={0.8} onPress={handleStart}>
          <Text style={styles.btnPrimaryText}>COMEÇAR AGORA</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btnGhost} activeOpacity={0.7} onPress={handleLogin}>
          <Text style={styles.btnGhostText}>Já tenho uma conta</Text>
        </TouchableOpacity>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:           { flex: 1, backgroundColor: colors.background },
  logoArea:       { flex: 1, alignItems: 'flex-start', justifyContent: 'flex-end', paddingHorizontal: spacing.lg, paddingBottom: spacing.xl },
  textArea:       { paddingHorizontal: spacing.lg, marginBottom: spacing.xl, gap: spacing.md },
  label:          { fontSize: 10, fontWeight: '700', letterSpacing: 3, color: colors.textSecondary },
  bigTitle:       { fontSize: 56, fontWeight: '900', color: colors.textPrimary, letterSpacing: -2, lineHeight: 54 },
  sub:            { fontSize: 15, color: colors.textSecondary, lineHeight: 24 },
  buttons:        { paddingHorizontal: spacing.lg, paddingBottom: spacing.xl, gap: spacing.sm },
  btnPrimary:     { height: 58, borderRadius: radius.md, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' },
  btnPrimaryText: { fontSize: 14, fontWeight: '900', color: colors.primaryText, letterSpacing: 2 },
  btnGhost:       { height: 52, alignItems: 'center', justifyContent: 'center' },
  btnGhostText:   { fontSize: 14, fontWeight: '600', color: colors.textSecondary },
});