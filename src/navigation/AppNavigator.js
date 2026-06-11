import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useUserContext } from '../context/UserContext';
import { colors } from '../theme';
import WelcomeScreen        from '../screens/WelcomeScreen';
import LoginScreen          from '../screens/LoginScreen';
import CadastroScreen       from '../screens/CadastroScreen';
import HomeScreen           from '../screens/HomeScreen';
import ProfileScreen        from '../screens/ProfileScreen';
import ProdutosScreen       from '../screens/ProdutosScreen';
import ProdutoDetailScreen  from '../screens/ProdutoDetailScreen';
import AdminProdutosScreen  from '../screens/AdminProdutosScreen';
import AdminProdutoFormScreen from '../screens/AdminProdutoFormScreen';

const Stack = createNativeStackNavigator();

function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Welcome"  component={WelcomeScreen}  />
      <Stack.Screen name="Login"    component={LoginScreen}    />
      <Stack.Screen name="Cadastro" component={CadastroScreen} />
    </Stack.Navigator>
  );
}

function AppStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home"            component={HomeScreen}            />
      <Stack.Screen name="Profile"         component={ProfileScreen}         />
      <Stack.Screen name="Produtos"        component={ProdutosScreen}        />
      <Stack.Screen name="ProdutoDetail"   component={ProdutoDetailScreen}   />
      <Stack.Screen name="AdminProdutos"   component={AdminProdutosScreen}   />
      <Stack.Screen name="AdminProdutoForm" component={AdminProdutoFormScreen} />
    </Stack.Navigator>
  );
}

function LoadingScreen() {
  return (
    <View style={styles.loading}>
      <ActivityIndicator size="large" color={colors.primary} />
    </View>
  );
}

export default function AppNavigator() {
  const { user, isLoading } = useUserContext();

  if (isLoading) return <LoadingScreen />;

  return (
    <NavigationContainer>
      {user ? <AppStack /> : <AuthStack />}
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  loading: { flex: 1, backgroundColor: colors.background, alignItems: 'center', justifyContent: 'center' },
});