// app/(tabs)/profile.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ActivityIndicator } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';

export default function ProfileScreen() {
  const { user, loading, signOut } = useAuth();

  if (loading) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
          <ActivityIndicator size="large" color="#2563eb" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        {/* Header */}
        <Text style={styles.title}>Perfil</Text>
        <Text style={styles.subtitle}>Gestiona tu cuenta y preferencias</Text>

        {/* User Card */}
        <View style={styles.card}>
          <View style={styles.avatarCircle}>
            <Ionicons name="person-circle-outline" size={54} color="#2563eb" />
          </View>
          <View>
            <Text style={styles.userName}>{user?.user_metadata?.username || user?.email || 'Usuario'}</Text>
            <Text style={styles.userEmail}>{user?.email}</Text>
          </View>
        </View>

        {/* Mis Viajes */}
        <TouchableOpacity style={styles.cardRow}>
          <Ionicons name="location-outline" size={26} color="#64748B" style={{ marginRight: 16 }} />
          <View>
            <Text style={styles.rowTitle}>Mis Viajes</Text>
            <Text style={styles.rowSubtitle}>Ver todos mis itinerarios</Text>
          </View>
        </TouchableOpacity>

        {/* Configuración */}
        <TouchableOpacity style={styles.cardRow}>
          <MaterialCommunityIcons name="cog-outline" size={26} color="#64748B" style={{ marginRight: 16 }} />
          <View>
            <Text style={styles.rowTitle}>Configuración</Text>
            <Text style={styles.rowSubtitle}>Preferencias de la aplicación</Text>
          </View>
        </TouchableOpacity>

        {/* Cerrar sesión */}
        <TouchableOpacity style={[styles.cardRow, styles.logoutRow]} onPress={signOut}>
          <MaterialCommunityIcons name="logout" size={26} color="#dc2626" style={{ marginRight: 16 }} />
          <View>
            <Text style={styles.logoutTitle}>Cerrar Sesión</Text>
            <Text style={styles.logoutSubtitle}>Salir de tu cuenta</Text>
          </View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#eaf1fb',
  },
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#eaf1fb',
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#1e293b',
    marginBottom: 4,
    marginTop: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#64748B',
    marginBottom: 24,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
    shadowColor: '#2563eb',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  avatarCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#e0e7ef',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 18,
  },
  userName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1e293b',
  },
  userEmail: {
    fontSize: 15,
    color: '#64748B',
    marginTop: 2,
  },
  cardRow: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
    shadowColor: '#2563eb',
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
  },
  rowTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1e293b',
  },
  rowSubtitle: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 2,
  },
  logoutRow: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#fee2e2',
    marginTop: 10,
  },
  logoutTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#dc2626',
  },
  logoutSubtitle: {
    fontSize: 14,
    color: '#dc2626',
    marginTop: 2,
  },
});
