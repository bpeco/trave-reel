import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { History, MapPin, Clock, Trash2 } from 'lucide-react-native';

const { width } = Dimensions.get('window');

interface HistoryItem {
  id: string;
  city: string;
  url: string;
  createdAt: string;
  itemCount: number;
}

export default function HistoryScreen() {
  const [history, setHistory] = useState<HistoryItem[]>([]);

  // Mock data - in a real app, you'd load this from AsyncStorage
  useEffect(() => {
    const mockHistory: HistoryItem[] = [
      {
        id: '1',
        city: 'Paris',
        url: 'https://tiktok.com/sample1',
        createdAt: '2024-01-15T10:30:00Z',
        itemCount: 8,
      },
      {
        id: '2',
        city: 'Tokyo',
        url: 'https://instagram.com/sample2',
        createdAt: '2024-01-10T14:20:00Z',
        itemCount: 6,
      },
      {
        id: '3',
        city: 'New York',
        url: 'https://tiktok.com/sample3',
        createdAt: '2024-01-05T09:15:00Z',
        itemCount: 10,
      },
    ];
    setHistory(mockHistory);
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return '1 day ago';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
    return `${Math.ceil(diffDays / 30)} months ago`;
  };

  const deleteHistoryItem = (id: string) => {
    setHistory(prev => prev.filter(item => item.id !== id));
  };

  const renderHistoryItem = ({ item }: { item: HistoryItem }) => (
    <View style={styles.historyCard}>
      <View style={styles.cardContent}>
        <View style={styles.cardHeader}>
          <View style={styles.cityContainer}>
            <MapPin size={18} color="#3B82F6" strokeWidth={2} />
            <Text style={styles.cityName}>{item.city}</Text>
          </View>
          <TouchableOpacity
            onPress={() => deleteHistoryItem(item.id)}
            style={styles.deleteButton}
          >
            <Trash2 size={16} color="#EF4444" strokeWidth={2} />
          </TouchableOpacity>
        </View>
        
        <View style={styles.cardDetails}>
          <View style={styles.detailRow}>
            <Clock size={14} color="#64748B" strokeWidth={2} />
            <Text style={styles.detailText}>{formatDate(item.createdAt)}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.itemCount}>{item.itemCount} stops</Text>
          </View>
        </View>
        
        <Text style={styles.urlText} numberOfLines={1} ellipsizeMode="middle">
          {item.url}
        </Text>
      </View>
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <History size={64} color="#CBD5E1" strokeWidth={1.5} />
      <Text style={styles.emptyTitle}>No History Yet</Text>
      <Text style={styles.emptySubtitle}>
        Your generated itineraries will appear here for easy access
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#14B8A6', '#059669']}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>Your History</Text>
        <Text style={styles.headerSubtitle}>
          Access your previously generated itineraries
        </Text>
      </LinearGradient>

      <View style={styles.content}>
        {history.length > 0 ? (
          <>
            <View style={styles.statsContainer}>
              <Text style={styles.statsText}>
                {history.length} itinerar{history.length === 1 ? 'y' : 'ies'} generated
              </Text>
            </View>
            <FlatList
              data={history}
              keyExtractor={(item) => item.id}
              renderItem={renderHistoryItem}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.listContainer}
            />
          </>
        ) : (
          renderEmptyState()
        )}
      </View>
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
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#A7F3D0',
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
    fontWeight: '500',
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingBottom: 32,
  },
  historyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
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
    alignItems: 'center',
    marginBottom: 16,
  },
  cityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  cityName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
    marginLeft: 8,
  },
  deleteButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#FEF2F2',
  },
  cardDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailText: {
    fontSize: 14,
    color: '#64748B',
    marginLeft: 6,
  },
  itemCount: {
    fontSize: 14,
    color: '#14B8A6',
    fontWeight: '600',
    backgroundColor: '#F0FDFA',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  urlText: {
    fontSize: 12,
    color: '#9CA3AF',
    fontFamily: 'monospace',
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#64748B',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#9CA3AF',
    textAlign: 'center',
    lineHeight: 24,
  },
});