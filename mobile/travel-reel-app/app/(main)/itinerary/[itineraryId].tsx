import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  StyleSheet,
  Linking,
  SafeAreaView,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { MapPin, Clock } from 'lucide-react-native';
import axios from 'axios';
import { Ionicons } from '@expo/vector-icons';
import { Animated } from 'react-native';

const BACKEND_URL = 'http://192.168.0.14:8000';

interface ItineraryItem {
  order: number;
  place: string;
  duration_minutes?: number;
  notes?: string | null;
}

export default function ItineraryDetailScreen() {
  const { itineraryId } = useLocalSearchParams<{ itineraryId: string }>();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<ItineraryItem[]>([]);
  const [routeLink, setRouteLink] = useState<string | null>(null);

  useEffect(() => {
    if (!itineraryId) return;
    setLoading(true);

    axios.get(`${BACKEND_URL}/api/itineraries/${itineraryId}`)
      .then(res => {
        setItems(res.data.ordered);
        setRouteLink(res.data.route_link);
      })
      .catch(err => {
        setItems([]);
        setRouteLink(null);
      })
      .finally(() => setLoading(false));
  }, [itineraryId]);

  const renderItineraryItem = ({ item, index }: { item: ItineraryItem; index: number }) => {
    const isLast = index === items.length - 1;
    const delay = index * 200;

    return (
      <AnimatedStop delay={delay} showLine={!isLast} isLast={isLast}>
        {/* children[0]: círculo con número */}
        <Text style={styles.timelineNumberText}>{item.order}</Text>
        {/* children[1]: card */}
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
      </AnimatedStop>
    );
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#FF6B6B" />
      </View>
    );
  }

  const canOpenMaps = items.length <= 7;

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <LinearGradient
        colors={['#FF6B6B', '#FF8E53']}
        style={styles.header}
        pointerEvents="none"
      >
        <View style={styles.headerContent}>
          <TouchableOpacity
            onPress={() => {
              // Si puede volver, vuelve. Si no, navega a la raíz o a la pantalla de viajes.
              if (router.canGoBack?.()) {
                router.back();
              } else {
                router.replace('/(main)/new-trip'); // Cambia esta ruta por la que corresponda a tu home de viajes
              }
            }}
          >
            <Ionicons name="chevron-back-circle" size={32} color="#fff" />
          </TouchableOpacity>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Detalle del Itinerario</Text>
          </View>
          {/* Espacio para mantener el título centrado */}
          <View style={{ width: 32 }} />
        </View>
      </LinearGradient>
      <SafeAreaView style={{ flex: 1 }}>
        <FlatList
          data={items}
          keyExtractor={item => item.order.toString()}
          renderItem={renderItineraryItem}
          contentContainerStyle={{ paddingBottom: 24, paddingTop: 12, paddingHorizontal: 0 }}
          style={{ flex: 1 }}
          ListFooterComponent={
            <View style={{ marginTop: 16 }}>
              {routeLink && (
                <TouchableOpacity
                  style={[
                    styles.openMaps,
                    !canOpenMaps && { backgroundColor: '#CBD5E1' }
                  ]}
                  onPress={() => {
                    if (canOpenMaps) Linking.openURL(routeLink);
                  }}
                  disabled={!canOpenMaps}
                  activeOpacity={canOpenMaps ? 0.8 : 1}
                >
                  <MapPin size={20} color="#fff" strokeWidth={2} />
                  <Text style={styles.openMapsText}>
                    Abrir en Google Maps
                  </Text>
                </TouchableOpacity>
              )}
              {!canOpenMaps && (
                <Text style={styles.mapsWarning}>
                  Solo se puede abrir en Google Maps si el itinerario tiene menos de 8 paradas.
                </Text>
              )}
            </View>
          }
        />
      </SafeAreaView>
    </View>
  );
}

export const options = {
  headerShown: false,
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  header: {
    paddingHorizontal: 24,
    paddingTop: 56,
    paddingBottom: 40,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    shadowColor: '#FF6B6B',
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 24,
  },
  titleContainer: {
    flex: 1,
    marginHorizontal: 16,
    alignItems: 'center',
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: '#fff',
    letterSpacing: 0.5,
  },
  timelineContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    marginHorizontal: 8,
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
  openMaps: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4ECDC4',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 16,
    marginTop: 16,
    marginHorizontal: 24,
  },
  openMapsText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 16,
    marginLeft: 8,
  },
  mapsWarning: {
    color: '#FF6B6B',
    fontWeight: '600',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
    marginHorizontal: 24,
  },
});

type AnimatedStopProps = {
  children: React.ReactNode[];
  delay: number;
  showLine?: boolean;
  isLast?: boolean;
};

function AnimatedStop({ children, delay, showLine, isLast }: AnimatedStopProps) {
  const slideAnim = useRef(new Animated.Value(-60)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const circleScale = useRef(new Animated.Value(0.7)).current;
  const circleOpacity = useRef(new Animated.Value(0)).current;
  const lineHeight = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Card slide+scale+fade
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 420,
        delay,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        delay,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 300,
        delay,
        useNativeDriver: true,
      }),
    ]).start();

    // Círculo rojo con número
    Animated.parallel([
      Animated.spring(circleScale, {
        toValue: 1,
        delay: delay + 100,
        friction: 6,
        useNativeDriver: true,
      }),
      Animated.timing(circleOpacity, {
        toValue: 1,
        duration: 200,
        delay: delay + 100,
        useNativeDriver: true,
      }),
    ]).start();

    // Línea vertical
    if (showLine && !isLast) {
      Animated.timing(lineHeight, {
        toValue: 1,
        duration: 600,
        delay: delay + 550,
        useNativeDriver: false,
      }).start();
    }
  }, [delay, showLine, isLast]);

  return (
    <Animated.View
      style={{
        flexDirection: 'row',
        marginBottom: 16,
        marginHorizontal: 8,
        opacity: opacityAnim,
        transform: [{ translateX: slideAnim }, { scale: scaleAnim }],
      }}
    >
      {/* Timeline left */}
      <View style={{ alignItems: 'center', marginRight: 16 }}>
        {/* Círculo animado */}
        <Animated.View
          style={{
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
            marginTop: 6,
            marginBottom: 6,
            opacity: circleOpacity,
            transform: [{ scale: circleScale }],
          }}
        >
          {children[0]}
        </Animated.View>
        {/* Línea animada */}
        {showLine && !isLast && (
          <Animated.View
            style={{
              width: 3,
              marginTop: 8,
              marginBottom: 8,
              borderRadius: 2,
              backgroundColor: '#E5E7EB',
              height: lineHeight.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 120], // Ajustá 28 según el espacio visual que prefieras
              }),
            }}
          />
        )}
      </View>
      {/* Card */}
      <View style={{ flex: 1 }}>{children[1]}</View>
    </Animated.View>
  );
}