import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import WelcomeScreen  from '../screens/WelcomeScreen';
import LoginScreen    from '../screens/LoginScreen';
import CadastroScreen from '../screens/CadastroScreen';
import HomeScreen     from '../screens/HomeScreen';
import ProfileScreen  from '../screens/ProfileScreen';
import CoursesScreen  from '../screens/CoursesScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Welcome"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Welcome"    component={WelcomeScreen}  />
        <Stack.Screen name="Login"      component={LoginScreen}    />
        <Stack.Screen name="Cadastro"   component={CadastroScreen} />
        <Stack.Screen name="Home"       component={HomeScreen}     />
        <Stack.Screen name="Profile"    component={ProfileScreen}  />
        <Stack.Screen name="Courses"    component={CoursesScreen}  />
      </Stack.Navigator>
    </NavigationContainer>
  );
}