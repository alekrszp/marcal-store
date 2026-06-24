import { Platform } from 'react-native';
import Constants from 'expo-constants';

// USE_MOCK = true  → app funciona 100% local, sem backend.
// USE_MOCK = false → todas as chamadas vão para o gateway-service em API_URL.
export const USE_MOCK = false;

const GATEWAY_PORT = 8765;

// Se a detecção automática falhar no Expo Go, defina o IP da sua máquina na rede Wi‑Fi.
// Ex.: '192.168.18.29' (ipconfig → IPv4)
const API_HOST_OVERRIDE = null;

function resolveDevHost() {
  if (API_HOST_OVERRIDE) return API_HOST_OVERRIDE;

  // Expo Go no celular físico: usa o mesmo IP do Metro bundler (rede local).
  const fromExpo =
    Constants.expoGoConfig?.debuggerHost ??
    Constants.expoConfig?.hostUri;

  if (fromExpo) {
    const host = fromExpo.split(':')[0];
    if (host && host !== 'localhost' && host !== '127.0.0.1') {
      return host;
    }
  }

  // Android Emulator → host da máquina
  if (Platform.OS === 'android' && !Constants.isDevice) {
    return '10.0.2.2';
  }

  // iOS Simulator / web
  return 'localhost';
}

export const API_URL = `http://${resolveDevHost()}:${GATEWAY_PORT}`;
