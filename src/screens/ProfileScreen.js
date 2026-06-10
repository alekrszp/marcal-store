import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import AvatarPicker from '../components/AvatarPicker';
import InfoRow from '../components/InfoRow';
import g from '../theme/globalStyles';
import { colors, spacing, radius } from '../theme';
import { useUserContext } from '../context/UserContext';

export default function ProfileScreen({ navigation }) {
  const { user, updateAvatar, logout } = useUserContext();

  const initials = user?.nome
    ? user.nome.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()
    : '?';

  async function handlePickImage() {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Permissão necessária', 'Permita o acesso à galeria para trocar a foto.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaType.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      await updateAvatar(result.assets[0].uri);
    }
  }

  function handleLogout() {
    Alert.alert(
      'Sair',
      'Tem certeza que deseja sair?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Sair', style: 'destructive', onPress: handleConfirmLogout },
      ]
    );
  }

  async function handleConfirmLogout() {
    await logout();
    navigation.reset({ index: 0, routes: [{ name: 'Welcome' }] });
  }

  function handleGoBack() {
    navigation.goBack();
  }

  return (
    <SafeAreaView style={g.screen}>
      <ScrollView contentContainerStyle={styles.scroll}>

        <TouchableOpacity style={g.backButton} onPress={handleGoBack}>
          <Text style={g.backText}>← VOLTAR</Text>
        </TouchableOpacity>

        <View style={styles.avatarSection}>
          <AvatarPicker avatar={user?.avatar} initials={initials} onPress={handlePickImage} />
        </View>

        <View style={styles.card}>
          <InfoRow label="NOME"   value={user?.nome  ?? ''} />
          <View style={styles.divider} />
          <InfoRow label="E-MAIL" value={user?.email ?? ''} />
        </View>

        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout} activeOpacity={0.8}>
          <Text style={styles.logoutText}>SAIR DA CONTA</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  scroll:        { flexGrow: 1, padding: spacing.lg },
  avatarSection: { alignItems: 'center', marginBottom: spacing.xl },
  card:          { backgroundColor: colors.surface, borderRadius: radius.xl, borderWidth: 1, borderColor: colors.border, overflow: 'hidden', marginBottom: spacing.xl },
  divider:       { height: 1, backgroundColor: colors.border },
  logoutBtn:     { height: 56, borderRadius: radius.md, borderWidth: 1, borderColor: colors.danger, alignItems: 'center', justifyContent: 'center' },
  logoutText:    { fontSize: 13, fontWeight: '900', color: colors.danger, letterSpacing: 2 },
});