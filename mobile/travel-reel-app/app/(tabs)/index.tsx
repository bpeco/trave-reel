// app/(tabs)/index.tsx
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import CountryFlag from "react-native-country-flag";
import countries from "i18n-iso-countries";
import es from "i18n-iso-countries/langs/es.json";

countries.registerLocale(es);

const { width } = Dimensions.get('window');
const BACKEND_URL = 'http://192.168.0.18:8080';

interface Trip {
  trip_id: string;
  name: string;
  country: string;
  stops_count: number;
  created_at?: string;
}

function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export default function TripsScreen() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [profile, setProfile] = useState<{ username: string } | null>(null);

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    fetch(`${BACKEND_URL}/api/trips?created_by=${user.id}`)
      .then(res => res.json())
      .then((data: Trip[]) => setTrips(data))
      .finally(() => setLoading(false));
  }, [user]);

  useEffect(() => {
    // Traer el username de la tabla users
    if (user) {
      supabase
        .from('users')
        .select('username')
        .eq('user_id', user.id)
        .single()
        .then(({ data }) => {
          if (data) setProfile(data);
        });
    }
  }, [user]);

  // Resumen visual
  const uniqueCountries = [...new Set(trips.map(t => t.country))];
  const totalStops = trips.reduce((acc, t) => acc + t.stops_count, 0);

  // Búsqueda
  const filteredTrips = trips.filter(t =>
    t.name.toLowerCase().includes(search.toLowerCase()) ||
    t.country.toLowerCase().includes(search.toLowerCase())
  );

  const renderItem = ({ item }: { item: Trip }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() =>
        router.push({
          pathname: "/(main)/trip/[tripId]",
          params: {
            tripId: item.trip_id,
            name: item.name,
            country: item.country,
          }
        })
      }
      activeOpacity={0.85}
    >
      <View style={styles.cardHeader}>
        <CountryFlag
          isoCode={getCountryIso(item.country)}
          size={15}
          style={{ marginRight: 8, borderRadius: 4 }}
        />
        <Text style={styles.cardTitle}>{item.name}</Text>
      </View>

      <View style={styles.chipRow}>
        <View style={styles.countryChip}>
          <Ionicons name="flag-outline" size={14} color="#2563eb" style={{ marginRight: 8 }} />
          <Text style={styles.countryText}>{item.country}</Text>
        </View>
      </View>

      <View style={styles.cardFooter}>
        <View style={styles.stopsBadge}>
          <Ionicons name="walk-outline" size={14} color="#64748B" />
          <Text style={styles.stopsText}>{item.stops_count} lugares</Text>
        </View>
        {item.created_at && (
          <Text style={styles.createdAt}>
            · {new Date(item.created_at).toLocaleDateString()}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );

  const getCountryIso = (name: string) => {
    // Busca el código ISO a partir del nombre en español
    return countries.getAlpha2Code(name, "es") || "UN";
  };

  if (authLoading || loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#14B8A6" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={['#34d399', '#2563eb']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.headerBg}
      >
        <Text style={styles.greeting}>
          ¡Hola {profile ? capitalize(profile.username) : 'viajero'}!
        </Text>
        <Text style={styles.subtitle}>
          ¿Listo para tu próxima aventura?
        </Text>
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <View style={styles.iconCircle}>
              <Ionicons name="airplane-outline" size={22} color="#fff" />
            </View>
            <Text style={styles.statNumber}>{trips.length}</Text>
            <Text style={styles.statLabel}>Viajes</Text>
          </View>
          <View style={styles.statCard}>
            <View style={styles.iconCircle}>
              <Ionicons name="location-outline" size={22} color="#fff" />
            </View>
            <Text style={styles.statNumber}>{uniqueCountries.length}</Text>
            <Text style={styles.statLabel}>Países</Text>
          </View>
          <View style={styles.statCard}>
            <View style={styles.iconCircle}>
              <Ionicons name="walk-outline" size={22} color="#fff" />
            </View>
            <Text style={styles.statNumber}>{totalStops}</Text>
            <Text style={styles.statLabel}>Paradas</Text>
          </View>
        </View>
      </LinearGradient>

      <SafeAreaView style={{ flex: 1 }}>
        {/* Búsqueda */}
        {trips.length > 0 && (
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar viaje o país..."
            placeholderTextColor="#94A3B8"
            value={search}
            onChangeText={setSearch}
          />
        )}

        {/* Empty State */}
        {trips.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="airplane-outline" size={64} color="#2563eb" style={{ marginBottom: 16 }} />
            <Text style={styles.emptyTitle}>
              ¡Todavía no creaste ningún viaje!
            </Text>
            <TouchableOpacity
              style={styles.emptyButton}
              onPress={() => router.push('/(main)/new-trip')}
            >
              <Text style={styles.emptyButtonText}>Crear mi primer viaje</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <FlatList
            data={filteredTrips}
            keyExtractor={item => item.trip_id}
            renderItem={renderItem}
            contentContainerStyle={styles.list}
            showsVerticalScrollIndicator={false}
          />
        )}
      </SafeAreaView>

      {/* FAB clásico para crear viaje */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => router.push('/(main)/new-trip')}
        activeOpacity={0.7}
      >
        <Ionicons name="add" size={38} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  loader: { flex: 1, alignItems: 'center', justifyContent: 'center' },

  headerBg: {
    paddingTop: 65,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  greeting: {
    color: '#fff',
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subtitle: {
    color: '#e0e7ef',
    fontSize: 15,
    marginBottom: 24,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statCard: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.08)', // transparencia
    borderRadius: 16,
    alignItems: 'center',
    marginHorizontal: 6,
    paddingVertical: 18,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.25)', // borde sutil
  },
  iconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255,255,255,0.18)', // círculo translúcido
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  statNumber: {
    fontSize: 32,
    fontWeight: '900',
    color: '#fff',
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 14,
    color: '#e0e7ef',
    fontWeight: '600',
    marginTop: 2,
  },

  header: {
    paddingHorizontal: 24,
    paddingBottom: 40,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 1,
  },
  headerTitle: { fontSize: 35, fontWeight: '700', color: '#FFFFFF' },

  list: { padding: 16, paddingBottom: 120 },

  card: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#2563eb',
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#E0E7EF',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 19,
    fontWeight: '700',
    color: '#1e293b',
    letterSpacing: 0.2,
  },
  chipRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  countryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EEF2FF',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 3,
    alignSelf: 'flex-start',
  },
  countryText: {
    color: '#2563eb',
    fontWeight: '600',
    fontSize: 13,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  stopsBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  stopsText: {
    marginLeft: 5,
    fontSize: 13,
    color: '#334155',
    fontWeight: '500',
  },
  createdAt: {
    marginLeft: 10,
    color: '#64748B',
    fontSize: 12,
  },
  fab: {
    position: 'absolute',
    bottom: 32,
    right: 32,
    backgroundColor: '#2563eb',
    borderRadius: 32,
    width: 64,
    height: 64,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#2563eb',
    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 4,
    zIndex: 10,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 60,
  },
  emptyTitle: {
    fontSize: 20,
    color: '#64748B',
    fontWeight: '600',
    marginBottom: 12,
    textAlign: 'center',
  },
  emptyButton: {
    backgroundColor: '#2563eb',
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 36,
    marginTop: 10,
    shadowColor: '#2563eb',
    shadowOpacity: 0.13,
    shadowRadius: 8,
    elevation: 2,
  },
  emptyButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 18,
    marginBottom: 6,
  },
  summaryItem: {
    alignItems: 'center',
  },
  summaryValue: {
    fontWeight: '700',
    color: '#2563eb',
    fontSize: 24,
  },
  summaryLabel: {
    color: '#64748B',
    fontSize: 12,
  },
  searchInput: {
    backgroundColor: '#EEF2FF',
    borderRadius: 10,
    padding: 10,
    marginHorizontal: 16,
    fontSize: 15,
    color: '#334155',
    marginTop: -30,
  },
});