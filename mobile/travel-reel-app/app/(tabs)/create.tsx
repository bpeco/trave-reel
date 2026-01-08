// app/(tabs)/create.tsx

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  ScrollView,
  Linking,
  Alert,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { MapPin, Clock, Send, CircleAlert as AlertCircle } from 'lucide-react-native';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

const BACKEND_URL = 'http://192.168.0.18:8080';


interface ItineraryItem {
  order: number;
  place: string;
  duration_minutes?: number;
  notes?: string;
}
interface ItineraryCreateResponse {
  itinerary_id: string;
  ordered: ItineraryItem[];
  route_link: string;
}
interface Trip {
  trip_id: string;
  name: string;
}

export default function CreateScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const insets = useSafeAreaInsets();

  const [url, setUrl] = useState('');
  const [city, setCity] = useState('');
  const [trips, setTrips] = useState<Trip[]>([]);
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);
  const [openDropdown, setOpenDropdown] = useState(false);

  const [loading, setLoading] = useState(false);
  const [itinerary, setItinerary] = useState<ItineraryItem[]>([]);
  const [routeLink, setRouteLink] = useState<string | null>(null);
  const [itineraryId, setItineraryId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    fetch(`${BACKEND_URL}/api/trips?created_by=${user.id}`)
      .then(res => res.json())
      .then((data: Trip[]) => setTrips(data))
      .finally(() => setLoading(false));
  }, [user]);

  const validate = () => {
    if (!url.trim() || !city.trim()) {
      Alert.alert('Atención', 'Completa URL, ciudad y viaje');
      return false;
    }
    return true;
  };

  const generateItinerary = async () => {
    if (!validate()) return;
    setLoading(true);
    setError(null);

    try {
      const res = await axios.post<ItineraryCreateResponse>(
        `${BACKEND_URL}/api/itineraries`,
        { url: url.trim(), city: city.trim() }
      );
      setItinerary(res.data.ordered);
      setRouteLink(res.data.route_link);
      setItineraryId(res.data.itinerary_id);
    } catch (e: any) {
      setError(e.response?.data?.detail || e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToMyTrips = async () => {
    if (!itineraryId || !selectedTrip) return;
    try {
      await axios.post(`${BACKEND_URL}/api/itineraries/${itineraryId}/trips`, {
        trip_id: selectedTrip.trip_id,
      });
      Alert.alert('¡Éxito!', 'Itinerario agregado a tu viaje');
      router.push('/'); // redirige a "Mis Viajes"
    } catch (e: any) {
      Alert.alert('Error', e.response?.data?.detail || e.message);
    }
  };

  const renderItineraryItem = ({
    item,
    index,
  }: {
    item: ItineraryItem;
    index: number;
  }) => {
    const isLast = index === itinerary.length - 1;
    return (
      <View style={styles.timelineContainer}>
        <View style={styles.timelineLeft}>
          <View style={styles.timelineNumber}>
            <Text style={styles.timelineNumberText}>{index + 1}</Text>
          </View>
          {!isLast && <View style={styles.timelineLine} />}
        </View>
        <View style={styles.itineraryCard}>
          <View style={styles.cardHeader}>
            <View style={styles.cardTitleContainer}>
              <MapPin size={16} color="#FF6B6B" strokeWidth={2} />
              <Text style={styles.cardTitle}>{item.place}</Text>
            </View>
            {item.duration_minutes != null && (
              <View style={styles.timeContainer}>
                <Clock size={14} color="#64748B" strokeWidth={2} />
                <Text style={styles.timeText}>{item.duration_minutes} min</Text>
              </View>
            )}
          </View>
          {item.notes && (
            <View style={styles.notesContainer}>
              <Text style={styles.notesLabel}>Notas:</Text>
              <Text style={styles.notesText}>{item.notes}</Text>
            </View>
          )}
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Fondo gradiente absolutamente posicionado para cubrir safe area */}
      <LinearGradient
        colors={['#FF6B6B', '#FF8E53']}
        style={[styles.headerBg, { height: 140 + insets.top }]}
      />
      <SafeAreaView style={{ flex: 1 }}>
        <View style={[styles.header, { paddingTop: insets.top }]}>
          <Text style={styles.headerTitle}>Crear Itinerario</Text>
          <Text style={styles.headerSubtitle}>
            Transforma videos en aventuras reales 🎬✨
          </Text>
        </View>

        <ScrollView style={styles.content}>
          {/* URL */}
          <View style={styles.formContainer}>
            <Text style={styles.label}>URL del Video</Text>
            <TextInput
              style={styles.input}
              placeholder="TikTok o Instagram"
              value={url}
              onChangeText={setUrl}
              autoCapitalize="none"
              keyboardType="url"
              placeholderTextColor="#9CA3AF"
            />
          </View>

          {/* Ciudad */}
          <View style={styles.formContainer}>
            <Text style={styles.label}>Ciudad de Destino</Text>
            <TextInput
              style={styles.input}
              placeholder="¿A dónde vamos?"
              value={city}
              onChangeText={setCity}
              autoCapitalize="words"
              placeholderTextColor="#9CA3AF"
            />
          </View>

          {/* Generar Itinerario */}
          <TouchableOpacity
            style={[styles.generateButton, loading && styles.disabled]}
            onPress={generateItinerary}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <View style={styles.generateButtonContent}>
                <Send size={20} color="#fff" strokeWidth={2} />
                <Text style={styles.generateButtonText}>Generar Itinerario</Text>
              </View>
            )}
          </TouchableOpacity>

          {error && (
            <View style={styles.globalErrorContainer}>
              <AlertCircle size={20} color="#EF4444" strokeWidth={2} />
              <Text style={styles.globalErrorText}>{error}</Text>
            </View>
          )}

          {/* Resultados */}
          {itinerary.length > 0 && (
            <View style={styles.results}>
              <FlatList
                data={itinerary}
                keyExtractor={(i) => i.order.toString()}
                renderItem={renderItineraryItem}
                scrollEnabled={false}
              />

              {/* Asignar a Viaje */}
              <View style={styles.formContainer}>
                <Text style={styles.label}>Asignar a Viaje</Text>
                <TouchableOpacity
                  style={styles.selectorButton}
                  onPress={() => setOpenDropdown((v) => !v)}
                >
                  <MapPin size={20} color="#64748B" strokeWidth={2} />
                  <Text
                    style={[
                      styles.selectorText,
                      !selectedTrip && styles.placeholder,
                    ]}
                  >
                    {selectedTrip?.name ?? 'Selecciona un viaje'}
                  </Text>
                </TouchableOpacity>
                {openDropdown && (
                  <View style={styles.dropdownInline}>
                    {trips.map((t) => (
                      <TouchableOpacity
                        key={t.trip_id}
                        style={styles.dropdownItem}
                        onPress={() => {
                          setSelectedTrip(t);
                          setOpenDropdown(false);
                        }}
                      >
                        <Text style={styles.dropdownText}>{t.name}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>

              {/* Agregar a mi viaje */}
              <TouchableOpacity
                style={[styles.addButton, loading && styles.disabled]}
                onPress={handleAddToMyTrips}
                disabled={loading}
              >
                <Text style={styles.addButtonText}>
                  Agregar a mi viaje
                </Text>
              </TouchableOpacity>

              {routeLink && (
                <TouchableOpacity
                  style={styles.openMaps}
                  onPress={() => Linking.openURL(routeLink!)}
                >
                  <MapPin size={20} color="#fff" strokeWidth={2} />
                  <Text style={styles.openMapsText}>
                    Abrir en Google Maps
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  headerBg: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    zIndex: 0,
  },
  header: {
    paddingHorizontal: 24,
    paddingBottom: 24,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    zIndex: 1,
  },
  headerTitle: { fontSize: 32, fontWeight: '800', color: '#FFFFFF' },
  headerSubtitle: { fontSize: 16, color: '#FFE5E5', marginTop: 4 },
  content: { paddingHorizontal: 16, flex: 1 },
  formContainer: {
    padding: 24,
    backgroundColor: '#FFFFFF',
    margin: 16,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  label: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 8,
  },
  input: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 16,
    color: '#1F2937',
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
  },
  generateButton: {
    backgroundColor: '#FF6B6B',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 16,
    alignItems: 'center',
    marginTop: 16,
    shadowColor: '#FF6B6B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  disabled: {
    opacity: 0.7,
  },
  generateButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  generateButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    marginLeft: 8,
  },
  globalErrorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF2F2',
    borderColor: '#FECACA',
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    margin: 16,
    marginTop: 0,
  },
  globalErrorText: {
    fontSize: 14,
    color: '#DC2626',
    marginLeft: 8,
    flex: 1,
    fontWeight: '500',
  },
  results: {
    paddingHorizontal: 16,
    paddingBottom: 32,
  },
  timelineContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  timelineLeft: {
    alignItems: 'center',
    marginRight: 16,
  },
  timelineNumber: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FF6B6B',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
    shadowColor: '#FF6B6B',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  timelineNumberText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  timelineLine: {
    width: 3,
    flex: 1,
    backgroundColor: '#E5E7EB',
    marginTop: 8,
    borderRadius: 2,
  },
  itineraryCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  cardTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginLeft: 8,
    flex: 1,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  timeText: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '600',
    marginLeft: 4,
  },
  notesContainer: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 16,
    marginTop: 12,
  },
  notesLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 6,
  },
  notesText: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  selectorButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderRadius: 16,
    padding: 16,
    backgroundColor: '#FFF',
  },
  selectorText: { marginLeft: 12, fontSize: 16, color: '#1F2937' },
  placeholder: { color: '#9CA3AF' },
  dropdownInline: {
    marginTop: 4,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
  },
  dropdownItem: { padding: 12, borderBottomWidth: 1, borderBottomColor: '#EEE' },
  dropdownText: { fontSize: 16, color: '#1F2937' },
  addButton: {
    backgroundColor: '#FF6B6B',
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    marginTop: 16,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  openMaps: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4ECDC4',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 16,
    marginTop: 16,
  },
  openMapsText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 16,
    marginLeft: 8,
  },
});