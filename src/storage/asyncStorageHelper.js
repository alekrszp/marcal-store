import AsyncStorage from '@react-native-async-storage/async-storage';

const KEYS = {
  USER:   '@marcalstore:user',
  TOKEN:  '@marcalstore:token',
  AVATAR: '@marcalstore:avatar',
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