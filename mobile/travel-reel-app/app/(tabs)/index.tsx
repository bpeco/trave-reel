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
  Linking
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { MapPin, Clock, Send, CircleAlert as AlertCircle, CircleCheck as CheckCircle, Download, Video, FileText, Sparkles } from 'lucide-react-native';
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

export default function HomeScreen() {
  const [url, setUrl] = useState('');
  const [city, setCity] = useState('');
  const [loading, setLoading] = useState(false);
  const [itinerary, setItinerary] = useState<ItineraryItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [urlError, setUrlError] = useState<string | null>(null);
  const [cityError, setCityError] = useState<string | null>(null);
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


  const validateInputs = () => {
    let isValid = true;
    
    if (!url.trim()) {
      setUrlError('URL is required');
      isValid = false;
    } else if (!url.includes('tiktok.com') && !url.includes('instagram.com')) {
      setUrlError('Please enter a valid TikTok or Instagram URL');
      isValid = false;
    } else {
      setUrlError(null);
    }

    if (!city.trim()) {
      setCityError('City is required');
      isValid = false;
    } else {
      setCityError(null);
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
    // Etapa 1: Descargando contenido
    updateStageStatus('download', 'active');
    await new Promise(resolve => setTimeout(resolve, 2000));
    updateStageStatus('download', 'completed');

    // Etapa 2: Procesando video
    updateStageStatus('process', 'active');
    await new Promise(resolve => setTimeout(resolve, 3000));
    updateStageStatus('process', 'completed');

    // Etapa 3: Creando itinerario
    updateStageStatus('generate', 'active');
    await new Promise(resolve => setTimeout(resolve, 2500));
    updateStageStatus('generate', 'completed');

    // Etapa 4: Completado
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
      // Ejecutar simulación de progreso en paralelo con la petición real
      const progressPromise = simulateProgressStages();
      
      const response = await axios.post<ItineraryResponse>(
        'http://192.168.1.12:8000/itinerary',
        { url: url.trim(), city: city.trim() }
      );
      const { ordered, route_link } = response.data;
      await progressPromise;
      if (!Array.isArray(ordered)) {
        throw new Error('Invalid response format');
      }
      setItinerary(ordered);
      setRouteLink(route_link);
    } catch (err: any) {
      console.error('Error generating itinerary:', err);
      const errorMessage = err.response?.data?.message || 
                          err.message || 
                          'Failed to generate itinerary. Please try again.';
      setError(errorMessage);
      
      // Marcar todas las etapas como error
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
        case 'completed': return '#10B981';
        case 'active': return '#3B82F6';
        case 'error': return '#EF4444';
        default: return '#D1D5DB';
      }
    };

    const getBackgroundColor = () => {
      switch (item.status) {
        case 'completed': return '#ECFDF5';
        case 'active': return '#EFF6FF';
        case 'error': return '#FEF2F2';
        default: return '#F9FAFB';
      }
    };

    return (
      <View style={styles.progressStageContainer}>
        <View style={styles.progressStageLeft}>
          <View style={[styles.progressStageIcon, { backgroundColor: getBackgroundColor(), borderColor: getStageColor() }]}>
            {item.status === 'active' ? (
              <ActivityIndicator size={16} color={getStageColor()} />
            ) : (
              <IconComponent size={16} color={getStageColor()} strokeWidth={2} />
            )}
          </View>
          {!isLast && (
            <View style={[styles.progressStageLine, { backgroundColor: item.status === 'completed' ? '#10B981' : '#E5E7EB' }]} />
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
              <MapPin size={16} color="#3B82F6" strokeWidth={2} />
              <Text style={styles.cardTitle}>{item.place}</Text>
            </View>
            <View style={styles.timeContainer}>
              <Clock size={14} color="#64748B" strokeWidth={2} />
              <Text style={styles.timeText}>{item.duration_minutes}min</Text>
            </View>
          </View>
          
          
          {item.notes && (
            <View style={styles.notesContainer}>
              <Text style={styles.notesLabel}>Notes:</Text>
              <Text style={styles.notesText}>{item.notes}</Text>
            </View>
          )}
        </View>
      </View>
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <MapPin size={64} color="#CBD5E1" strokeWidth={1.5} />
      <Text style={styles.emptyTitle}>No Itinerary Yet</Text>
      <Text style={styles.emptySubtitle}>
        Enter a TikTok or Instagram URL and city name to generate your personalized travel itinerary
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#3B82F6', '#1E40AF']}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>Itinerary Generator</Text>
        <Text style={styles.headerSubtitle}>
          Create your perfect travel plan from social media inspiration
        </Text>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.formContainer}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Social Media URL</Text>
            <View style={[styles.inputWrapper, urlError && styles.inputError]}>
              <TextInput
                style={styles.input}
                placeholder="Enter TikTok or Instagram URL"
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
            <Text style={styles.label}>Destination City</Text>
            <View style={[styles.inputWrapper, cityError && styles.inputError]}>
              <TextInput
                style={styles.input}
                placeholder="Enter city name"
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

          <TouchableOpacity
            style={[styles.generateButton, loading && styles.generateButtonDisabled]}
            onPress={generateItinerary}
            disabled={loading}
          >
            <LinearGradient
              colors={loading ? ['#9CA3AF', '#6B7280'] : ['#3B82F6', '#1E40AF']}
              style={styles.generateButtonGradient}
            >
              {loading ? (
                <ActivityIndicator size={20} color="#FFFFFF" />
              ) : (
                <Send size={20} color="#FFFFFF" strokeWidth={2} />
              )}
              <Text style={styles.generateButtonText}>
                {loading ? 'Generating...' : 'Generate Itinerary'}
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

        {/* Progress Stages */}
        {loading && (
          <View style={styles.progressContainer}>
            <Text style={styles.progressTitle}>Generando tu itinerario...</Text>
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
          {!loading && itinerary.length > 0 ? (
            <>
              <View style={styles.resultsHeader}>
                <CheckCircle size={20} color="#10B981" strokeWidth={2} />
                <Text style={styles.resultsTitle}>Your Itinerary</Text>
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
                  <Text style={styles.openMapsText}>Abrir en Google Maps</Text>
                </TouchableOpacity>
              )}

            </>
          ) : !loading && !error && (
            renderEmptyState()
          )}
        </View>
      </ScrollView>
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
    color: '#E0E7FF',
    opacity: 0.9,
  },
  content: {
    flex: 1,
  },
  formContainer: {
    padding: 24,
    backgroundColor: '#FFFFFF',
    margin: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  inputContainer: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
  },
  inputWrapper: {
    borderWidth: 1.5,
    borderColor: '#D1D5DB',
    borderRadius: 12,
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
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  errorText: {
    fontSize: 14,
    color: '#EF4444',
    marginLeft: 6,
  },
  generateButton: {
    borderRadius: 12,
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
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  generateButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginLeft: 8,
  },
  globalErrorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF2F2',
    borderColor: '#FECACA',
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    margin: 16,
    marginTop: 0,
  },
  globalErrorText: {
    fontSize: 14,
    color: '#DC2626',
    marginLeft: 8,
    flex: 1,
  },
  progressContainer: {
    backgroundColor: '#FFFFFF',
    margin: 16,
    marginTop: 0,
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  progressTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 20,
    textAlign: 'center',
  },
  progressList: {
    paddingHorizontal: 8,
  },
  progressStageContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  progressStageLeft: {
    alignItems: 'center',
    marginRight: 16,
  },
  progressStageIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  progressStageLine: {
    width: 2,
    flex: 1,
    marginTop: 8,
  },
  progressStageContent: {
    flex: 1,
    paddingTop: 4,
  },
  progressStageTitle: {
    fontSize: 16,
    fontWeight: '600',
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
  emptyState: {
    alignItems: 'center',
    paddingVertical: 64,
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
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#3B82F6',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  timelineNumberText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  timelineLine: {
    width: 2,
    flex: 1,
    backgroundColor: '#E5E7EB',
    marginTop: 8,
  },
  itineraryCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
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
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  timeText: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
    marginLeft: 4,
  },
  startTime: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 8,
  },
  notesContainer: {
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    padding: 12,
    marginTop: 8,
  },
  notesLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 4,
  },
  notesText: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  openMapsButton: {
  marginTop: 16,
  padding: 12,
  backgroundColor: '#3B82F6',
  borderRadius: 8,
  alignItems: 'center',
},
openMapsText: {
  color: '#FFF',
  fontWeight: '600',
},
});