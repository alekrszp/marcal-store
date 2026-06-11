// Camada de persistência local. Único ponto de acesso ao AsyncStorage do app —
// nenhum outro arquivo deve importar @react-native-async-storage/async-storage diretamente.
//
// SEGURANÇA — TOKEN DE AUTENTICAÇÃO:
// AsyncStorage não é criptografado. Para uso em produção (com backend real),
// recomenda-se migrar a chave TOKEN (e REFRESH_TOKEN) para um storage seguro,
// como o pacote `expo-secure-store`, que usa Keychain (iOS) / Keystore (Android).
// Enquanto USE_MOCK = true (config.js), manter aqui é suficiente.

import AsyncStorage from '@react-native-async-storage/async-storage';

const KEYS = {
  USER:          '@marcalstore:user',
  TOKEN:         '@marcalstore:token',
  REFRESH_TOKEN: '@marcalstore:refreshToken',
  AVATAR:        '@marcalstore:avatar',
  PRODUTOS:      '@marcalstore:produtos',
  CART:          '@marcalstore:cart',
};

async function save(key, value) {
  await AsyncStorage.setItem(key, JSON.stringify(value));
}

async function load(key) {
  const data = await AsyncStorage.getItem(key);
  return data ? JSON.parse(data) : null;
}

async function remove(key) {
  await AsyncStorage.removeItem(key);
}

async function clearAll() {
  await AsyncStorage.multiRemove(Object.values(KEYS));
}

export default { KEYS, save, load, remove, clearAll };
