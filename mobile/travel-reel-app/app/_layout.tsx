// app/_layout.tsx
import React, { useEffect, useCallback } from 'react';
import { Slot, useRouter, useSegments } from 'expo-router';
import { View, ActivityIndicator, StyleSheet, Text } from 'react-native';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import {
  PlusJakartaSans_400Regular,
  PlusJakartaSans_500Medium,
  PlusJakartaSans_600SemiBold,
  PlusJakartaSans_700Bold,
  PlusJakartaSans_800ExtraBold,
} from '@expo-google-fonts/plus-jakarta-sans';

// Keep splash screen visible while fonts load
SplashScreen.preventAutoHideAsync();

function AppNavigator() {
  const { user, loading } = useAuth();
  const segments = useSegments() as String[];
  const router = useRouter();

  // Load Plus Jakarta Sans fonts
  const [fontsLoaded, fontError] = useFonts({
    PlusJakartaSans_400Regular,
    PlusJakartaSans_500Medium,
    PlusJakartaSans_600SemiBold,
    PlusJakartaSans_700Bold,
    PlusJakartaSans_800ExtraBold,
  });

  // Hide splash screen when fonts are loaded
  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded || fontError) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  // Navigation effect (auth-based routing)
  useEffect(() => {
    if (loading) return;

    const inLogin = segments.includes('login');
    const inNotFound = segments.includes('+not-found');

    if (!user && !inLogin) {
      router.replace('/login');
    } else if (user && inLogin) {
      router.replace('/');
    }
  }, [user, loading, segments]);

  // Show error if fonts failed to load
  if (fontError) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>Error loading fonts</Text>
        <Text style={styles.errorSubtext}>{fontError.message}</Text>
      </View>
    );
  }

  // Show loading spinner while fonts or auth is loading
  if (!fontsLoaded || loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#E85D3F" />
      </View>
    );
  }

  // Fonts loaded, render the app
  return (
    <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
      <Slot />
    </View>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <AppNavigator />
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  errorText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ED2626',
    marginBottom: 8,
    textAlign: 'center',
  },
  errorSubtext: {
    fontSize: 14,
    color: '#66718A',
    textAlign: 'center',
  },
});
