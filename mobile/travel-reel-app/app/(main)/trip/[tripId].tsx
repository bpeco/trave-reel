// app/(tabs)/trip/[tripId].tsx
import React, { useState, useEffect, useRef } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Animated, // <-- Agrega esto
} from 'react-native'
import { useLocalSearchParams, useRouter } from 'expo-router'
import axios from 'axios'
import { ArrowRight } from 'lucide-react-native'
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'
import * as Haptics from 'expo-haptics'

const BACKEND_URL = 'http://192.168.0.18:8080';

const formatItineraryDate = (iso: string) =>
  new Date(iso)
    .toLocaleDateString('es-ES', { day: '2-digit', month: 'short' })
    .replace(/\.$/, '')

// Tipos de datos
interface TripStats {
  itineraries_count: number
  stops_count: number
}

interface ItineraryListItem {
  itinerary_id: string
  added_at: string
  description: string
  count_stops: number
  avg_time: number
  itinerary_date: string
  categories: string[]
}

const CATEGORY_CONFIG = {
  cultura: {
    icon: 'business-outline',
    color: '#fbbf24',
  },
  gastronomia: {
    icon: 'restaurant-outline',
    color: '#f87171',
  },
  naturaleza: {
    icon: 'leaf-outline',
    color: '#34d399',
  },
  iconico: {
    icon: 'camera',
    color: '#818cf8',
  },
  compras: {
    icon: 'bag-outline',
    color: '#38bdf8',
  },
} as const;

type CategoryKey = keyof typeof CATEGORY_CONFIG;

export default function TripItinerariesScreen() {
  const router = useRouter()
  const { tripId, name, country } = useLocalSearchParams<{
    tripId: string
    name: string
    country: string
  }>()

  const [stats, setStats] = useState<TripStats | null>(null)
  const [list, setList] = useState<ItineraryListItem[]>([])
  const [loading, setLoading] = useState(true)

  // Animaciones para los stats
  const itinerariesAnim = useRef(new Animated.Value(0)).current
  const stopsAnim = useRef(new Animated.Value(0)).current

  // Estados para mostrar el número animado
  const [itinerariesCount, setItinerariesCount] = useState(0)
  const [stopsCount, setStopsCount] = useState(0)

  useEffect(() => {
    let lastItineraries = 0
    let lastStops = 0

    const itListener = itinerariesAnim.addListener(({ value }) => {
      const rounded = Math.floor(value)
      setItinerariesCount(rounded)
      if (rounded !== lastItineraries) {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium) // Más intenso
        lastItineraries = rounded
      }
    })
    const stListener = stopsAnim.addListener(({ value }) => {
      const rounded = Math.floor(value)
      setStopsCount(rounded)
      if (rounded !== lastStops) {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium) // Más intenso
        lastStops = rounded
      }
    })
    return () => {
      itinerariesAnim.removeListener(itListener)
      stopsAnim.removeListener(stListener)
    }
  }, [itinerariesAnim, stopsAnim])

  useEffect(() => {
    if (stats) {
      Animated.timing(itinerariesAnim, {
        toValue: stats.itineraries_count,
        duration: 1000,
        useNativeDriver: false,
      }).start()
      Animated.timing(stopsAnim, {
        toValue: stats.stops_count,
        duration: 1500,
        useNativeDriver: false,
      }).start()
    }
  }, [stats])

  useEffect(() => {
    if (!tripId) return

    const fetchData = async () => {
      try {
        const [statsRes, listRes] = await Promise.all([
          axios.get<TripStats>(`${BACKEND_URL}/api/trips/${tripId}/stats`),
          axios.get<ItineraryListItem[]>(
            `${BACKEND_URL}/api/trips/${tripId}/itineraries`
          ),
        ])
        setStats(statsRes.data)
        setList(listRes.data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [tripId])

  if (loading || !stats) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    )
  }

  return (
    <View style={styles.container}>
      {/* Header with gradient */}
      <LinearGradient
        colors={['#0d9488', '#059669']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="chevron-back-circle" size={32} color="#fff" />
          </TouchableOpacity>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>{name}</Text>
            <Text style={styles.subtitle}>{country}</Text>
          </View>
          <TouchableOpacity
            onPress={() =>
              router.push({ pathname: '/create', params: { tripId } })
            }
          >
            <Ionicons name="add-circle-outline" size={32} color="#fff" />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {/* Stats and list on light background */}
      <View style={styles.content}>
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Animated.Text style={styles.statNumber}>
              {itinerariesCount}
            </Animated.Text>
            <Text style={styles.statLabel}>Itinerarios</Text>
          </View>
          <View style={styles.statCard}>
            <Animated.Text style={styles.statNumber}>
              {stopsCount}
            </Animated.Text>
            <Text style={styles.statLabel}>Paradas</Text>
          </View>
        </View>

        <FlatList
          data={list}
          keyExtractor={(item) => item.itinerary_id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.card}
            onPress={() => router.push(`/itinerary/${item.itinerary_id}`)}>
              {/* Ícono de path */}
              <View style={styles.pathIconCircle}>
                <Ionicons name="git-branch-outline" size={28} color="#fff" />
              </View>
              <View style={styles.cardText}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Text style={styles.cardTitle}>{item.description}</Text>
                  {/* Badges de categorías */}
                  <View style={{ flexDirection: 'row', marginLeft: 8 }}>
                    {item.categories
                      ?.map((cat: string) => cat.trim().toLowerCase())
                      .filter((cat): cat is CategoryKey => cat in CATEGORY_CONFIG)
                      .map((cat, idx) => {
                        const conf = CATEGORY_CONFIG[cat];
                        return (
                          <AnimatedBadge key={cat + idx} delay={idx * 120}>
                            <View
                              style={[
                                styles.categoryBadge,
                                { backgroundColor: conf.color }
                              ]}
                            >
                              <Ionicons name={conf.icon as any} size={16} color="#fff" />
                            </View>
                          </AnimatedBadge>
                        );
                      })}
                  </View>
                </View>
                <View style={styles.infoRow}>
                  <View style={styles.infoItem}>
                    <Ionicons name="location-outline" size={16} color="#667085" />
                    <Text style={styles.infoText}>{item.count_stops}</Text>
                  </View>
                  <View style={styles.infoItem}>
                    <Ionicons name="time-outline" size={16} color="#667085" />
                    <Text style={styles.infoText}>{item.avg_time} h</Text>
                  </View>
                  <View style={styles.infoItem}>
                    <Ionicons name="calendar-outline" size={16} color="#667085" />
                    <Text style={styles.infoText}>
                      {formatItineraryDate(item.itinerary_date)}
                    </Text>
                  </View>
                </View>
              </View>
              <ArrowRight size={20} color="#667085" />
            </TouchableOpacity>
          )}
        />
      </View>
    </View>
  )
}

interface AnimatedBadgeProps {
  children: React.ReactNode;
  delay?: number;
}

const AnimatedBadge = ({ children, delay = 0 }: AnimatedBadgeProps) => {
  const scale = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
      delay,
      friction: 6,
    }).start();
  }, [scale, delay]);

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      {children}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F3F4F6',
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        paddingHorizontal: 24,
        paddingTop: 56,
        paddingBottom: 40,
        borderBottomLeftRadius: 32,
        borderBottomRightRadius: 32,
        shadowColor: '#0d9488',
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
    },
    title: {
        fontSize: 26,
        fontWeight: '800',
        color: '#fff',
        letterSpacing: 0.5,
    },
    subtitle: {
        fontSize: 15,
        color: '#CFFAFE',
        marginTop: 2,
        fontWeight: '500',
    },
    content: {
        flex: 1,
        backgroundColor: '#F3F4F6',
        paddingTop: 20,
    },
    statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 24,
        marginBottom: 12,
    },
    statCard: {
        flex: 1,
        backgroundColor: '#fff',
        marginHorizontal: 8,
        borderRadius: 18,
        paddingVertical: 20,
        alignItems: 'center',
        shadowColor: '#0d9488',
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 4,
        borderWidth: 1,
        borderColor: '#E0F2F1',
    },
    statNumber: {
        fontSize: 26,
        fontWeight: 'bold',
        color: '#0d9488',
        marginBottom: 2,
    },
    statLabel: {
        fontSize: 15,
        color: '#64748B',
        marginTop: 2,
        fontWeight: '500',
        letterSpacing: 0.2,
    },
    list: {
        paddingTop: 10,
        paddingHorizontal: 12,
        paddingBottom: 32,
    },
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 18,
        marginBottom: 14,
        shadowColor: '#0d9488',
        shadowOpacity: 0.06,
        shadowRadius: 6,
        elevation: 2,
        borderWidth: 1,
        borderColor: '#E0F2F1',
    },
    pathIconCircle: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#10b981',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
    },
    cardText: {
        flex: 1,
    },
    cardTitle: {
        fontSize: 17,
        fontWeight: '700',
        color: '#0f172a',
        marginBottom: 2,
        letterSpacing: 0.2,
    },
    infoRow: {
        flexDirection: 'row',
        marginTop: 8,
    },
    infoItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 18,
        backgroundColor: '#F1F5F9',
        borderRadius: 8,
        paddingHorizontal: 8,
        paddingVertical: 2,
    },
    infoText: {
        fontSize: 13,
        color: '#334155',
        marginLeft: 5,
        fontWeight: '500',
    },
    categoryBadge: {
        width: 26,
        height: 26,
        borderRadius: 13,
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 4,
    },
})
