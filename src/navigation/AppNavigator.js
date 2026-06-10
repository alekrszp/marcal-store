import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useUserContext } from '../context/UserContext';
import WelcomeScreen      from '../screens/WelcomeScreen';
import LoginScreen        from '../screens/LoginScreen';
import CadastroScreen     from '../screens/CadastroScreen';
import HomeScreen         from '../screens/HomeScreen';
import ProfileScreen      from '../screens/ProfileScreen';
import CoursesScreen      from '../screens/CoursesScreen';
import CourseDetailScreen from '../screens/CourseDetailScreen';

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
      <Stack.Screen name="Home"         component={HomeScreen}         />
      <Stack.Screen name="Profile"      component={ProfileScreen}      />
      <Stack.Screen name="Courses"      component={CoursesScreen}      />
      <Stack.Screen name="CourseDetail" component={CourseDetailScreen} />
    </Stack.Navigator>
  );
}

export default function AppNavigator() {
  const { user, isLoading } = useUserContext();

  if (isLoading) return null;

  return (
    <NavigationContainer>
      {user ? <AppStack /> : <AuthStack />}
    </NavigationContainer>
  );
}