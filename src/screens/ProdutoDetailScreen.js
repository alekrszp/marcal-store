import React, { useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import SafeImage from '../components/SafeImage';
import ModuloItem from '../components/ModuloItem';
import g from '../theme/globalStyles';
import { colors, spacing, radius, typography } from '../theme';
import { formatCurrency } from '../utils/formatters';
import { useCartContext } from '../context/CartContext';
import useOrders from '../hooks/useOrders';

export default function ProdutoDetailScreen({ navigation, route }) {
  const { produto }  = route.params;
  const { addItem }  = useCartContext();
  const insets       = useSafeAreaInsets();
  const { orders, reload: reloadOrders } = useOrders();

  useFocusEffect(
    useCallback(() => {
      reloadOrders();
    }, [reloadOrders])
  );

  // Cada curso só pode ser comprado uma vez: se já existe um pedido com este
  // produto no histórico (orderService.getOrders()), o cliente já tem acesso
  // à aula em "Meus Cursos" e não deve poder comprá-lo de novo.
  const jaComprado = orders.some(order => order.items.some(item => item.id === produto.id));

  function handleGoBack() {
    navigation.goBack();
  }

  function handleAssistirVideo() {
    navigation.navigate('VideoPlayer', { video: produto.video, title: produto.title });
  }

  async function handleAdicionarAoCarrinho() {
    const adicionado = await addItem(produto);
    if (!adicionado) {
      Alert.alert('Já está no carrinho', `${produto.title} já está no seu carrinho.`);
      return;
    }
    Alert.alert(
      'Adicionado ao carrinho',
      `${produto.title} foi adicionado ao seu carrinho.`,
      [
        { text: 'Continuar comprando', style: 'cancel' },
        { text: 'Ver carrinho', onPress: () => navigation.navigate('Cart') },
      ]
    );
  }

  return (
    <SafeAreaView style={g.screen}>
      <TouchableOpacity style={[styles.backButton, { top: insets.top + spacing.lg }]} onPress={handleGoBack}>
        <Text style={styles.backText}>← VOLTAR</Text>
      </TouchableOpacity>

      <ScrollView showsVerticalScrollIndicator={false}>

        <View style={styles.imageContainer}>
          <SafeImage uri={produto.image} style={styles.image} />
          <View style={styles.imageOverlay} />
          {produto.tag ? (
            <View style={styles.tag}>
              <Text style={styles.tagText}>{produto.tag}</Text>
            </View>
          ) : null}
        </View>

        <View style={styles.content}>
          <Text style={styles.category}>{(produto.category ?? 'Curso').toUpperCase()}</Text>
          <Text style={styles.title}>{produto.title}</Text>
          <Text style={styles.mentor}>por {produto.mentor}</Text>

          {produto.cargaHoraria ? (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>⏱ {produto.cargaHoraria} de conteúdo</Text>
            </View>
          ) : null}

          <View style={styles.divider} />

          {produto.descricao ? (
            <>
              <Text style={styles.sectionTitle}>SOBRE O CURSO</Text>
              <Text style={styles.descricao}>{produto.descricao}</Text>
              <View style={styles.divider} />
            </>
          ) : null}

          {produto.modulos?.length ? (
            <>
              <Text style={styles.sectionTitle}>O QUE VOCÊ VAI APRENDER</Text>
              <View style={styles.modulosList}>
                {produto.modulos.map((modulo, index) => (
                  <ModuloItem key={index} title={modulo} />
                ))}
              </View>
              <View style={styles.divider} />
            </>
          ) : null}

          {produto.video ? (
            <>
              <TouchableOpacity style={styles.videoButton} onPress={handleAssistirVideo}>
                <Text style={styles.videoButtonText}>▶ ASSISTIR VÍDEO DO CURSO</Text>
              </TouchableOpacity>
              <View style={styles.divider} />
            </>
          ) : null}

          <View style={styles.buySection}>
            {jaComprado ? (
              <View style={styles.ownedBadge}>
                <Text style={styles.ownedBadgeText}>✓ VOCÊ JÁ TEM ESSE CURSO</Text>
              </View>
            ) : (
              <>
                <View>
                  <Text style={styles.priceLabel}>INVESTIMENTO</Text>
                  <Text style={styles.price} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.6}>
                    {formatCurrency(produto.price)}
                  </Text>
                </View>
                <TouchableOpacity style={styles.buyButton} onPress={handleAdicionarAoCarrinho}>
                  <Text style={styles.buyButtonText}>ADICIONAR AO CARRINHO</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  imageContainer: { height: 280, position: 'relative' },
  image:          { width: '100%', height: '100%' },
  imageOverlay:   { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.4)' },
  backButton:     { position: 'absolute', top: spacing.lg, left: spacing.lg, zIndex: 10 },
  backText:       { ...typography.caption, fontWeight: '700', color: colors.primaryText, letterSpacing: 1.5 },
  tag:            { position: 'absolute', top: spacing.lg, right: spacing.lg, backgroundColor: colors.primary, paddingHorizontal: spacing.sm, paddingVertical: spacing.xs, borderRadius: radius.full },
  tagText:        { ...typography.nano, color: colors.primaryText },
  content:        { padding: spacing.lg },
  category:       { ...typography.micro, color: colors.primary, marginBottom: spacing.xs },
  title:          { ...typography.h2, color: colors.textPrimary, marginBottom: spacing.xs },
  mentor:         { ...typography.subtitle, color: colors.textSecondary, marginBottom: spacing.md },
  badge:          { alignSelf: 'flex-start', backgroundColor: colors.surfaceAlt, borderRadius: radius.sm, paddingHorizontal: spacing.md, paddingVertical: spacing.xs, borderWidth: 1, borderColor: colors.border },
  badgeText:      { ...typography.caption, color: colors.textSecondary },
  divider:        { height: 1, backgroundColor: colors.border, marginVertical: spacing.lg },
  sectionTitle:   { ...typography.micro, color: colors.textSecondary, marginBottom: spacing.md },
  descricao:      { ...typography.body, color: colors.textPrimary },
  modulosList:    { gap: spacing.sm },
  videoButton:    { backgroundColor: colors.surfaceAlt, borderWidth: 1, borderColor: colors.primary, borderRadius: radius.md, paddingVertical: spacing.md, alignItems: 'center' },
  videoButtonText:{ ...typography.button, color: colors.primary },
  buySection:     { gap: spacing.md },
  priceLabel:     { ...typography.micro, color: colors.textSecondary, marginBottom: spacing.xs },
  price:          { ...typography.h4, color: colors.primary },
  buyButton:      { backgroundColor: colors.primary, paddingVertical: spacing.md, paddingHorizontal: spacing.lg, borderRadius: radius.md, alignItems: 'center' },
  buyButtonText:  { ...typography.button, color: colors.primaryText },
  ownedBadge:     { flex: 1, backgroundColor: colors.surfaceAlt, borderWidth: 1, borderColor: colors.primary, borderRadius: radius.md, paddingVertical: spacing.md, alignItems: 'center' },
  ownedBadgeText: { ...typography.button, color: colors.primary },
});
