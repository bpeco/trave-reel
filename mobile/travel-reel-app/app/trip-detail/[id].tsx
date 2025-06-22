import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import { 
  ArrowLeft, 
  Plus, 
  Route, 
  Calendar, 
  MapPin,
  MoreVertical,
  Edit3,
  Trash2,
  ExternalLink
} from 'lucide-react-native';

interface Itinerary {
  id: string;
  name: string;
  videoUrl: string;
  itemCount: number;
  createdAt: string;
  routeLink?: string;
}

interface Trip {
  id: string;
  name: string;
  description?: string;
  itineraries: Itinerary[];
}

export default function TripDetailScreen() {
  const { id } = useLocalSearchParams();
  const [trip, setTrip] = useState<Trip | null>(null);
  const [showActions, setShowActions] = useState<string | null>(null);

  useEffect(() => {
    // Mock data - replace with real API call
    const mockTrip: Trip = {
      id: id as string,
      name: 'París',
      description: 'Ciudad del amor y la luz',
      itineraries: [
        {
          id: '1',
          name: '10 lugares imperdibles en París',
          videoUrl: 'https://tiktok.com/sample1',
          itemCount: 8,
          createdAt: '2024-01-15T10:30:00Z',
          routeLink: 'https://maps.google.com/sample1',
        },
        {
          id: '2',
          name: 'París en 1 día - Lo esencial',
          videoUrl: 'https://instagram.com/sample2',
          itemCount: 6,
          createdAt: '2024-01-10T14:20:00Z',
          routeLink: 'https://maps.google.com/sample2',
        },
        {
          id: '3',
          name: 'Cafés parisinos que debes visitar',
          videoUrl: 'https://tiktok.com/sample3',
          itemCount: 5,
          createdAt: '2024-01-05T09:15:00Z',
        },
      ],
    };
    setTrip(mockTrip);
  }, [id]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const deleteItinerary = (itineraryId: string) => {
    Alert.alert(
      'Eliminar Itinerario',
      '¿Estás seguro que quieres eliminar este itinerario?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () => {
            setTrip(prev => prev ? {
              ...prev,
              itineraries: prev.itineraries.filter(it => it.id !== itineraryId)
            } : null);
            setShowActions(null);
          },
        },
      ]
    );
  };

  const renderItineraryCard = ({ item }: { item: Itinerary }) => (
    <View style={styles.itineraryCard}>
      <TouchableOpacity
        style={styles.cardContent}
        onPress={() => router.push(`/itinerary-detail/${item.id}`)}
      >
        <View style={styles.cardHeader}>
          <View style={styles.cardTitleContainer}>
            <Text style={styles.cardTitle}>{item.name}</Text>
            <Text style={styles.cardSubtitle} numberOfLines={1}>
              {item.videoUrl}
            </Text>
          </View>
          
          <TouchableOpacity
            onPress={() => setShowActions(showActions === item.id ? null : item.id)}
            style={styles.moreButton}
          >
            <MoreVertical size={20} color="#64748B" strokeWidth={2} />
          </TouchableOpacity>
        </View>

        <View style={styles.cardStats}>
          <View style={styles.statItem}>
            <Route size={16} color="#FF6B6B" strokeWidth={2} />
            <Text style={styles.statText}>
              {item.itemCount} parada{item.itemCount !== 1 ? 's' : ''}
            </Text>
          </View>
          
          <View style={styles.statItem}>
            <Calendar size={16} color="#4ECDC4" strokeWidth={2} />
            <Text style={styles.statText}>{formatDate(item.createdAt)}</Text>
          </View>
        </View>

        {item.routeLink && (
          <View style={styles.routeIndicator}>
            <ExternalLink size={14} color="#10B981" strokeWidth={2} />
            <Text style={styles.routeText}>Ruta disponible</Text>
          </View>
        )}
      </TouchableOpacity>

      {showActions === item.id && (
        <View style={styles.actionsMenu}>
          <TouchableOpacity style={styles.actionButton}>
            <Edit3 size={16} color="#4F46E5" strokeWidth={2} />
            <Text style={styles.actionText}>Editar</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.actionButton, styles.deleteAction]}
            onPress={() => deleteItinerary(item.id)}
          >
            <Trash2 size={16} color="#EF4444" strokeWidth={2} />
            <Text style={[styles.actionText, styles.deleteText]}>Eliminar</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <View style={styles.emptyIconContainer}>
        <Route size={64} color="#FF6B6B" strokeWidth={1.5} />
      </View>
      <Text style={styles.emptyTitle}>Sin itinerarios aún</Text>
      <Text style={styles.emptySubtitle}>
        Crea tu primer itinerario para este viaje desde un video de TikTok o Instagram
      </Text>
      <TouchableOpacity 
        style={styles.createFirstItineraryButton}
        onPress={() => router.push('/create')}
      >
        <LinearGradient
          colors={['#FF6B6B', '#FF8E53']}
          style={styles.createFirstItineraryGradient}
        >
          <Plus size={20} color="#FFFFFF" strokeWidth={2} />
          <Text style={styles.createFirstItineraryText}>Crear primer itinerario</Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );

  if (!trip) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>Cargando...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#667eea', '#764ba2']}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <ArrowLeft size={24} color="#FFFFFF" strokeWidth={2} />
          </TouchableOpacity>
          
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerTitle}>{trip.name}</Text>
            {trip.description && (
              <Text style={styles.headerSubtitle}>{trip.description}</Text>
            )}
          </View>
        </View>
      </LinearGradient>

      <View style={styles.content}>
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Route size={24} color="#FF6B6B" strokeWidth={2} />
            <Text style={styles.statNumber}>{trip.itineraries.length}</Text>
            <Text style={styles.statLabel}>Itinerarios</Text>
          </View>
          
          <View style={styles.statCard}>
            <MapPin size={24} color="#4ECDC4" strokeWidth={2} />
            <Text style={styles.statNumber}>
              {trip.itineraries.reduce((sum, it) => sum + it.itemCount, 0)}
            </Text>
            <Text style={styles.statLabel}>Lugares</Text>
          </View>
        </View>

        {trip.itineraries.length > 0 ? (
          <FlatList
            data={trip.itineraries}
            keyExtractor={(item) => item.id}
            renderItem={renderItineraryCard}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContainer}
          />
        ) : (
          renderEmptyState()
        )}
      </View>

      <TouchableOpacity 
        style={styles.fab}
        onPress={() => router.push('/create')}
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
    paddingBottom: 32,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  headerTextContainer: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 4,
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
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    paddingVertical: 20,
    marginHorizontal: 4,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1F2937',
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '600',
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingBottom: 100,
  },
  itineraryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  cardContent: {
    padding: 20,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  cardTitleContainer: {
    flex: 1,
    marginRight: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 12,
    color: '#9CA3AF',
    fontFamily: 'monospace',
  },
  moreButton: {
    padding: 4,
  },
  cardStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statText: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '600',
    marginLeft: 6,
  },
  routeIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  routeText: {
    fontSize: 12,
    color: '#10B981',
    fontWeight: '600',
    marginLeft: 4,
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
  createFirstItineraryButton: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  createFirstItineraryGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  createFirstItineraryText: {
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