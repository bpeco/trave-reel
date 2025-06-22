import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  Alert,
  Dimensions,
  ScrollView,
  Linking,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  MapPin, 
  Clock, 
  Send, 
  CircleAlert as AlertCircle, 
  CircleCheck as CheckCircle, 
  Download, 
  Video, 
  FileText, 
  Sparkles,
  ChevronDown,
  Plus
} from 'lucide-react-native';
import axios from 'axios';

const { width } = Dimensions.get('window');

interface ItineraryItem {
  order: number;
  place: string;
  duration_minutes?: number;
  notes?: string;
}

interface ItineraryResponse {
  ordered: ItineraryItem[];
  route_link: string;
}

interface ProgressStage {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  status: 'pending' | 'active' | 'completed' | 'error';
}

interface Trip {
  id: string;
  name: string;
}

export default function CreateScreen() {
  const [url, setUrl] = useState('');
  const [city, setCity] = useState('');
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);
  const [showTripSelector, setShowTripSelector] = useState(false);
  const [loading, setLoading] = useState(false);
  const [itinerary, setItinerary] = useState<ItineraryItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [urlError, setUrlError] = useState<string | null>(null);
  const [cityError, setCityError] = useState<string | null>(null);
  const [tripError, setTripError] = useState<string | null>(null);
  const [progressStages, setProgressStages] = useState<ProgressStage[]>([
    {
      id: 'download',
      title: 'Descargando contenido',
      description: 'Obteniendo el video de TikTok/Instagram',
      icon: Download,
      status: 'pending'
    },
    {
      id: 'process',
      title: 'Procesando video',
      description: 'Analizando el contenido del video',
      icon: Video,
      status: 'pending'
    },
    {
      id: 'generate',
      title: 'Creando itinerario',
      description: 'Generando tu plan de viaje personalizado',
      icon: FileText,
      status: 'pending'
    },
    {
      id: 'complete',
      title: '¡Listo!',
      description: 'Tu itinerario está completo',
      icon: Sparkles,
      status: 'pending'
    }
  ]);
  const [routeLink, setRouteLink] = useState<string | null>(null);

  // Mock trips data
  const [trips] = useState<Trip[]>([
    { id: '1', name: 'París' },
    { id: '2', name: 'Tokyo' },
    { id: '3', name: 'Barcelona' },
  ]);

  const validateInputs = () => {
    let isValid = true;
    
    if (!url.trim()) {
      setUrlError('URL es requerida');
      isValid = false;
    } else if (!url.includes('tiktok.com') && !url.includes('instagram.com')) {
      setUrlError('Ingresa una URL válida de TikTok o Instagram');
      isValid = false;
    } else {
      setUrlError(null);
    }

    if (!city.trim()) {
      setCityError('Ciudad es requerida');
      isValid = false;
    } else {
      setCityError(null);
    }

    if (!selectedTrip) {
      setTripError('Selecciona un viaje');
      isValid = false;
    } else {
      setTripError(null);
    }

    return isValid;
  };

  const updateStageStatus = (stageId: string, status: 'pending' | 'active' | 'completed' | 'error') => {
    setProgressStages(prev => prev.map(stage => 
      stage.id === stageId ? { ...stage, status } : stage
    ));
  };

  const resetProgressStages = () => {
    setProgressStages(prev => prev.map(stage => ({ ...stage, status: 'pending' })));
  };

  const simulateProgressStages = async () => {
    updateStageStatus('download', 'active');
    await new Promise(resolve => setTimeout(resolve, 2000));
    updateStageStatus('download', 'completed');

    updateStageStatus('process', 'active');
    await new Promise(resolve => setTimeout(resolve, 3000));
    updateStageStatus('process', 'completed');

    updateStageStatus('generate', 'active');
    await new Promise(resolve => setTimeout(resolve, 2500));
    updateStageStatus('generate', 'completed');

    updateStageStatus('complete', 'active');
    await new Promise(resolve => setTimeout(resolve, 500));
    updateStageStatus('complete', 'completed');
  };

  const generateItinerary = async () => {
    if (!validateInputs()) return;

    setLoading(true);
    setError(null);
    setItinerary([]);
    resetProgressStages();
    
    try {
      const progressPromise = simulateProgressStages();
      
      const response = await axios.post<ItineraryResponse>(
        'http://192.168.1.12:8000/itinerary',
        { url: url.trim(), city: city.trim() }
      );
      const { ordered, route_link } = response.data;
      await progressPromise;
      
      if (!Array.isArray(ordered)) {
        throw new Error('Formato de respuesta inválido');
      }
      setItinerary(ordered);
      setRouteLink(route_link);
    } catch (err: any) {
      console.error('Error generating itinerary:', err);
      const errorMessage = err.response?.data?.message || 
                          err.message || 
                          'Error al generar itinerario. Intenta de nuevo.';
      setError(errorMessage);
      
      setProgressStages(prev => prev.map(stage => ({ ...stage, status: 'error' })));
    } finally {
      setLoading(false);
    }
  };

  const renderProgressStage = ({ item, index }: { item: ProgressStage; index: number }) => {
    const IconComponent = item.icon;
    const isLast = index === progressStages.length - 1;
    
    const getStageColor = () => {
      switch (item.status) {
        case 'completed': return '#4ECDC4';
        case 'active': return '#FF6B6B';
        case 'error': return '#EF4444';
        default: return '#CBD5E1';
      }
    };

    const getBackgroundColor = () => {
      switch (item.status) {
        case 'completed': return '#F0FDFA';
        case 'active': return '#FFF5F5';
        case 'error': return '#FEF2F2';
        default: return '#F8FAFC';
      }
    };

    return (
      <View style={styles.progressStageContainer}>
        <View style={styles.progressStageLeft}>
          <View style={[styles.progressStageIcon, { backgroundColor: getBackgroundColor(), borderColor: getStageColor() }]}>
            {item.status === 'active' ? (
              <ActivityIndicator size={18} color={getStageColor()} />
            ) : (
              <IconComponent size={18} color={getStageColor()} strokeWidth={2} />
            )}
          </View>
          {!isLast && (
            <View style={[styles.progressStageLine, { backgroundColor: item.status === 'completed' ? '#4ECDC4' : '#E5E7EB' }]} />
          )}
        </View>
        
        <View style={styles.progressStageContent}>
          <Text style={[styles.progressStageTitle, { color: getStageColor() }]}>
            {item.title}
          </Text>
          <Text style={styles.progressStageDescription}>
            {item.description}
          </Text>
        </View>
      </View>
    );
  };

  const renderItineraryItem = ({ item, index }: { item: ItineraryItem; index: number }) => {
    const isLast = index === itinerary.length - 1;
    
    return (
      <View style={styles.timelineContainer}>
        <View style={styles.timelineLeft}>
          <View style={styles.timelineNumber}>
            <Text style={styles.timelineNumberText}>{item.order}</Text>
          </View>
          {!isLast && <View style={styles.timelineLine} />}
        </View>
        
        <View style={styles.itineraryCard}>
          <View style={styles.cardHeader}>
            <View style={styles.cardTitleContainer}>
              <MapPin size={16} color="#FF6B6B" strokeWidth={2} />
              <Text style={styles.cardTitle}>{item.place}</Text>
            </View>
            {item.duration_minutes && (
              <View style={styles.timeContainer}>
                <Clock size={14} color="#64748B" strokeWidth={2} />
                <Text style={styles.timeText}>{item.duration_minutes}min</Text>
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

  const renderTripSelector = () => (
    <Modal
      visible={showTripSelector}
      transparent
      animationType="slide"
      onRequestClose={() => setShowTripSelector(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Seleccionar Viaje</Text>
            <TouchableOpacity
              onPress={() => setShowTripSelector(false)}
              style={styles.modalCloseButton}
            >
              <Text style={styles.modalCloseText}>✕</Text>
            </TouchableOpacity>
          </View>
          
          <FlatList
            data={trips}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.tripOption,
                  selectedTrip?.id === item.id && styles.tripOptionSelected
                ]}
                onPress={() => {
                  setSelectedTrip(item);
                  setShowTripSelector(false);
                  if (tripError) setTripError(null);
                }}
              >
                <MapPin 
                  size={20} 
                  color={selectedTrip?.id === item.id ? '#FF6B6B' : '#64748B'} 
                  strokeWidth={2} 
                />
                <Text style={[
                  styles.tripOptionText,
                  selectedTrip?.id === item.id && styles.tripOptionTextSelected
                ]}>
                  {item.name}
                </Text>
              </TouchableOpacity>
            )}
          />
          
          <TouchableOpacity style={styles.createNewTripButton}>
            <Plus size={20} color="#FF6B6B" strokeWidth={2} />
            <Text style={styles.createNewTripText}>Crear nuevo viaje</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#FF6B6B', '#FF8E53']}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>Crear Itinerario</Text>
        <Text style={styles.headerSubtitle}>
          Transforma videos en aventuras reales 🎬✨
        </Text>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.formContainer}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>URL del Video</Text>
            <View style={[styles.inputWrapper, urlError && styles.inputError]}>
              <TextInput
                style={styles.input}
                placeholder="Pega aquí tu link de TikTok o Instagram"
                value={url}
                onChangeText={(text) => {
                  setUrl(text);
                  if (urlError) setUrlError(null);
                }}
                autoCapitalize="none"
                keyboardType="url"
                autoCorrect={false}
                placeholderTextColor="#9CA3AF"
              />
            </View>
            {urlError && (
              <View style={styles.errorContainer}>
                <AlertCircle size={14} color="#EF4444" strokeWidth={2} />
                <Text style={styles.errorText}>{urlError}</Text>
              </View>
            )}
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Ciudad de Destino</Text>
            <View style={[styles.inputWrapper, cityError && styles.inputError]}>
              <TextInput
                style={styles.input}
                placeholder="¿A dónde vamos?"
                value={city}
                onChangeText={(text) => {
                  setCity(text);
                  if (cityError) setCityError(null);
                }}
                autoCapitalize="words"
                placeholderTextColor="#9CA3AF"
              />
            </View>
            {cityError && (
              <View style={styles.errorContainer}>
                <AlertCircle size={14} color="#EF4444" strokeWidth={2} />
                <Text style={styles.errorText}>{cityError}</Text>
              </View>
            )}
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Asignar a Viaje</Text>
            <TouchableOpacity
              style={[styles.tripSelector, tripError && styles.inputError]}
              onPress={() => setShowTripSelector(true)}
            >
              <View style={styles.tripSelectorContent}>
                <MapPin size={20} color="#64748B" strokeWidth={2} />
                <Text style={[
                  styles.tripSelectorText,
                  !selectedTrip && styles.tripSelectorPlaceholder
                ]}>
                  {selectedTrip ? selectedTrip.name : 'Selecciona un viaje'}
                </Text>
              </View>
              <ChevronDown size={20} color="#64748B" strokeWidth={2} />
            </TouchableOpacity>
            {tripError && (
              <View style={styles.errorContainer}>
                <AlertCircle size={14} color="#EF4444" strokeWidth={2} />
                <Text style={styles.errorText}>{tripError}</Text>
              </View>
            )}
          </View>

          <TouchableOpacity
            style={[styles.generateButton, loading && styles.generateButtonDisabled]}
            onPress={generateItinerary}
            disabled={loading}
          >
            <LinearGradient
              colors={loading ? ['#9CA3AF', '#6B7280'] : ['#FF6B6B', '#FF8E53']}
              style={styles.generateButtonGradient}
            >
              {loading ? (
                <ActivityIndicator size={20} color="#FFFFFF" />
              ) : (
                <Send size={20} color="#FFFFFF" strokeWidth={2} />
              )}
              <Text style={styles.generateButtonText}>
                {loading ? 'Creando magia...' : 'Generar Itinerario'}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {error && (
          <View style={styles.globalErrorContainer}>
            <AlertCircle size={20} color="#EF4444" strokeWidth={2} />
            <Text style={styles.globalErrorText}>{error}</Text>
          </View>
        )}

        {loading && (
          <View style={styles.progressContainer}>
            <Text style={styles.progressTitle}>Creando tu itinerario perfecto...</Text>
            <FlatList
              data={progressStages}
              keyExtractor={(item) => item.id}
              renderItem={renderProgressStage}
              scrollEnabled={false}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.progressList}
            />
          </View>
        )}

        <View style={styles.resultsContainer}>
          {!loading && itinerary.length > 0 && (
            <>
              <View style={styles.resultsHeader}>
                <CheckCircle size={20} color="#4ECDC4" strokeWidth={2} />
                <Text style={styles.resultsTitle}>¡Tu Itinerario está Listo!</Text>
              </View>
              <FlatList
                data={itinerary}
                keyExtractor={(item) => item.order.toString()}
                renderItem={renderItineraryItem}
                scrollEnabled={false}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.itineraryList}
              />
              {routeLink && (
                <TouchableOpacity
                  style={styles.openMapsButton}
                  onPress={() => Linking.openURL(routeLink)}
                >
                  <LinearGradient
                    colors={['#4ECDC4', '#44A08D']}
                    style={styles.openMapsGradient}
                  >
                    <MapPin size={20} color="#FFFFFF" strokeWidth={2} />
                    <Text style={styles.openMapsText}>Abrir en Google Maps</Text>
                  </LinearGradient>
                </TouchableOpacity>
              )}
            </>
          )}
        </View>
      </ScrollView>

      {renderTripSelector()}
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
    color: '#FFE5E5',
    opacity: 0.9,
  },
  content: {
    flex: 1,
  },
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
  inputContainer: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 8,
  },
  inputWrapper: {
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
  },
  inputError: {
    borderColor: '#EF4444',
  },
  input: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 16,
    color: '#1F2937',
  },
  tripSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
  },
  tripSelectorContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  tripSelectorText: {
    fontSize: 16,
    color: '#1F2937',
    marginLeft: 12,
  },
  tripSelectorPlaceholder: {
    color: '#9CA3AF',
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  errorText: {
    fontSize: 14,
    color: '#EF4444',
    marginLeft: 6,
    fontWeight: '500',
  },
  generateButton: {
    borderRadius: 16,
    overflow: 'hidden',
    marginTop: 8,
  },
  generateButtonDisabled: {
    opacity: 0.7,
  },
  generateButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    paddingHorizontal: 24,
  },
  generateButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    marginLeft: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 24,
    paddingBottom: 40,
    maxHeight: '70%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
  },
  modalCloseButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalCloseText: {
    fontSize: 16,
    color: '#6B7280',
    fontWeight: '600',
  },
  tripOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  tripOptionSelected: {
    backgroundColor: '#FFF5F5',
  },
  tripOptionText: {
    fontSize: 16,
    color: '#64748B',
    marginLeft: 12,
    fontWeight: '500',
  },
  tripOptionTextSelected: {
    color: '#FF6B6B',
    fontWeight: '700',
  },
  createNewTripButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
    marginTop: 16,
    marginHorizontal: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#FF6B6B',
    borderStyle: 'dashed',
  },
  createNewTripText: {
    fontSize: 16,
    color: '#FF6B6B',
    fontWeight: '600',
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
  progressContainer: {
    backgroundColor: '#FFFFFF',
    margin: 16,
    marginTop: 0,
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  progressTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 24,
    textAlign: 'center',
  },
  progressList: {
    paddingHorizontal: 8,
  },
  progressStageContainer: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  progressStageLeft: {
    alignItems: 'center',
    marginRight: 16,
  },
  progressStageIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  progressStageLine: {
    width: 3,
    flex: 1,
    marginTop: 8,
    borderRadius: 2,
  },
  progressStageContent: {
    flex: 1,
    paddingTop: 6,
  },
  progressStageTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  progressStageDescription: {
    fontSize: 14,
    color: '#64748B',
    lineHeight: 20,
  },
  resultsContainer: {
    paddingHorizontal: 16,
    paddingBottom: 32,
  },
  resultsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    paddingHorizontal: 8,
  },
  resultsTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
    marginLeft: 8,
  },
  itineraryList: {
    paddingHorizontal: 8,
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
  openMapsButton: {
    marginTop: 20,
    borderRadius: 16,
    overflow: 'hidden',
  },
  openMapsGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  openMapsText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 16,
    marginLeft: 8,
  },
});