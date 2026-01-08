// app/_layout.tsx
import React, { useEffect } from 'react';
import { Slot, useRouter, useSegments } from 'expo-router';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { AuthProvider, useAuth } from './contexts/AuthContext';

function AppNavigator() {
  const { user, loading } = useAuth();
  const segments = useSegments() as String[];
  const router = useRouter();

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

  if (loading) {
    // Mientras carga la sesión mostramos un spinner
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#14B8A6" />
      </View>
    );
  }

  // <Slot /> renderiza la ruta activa: /login, / (tabs), +not-found…
  return <Slot />;
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <AppNavigator />
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});
