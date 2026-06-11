import * as ImagePicker from 'expo-image-picker';
import { Alert } from 'react-native';

export default function useImagePicker() {
  async function pickImage({ aspect = [1, 1], permissionMessage = 'Permita o acesso à galeria para continuar.' } = {}) {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Permissão necessária', permissionMessage);
      return null;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes:    ['images'],
      allowsEditing: true,
      aspect,
      quality:       0.8,
    });

    if (result.canceled) return null;
    return result.assets[0].uri;
  }

  return { pickImage };
}
