import React, { useState, useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import Logo from '../components/Logo';
import HeroBanner from '../components/HeroBanner';
import CategoryFilterBar from '../components/CategoryFilterBar';
import SectionHeader from '../components/SectionHeader';
import ProdutoRow from '../components/ProdutoRow';
import ProfileButton from '../components/ProfileButton';
import CartButton from '../components/CartButton';
import PromoVideoButton from '../components/PromoVideoButton';
import { PROMO_VIDEO } from '../data/promo';
import { colors, spacing } from '../theme';
import { useUserContext } from '../context/UserContext';
import { useCartContext } from '../context/CartContext';
import useProdutos from '../hooks/useProdutos';
import useCategories from '../hooks/useCategories';

export default function HomeScreen({ navigation }) {
  const [activeCategory, setActiveCategory] = useState('Todos');
  const { user }                            = useUserContext();
  const { itemCount }                       = useCartContext();
  const { produtos, reload: reloadProdutos }       = useProdutos(activeCategory);
  const { produtos: mentorias, reload: reloadMentorias } = useProdutos('Mentoria');
  const { categories }                      = useCategories();

  const userInitial = user?.nome?.charAt(0).toUpperCase() ?? 'U';

  useFocusEffect(
    useCallback(() => {
      reloadProdutos();
      reloadMentorias();
    }, [reloadProdutos, reloadMentorias])
  );

  function handleProdutoPress(produto) {
    navigation.navigate('ProdutoDetail', { produto });
  }

  function handleVerTudo(category) {
    navigation.navigate('Produtos', { category });
  }

  function handleProfilePress() {
    navigation.navigate('Profile');
  }

  function handleCartPress() {
    navigation.navigate('Cart');
  }

  function handleVideoPress() {
    navigation.navigate('VideoPlayer', { video: PROMO_VIDEO.video, title: PROMO_VIDEO.title });
  }

  function handleCursosPress() {
    navigation.navigate('MeusCursos');
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>

        <View style={styles.header}>
          <Logo size="sm" />
          <View style={styles.headerActions}>
            <CartButton itemCount={itemCount} onPress={handleCartPress} />
            <ProfileButton initial={userInitial} avatar={user?.avatar} onPress={handleProfilePress} />
          </View>
        </View>

        <HeroBanner />

        <PromoVideoButton onPress={handleVideoPress} />
        <PromoVideoButton
          title="MEUS CURSOS"
          subtitle="Assista às aulas dos cursos que você comprou"
          onPress={handleCursosPress}
        />

        <CategoryFilterBar
          categories={categories}
          activeCategory={activeCategory}
          onSelect={setActiveCategory}
        />

        <SectionHeader
          title={activeCategory === 'Todos' ? 'Em destaque' : activeCategory}
          onVerTudo={() => handleVerTudo(activeCategory)}
        />
        <ProdutoRow produtos={produtos} onProdutoPress={handleProdutoPress} />

        <SectionHeader
          title="Mentorias"
          onVerTudo={() => handleVerTudo('Mentoria')}
        />
        <ProdutoRow produtos={mentorias} onProdutoPress={handleProdutoPress} />

        <View style={styles.bottomSpacer} />

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:         { flex: 1, backgroundColor: colors.background },
  header:       { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: spacing.lg, paddingVertical: spacing.md },
  headerActions:{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  bottomSpacer: { height: spacing.xxl },
});