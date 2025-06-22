import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ImageBackground,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { 
  MapPin, 
  Plus, 
  Calendar, 
  Route,
  MoreVertical,
  Trash2,
  Edit3
} from 'lucide-react-native';

const { width } = Dimensions.get('window');

interface Trip {
  id: string;
  name: string;
  description?: string;
  itineraryCount: number;
  lastUpdated: string;
  imageUrl: string;
}

export default function TripsScreen() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [showActions, setShowActions] = useState<string | null>(null);
  const fadeAnim = new Animated.Value(0);

  useEffect(() => {
    // Mock data - replace with real data later
    const mockTrips: Trip[] = [
      {
        id: '1',
        name: 'París',
        description: 'Ciudad del amor y la luz',
        itineraryCount: 3,
        lastUpdated: '2024-01-15T10:30:00Z',
        imageUrl: 'https://images.pexels.com/photos/338515/pexels-photo-338515.jpeg',
      },
      {
        id: '2',
        name: 'Tokyo',
        description: 'Tradición y modernidad',
        itineraryCount: 2,
        lastUpdated: '2024-01-10T14:20:00Z',
        imageUrl: 'https://images.pexels.com/photos/2506923/pexels-photo-2506923.jpeg',
      },
      {
        id: '3',
        name: 'Barcelona',
        description: 'Arte y arquitectura mediterránea',
        itineraryCount: 1,
        lastUpdated: '2024-01-05T09:15:00Z',
        imageUrl: 'https://images.pexels.com/photos/1388030/pexels-photo-1388030.jpeg',
      },
    ];
    setTrips(mockTrips);

    // Animate entrance
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return 'Hace 1 día';
    if (diffDays < 7) return `Hace ${diffDays} días`;
    if (diffDays < 30) return `Hace ${Math.ceil(diffDays / 7)} semanas`;
    return `Hace ${Math.ceil(diffDays / 30)} meses`;
  };

  const deleteTrip = (id: string) => {
    setTrips(prev => prev.filter(trip => trip.id !== id));
    setShowActions(null);
  };

  const renderTripCard = ({ item, index }: { item: Trip; index: number }) => (
    <Animated.View 
      style={[
        styles.tripCard,
        {
          opacity: fadeAnim,
          transform: [{
            translateY: fadeAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [50, 0],
            }),
          }],
        }
      ]}
    >
      <TouchableOpacity
        onPress={() => router.push(`/trip-detail/${item.id}`)}
        style={styles.cardTouchable}
      >
        <ImageBackground
          source={{ uri: item.imageUrl }}
          style={styles.cardBackground}
          imageStyle={styles.cardImage}
        >
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.8)']}
            style={styles.cardGradient}
          >
            <View style={styles.cardHeader}>
              <TouchableOpacity
                onPress={() => setShowActions(showActions === item.id ? null : item.id)}
                style={styles.moreButton}
              >
                <MoreVertical size={20} color="#FFFFFF" strokeWidth={2} />
              </TouchableOpacity>
            </View>

            <View style={styles.cardContent}>
              <Text style={styles.tripName}>{item.name}</Text>
              {item.description && (
                <Text style={styles.tripDescription}>{item.description}</Text>
              )}
              
              <View style={styles.cardStats}>
                <View style={styles.statItem}>
                  <Route size={16} color="#FF6B6B" strokeWidth={2} />
                  <Text style={styles.statText}>
                    {item.itineraryCount} itinerario{item.itineraryCount !== 1 ? 's' : ''}
                  </Text>
                </View>
                <View style={styles.statItem}>
                  <Calendar size={16} color="#4ECDC4" strokeWidth={2} />
                  <Text style={styles.statText}>{formatDate(item.lastUpdated)}</Text>
                </View>
              </View>
            </View>
          </LinearGradient>
        </ImageBackground>
      </TouchableOpacity>

      {showActions === item.id && (
        <Animated.View style={styles.actionsMenu}>
          <TouchableOpacity style={styles.actionButton}>
            <Edit3 size={16} color="#4F46E5" strokeWidth={2} />
            <Text style={styles.actionText}>Editar</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.actionButton, styles.deleteAction]}
            onPress={() => deleteTrip(item.id)}
          >
            <Trash2 size={16} color="#EF4444" strokeWidth={2} />
            <Text style={[styles.actionText, styles.deleteText]}>Eliminar</Text>
          </TouchableOpacity>
        </Animated.View>
      )}
    </Animated.View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <View style={styles.emptyIconContainer}>
        <MapPin size={64} color="#FF6B6B" strokeWidth={1.5} />
      </View>
      <Text style={styles.emptyTitle}>¡Comienza tu aventura!</Text>
      <Text style={styles.emptySubtitle}>
        Crea tu primer viaje y empieza a planificar experiencias increíbles
      </Text>
      <TouchableOpacity 
        style={styles.createFirstTripButton}
        onPress={() => router.push('/create-trip')}
      >
        <LinearGradient
          colors={['#FF6B6B', '#FF8E53']}
          style={styles.createFirstTripGradient}
        >
          <Plus size={20} color="#FFFFFF" strokeWidth={2} />
          <Text style={styles.createFirstTripText}>Crear mi primer viaje</Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#667eea', '#764ba2']}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>Mis Viajes</Text>
        <Text style={styles.headerSubtitle}>
          Descubre el mundo, un video a la vez ✨
        </Text>
      </LinearGradient>

      <View style={styles.content}>
        {trips.length > 0 ? (
          <>
            <View style={styles.statsContainer}>
              <Text style={styles.statsText}>
                {trips.length} viaje{trips.length !== 1 ? 's' : ''} creado{trips.length !== 1 ? 's' : ''}
              </Text>
            </View>
            <FlatList
              data={trips}
              keyExtractor={(item) => item.id}
              renderItem={renderTripCard}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.listContainer}
            />
          </>
        ) : (
          renderEmptyState()
        )}
      </View>

      <TouchableOpacity 
        style={styles.fab}
        onPress={() => router.push('/create-trip')}
      >
        <LinearGradient
          colors={['#FF6B6B', '#FF8E53']}
          style={styles.fabGradient}
        >
          <Plus size={24} color="#FFFFFF" strokeWidth={2} />
        </LinearGradient>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    paddingHorizontal: 24,
    paddingVertical: 32,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#E0E7FF',
    opacity: 0.9,
  },
  content: {
    flex: 1,
    paddingTop: 16,
  },
  statsContainer: {
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  statsText: {
    fontSize: 16,
    color: '#64748B',
    fontWeight: '600',
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingBottom: 100,
  },
  tripCard: {
    marginBottom: 20,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  cardTouchable: {
    height: 200,
  },
  cardBackground: {
    flex: 1,
  },
  cardImage: {
    borderRadius: 20,
  },
  cardGradient: {
    flex: 1,
    justifyContent: 'space-between',
    padding: 20,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  moreButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 20,
    padding: 8,
  },
  cardContent: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  tripName: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  tripDescription: {
    fontSize: 16,
    color: '#E0E7FF',
    marginBottom: 16,
  },
  cardStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statText: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '600',
    marginLeft: 6,
  },
  actionsMenu: {
    position: 'absolute',
    top: 60,
    right: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
    zIndex: 10,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  deleteAction: {
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  actionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4F46E5',
    marginLeft: 8,
  },
  deleteText: {
    color: '#EF4444',
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  emptyIconContainer: {
    backgroundColor: '#FFF5F5',
    borderRadius: 40,
    padding: 20,
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 12,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  createFirstTripButton: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  createFirstTripGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  createFirstTripText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    marginLeft: 8,
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    borderRadius: 28,
    shadowColor: '#FF6B6B',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  fabGradient: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
});