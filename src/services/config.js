// Configuração central de integração com backend/API.
//
// USE_MOCK = true  → app funciona 100% local, sem backend.
//                    Dados vêm de src/data/* e persistem no AsyncStorage.
// USE_MOCK = false → todas as chamadas vão para o gateway-service em API_URL.
//
// PARA INTEGRAR COM O BACKEND:
// 1. Trocar USE_MOCK para false
// 2. Confirmar que API_URL aponta para o gateway (docker-compose local: porta 8765)
// 3. Subir o backend com docker-compose up
// 4. Para Android Emulator usar 10.0.2.2; para iOS Simulator usar localhost
export const USE_MOCK = true;

// URL do gateway-service (Spring Cloud Gateway).
// Android Emulator → http://10.0.2.2:8765
// iOS Simulator    → http://localhost:8765
// Device físico    → http://<IP-da-maquina>:8765
export const API_URL = 'http://10.0.2.2:8765';
