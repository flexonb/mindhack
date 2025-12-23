import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';

import { HomeScreen } from '../screens/HomeScreen';
import { LoginScreen } from '../screens/LoginScreen';
import { RegisterScreen } from '../screens/RegisterScreen';
import { TrainingScreen } from '../screens/TrainingScreen';
import { SupportScreen } from '../screens/SupportScreen';
import { ChatScreen } from '../screens/ChatScreen';
import { ProfileScreen } from '../screens/ProfileScreen';

const Stack = createNativeStackNavigator();

export function RootNavigator() {
  const { isLoading, user } = useAuth();

  if (isLoading) {
    return null; // Or loading screen
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={user ? 'Home' : 'Login'}
        screenOptions={{
          headerStyle: {
            backgroundColor: '#0ea5e9',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: '600',
          },
        }}
      >
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Register"
          component={RegisterScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Training"
          component={TrainingScreen}
          options={{ title: 'AI Training' }}
        />
        <Stack.Screen
          name="Support"
          component={SupportScreen}
          options={{ title: 'Get Support' }}
        />
        <Stack.Screen
          name="Chat"
          component={ChatScreen}
          options={{ title: 'Chat' }}
        />
        <Stack.Screen
          name="Profile"
          component={ProfileScreen}
          options={{ title: 'Profile' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
