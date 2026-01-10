// app/(tabs)/new-trip.tsx
import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
  Animated,
  FlatList,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as Animatable from 'react-native-animatable';
import CountryFlag from 'react-native-country-flag';
import countries from 'i18n-iso-countries';
import es from 'i18n-iso-countries/langs/es.json';
import * as Haptics from 'expo-haptics';
import worldCountries from 'world-countries';
import { SharedElement } from 'react-navigation-shared-element';

countries.registerLocale(es);

const ITEM_WIDTH = 90;
const { width } = Dimensions.get('window');

// --- Continentes ---
const CONTINENTS = [
  { name: 'África', code: 'AF' },
  { name: 'América', code: 'NA' },
  { name: 'Asia', code: 'AS' },
  { name: 'Europa', code: 'EU' },
  { name: 'Oceanía', code: 'OC' },
];

// --- Mapeo país a continente ---
const countryToContinent: Record<string, string> = {};
worldCountries.forEach(c => {
  let region = c.region;
  if (region === 'Americas') region = 'América';
  if (region === 'Europe') region = 'Europa';
  if (region === 'Asia') region = 'Asia';
  if (region === 'Africa') region = 'África';
  if (region === 'Oceania') region = 'Oceanía';
  countryToContinent[c.cca2] = region;
});

// --- Lista de países conocidos (puedes ajustar a gusto) ---
const KNOWN_COUNTRIES = [
  'AR','BR','CL','UY','PE','CO','MX','US','CA',
  'ES','FR','IT','DE','GB','PT','AU','NZ',
  'JP','CN','KR','IN','ZA','EG','MA','TR',
  'RU','GR','NL','BE','CH','SE','NO','FI','IE',
  'TH','TR','MY','AT','CZ','PL','HR'
];

// --- Lista de países con continente y filtro de conocidos ---
const countryList = Object.entries(countries.getNames('es')).map(([code, name]) => ({
  code,
  name,
  continent: countryToContinent[code] || 'Otro',
})).filter(c => KNOWN_COUNTRIES.includes(c.code));

const BACKEND_URL = 'http://192.168.0.14:8000';

export default function NewTripScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [step, setStep] = useState(0);
  const [name, setName] = useState('');
  const [selectedContinent, setSelectedContinent] = useState<string | null>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [country, setCountry] = useState('');
  const [countryCode, setCountryCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastVibrationIndex, setLastVibrationIndex] = useState(0);
  const [inferred, setInferred] = useState<{ continent?: string; country?: string } | null>(null);
  const [showFab, setShowFab] = useState(false);

  const filteredCountries = selectedContinent
    ? countryList.filter(c => c.continent === selectedContinent)
    : [];

  // Animación scroll
  const scrollX = useRef(new Animated.Value(0)).current;
  const flatListRef = useRef<Animated.FlatList<any>>(null);

  // Animación para el grid de continentes
  const animatedValues = useRef(CONTINENTS.map(() => new Animated.Value(0))).current;

  // Vibración solo cuando cambia el índice
  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
    {
      useNativeDriver: true,
      listener: (event: { nativeEvent: { contentOffset: { x: number } } }) => {
        const offsetX = event.nativeEvent.contentOffset.x;
        const idx = Math.round(offsetX / ITEM_WIDTH);
        if (idx !== lastVibrationIndex && filteredCountries[idx]) {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          setLastVibrationIndex(idx);
          setSelectedIndex(idx);
          setCountry(filteredCountries[idx].name);
          setCountryCode(filteredCountries[idx].code);
        }
      }
    }
  );

  // Snap al centro y vibración
  const onMomentumScrollEnd = (event: any) => {
    const idx = Math.round(event.nativeEvent.contentOffset.x / ITEM_WIDTH);
    if (idx !== selectedIndex && filteredCountries[idx]) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      setSelectedIndex(idx);
      setCountry(filteredCountries[idx].name);
      setCountryCode(filteredCountries[idx].code);
    }
    flatListRef.current?.scrollToOffset({ offset: idx * ITEM_WIDTH, animated: true });
  };

  // Reset país al cambiar continente
  useEffect(() => {
    if (filteredCountries.length > 0) {
      setCountry(filteredCountries[0].name);
      setCountryCode(filteredCountries[0].code);
      setSelectedIndex(0);
    }
  }, [selectedContinent]);

  // Mejor animación de selección de continente
  const handleSelectContinent = (cont: any, idx: number) => {
    setSelectedContinent(cont.name);
    animatedValues.forEach((val, i) => {
      Animated.timing(val, {
        toValue: i === idx ? 1 : 0,
        duration: 350,
        useNativeDriver: false,
      }).start();
    });
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  };

  // Cambia el handleNext para hacer el POST al endpoint antes de avanzar de paso
  const handleNext = async () => {
    if (step === 0 && !name.trim()) {
      setError('El nombre es requerido');
      return;
    }
    setError(null);
    setLoading(true);
    try {
      // Llama al endpoint solo cuando se pasa a step 1
      const res = await fetch(`${BACKEND_URL}/api/detect-country`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ trip_name: name }),
      });
      const data = await res.json();
      if (data && data.continent && data.country) {
        setInferred({ continent: data.continent, country: data.country });
        setSelectedContinent(data.continent);
        // Buscar el país en la lista filtrada
        const idx = countryList.findIndex(
          c => c.continent === data.continent && c.name.toLowerCase() === data.country.toLowerCase()
        );
        if (idx !== -1) {
          setSelectedIndex(idx);
          setCountry(countryList[idx].name);
          setCountryCode(countryList[idx].code);
        }
      } else {
        setInferred(null);
        setSelectedContinent(null);
        setSelectedIndex(0);
        setCountry('');
        setCountryCode('');
      }
      setStep(step + 1);
    } catch (e) {
      setError('No se pudo inferir el país. Seleccionalo manualmente.');
      setInferred(null);
      setSelectedContinent(null);
      setSelectedIndex(0);
      setCountry('');
      setCountryCode('');
      setStep(step + 1);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    if (!country) {
      setError('El país es requerido');
      return;
    }
    setError(null);
    setLoading(true);
    const { error: supaError } = await supabase
      .from('trips')
      .insert([
        {
          name: name.trim(),
          country: country,
          created_by: user!.id,
        },
      ]);
    setLoading(false);
    if (supaError) {
      setError(supaError.message);
    } else {
      router.back();
    }
  };

  // Helper para mostrar el nombre completo del país inferido
  const getCountryNameFromCode = (code: string) => {
    const found = countryList.find(c => c.code.toLowerCase() === code.toLowerCase());
    return found ? found.name : code;
  };

  // --- Cambios para corregir selección y estilos ---
  // 1) Cuando se auto-selecciona el continente, animar igual que si el usuario lo selecciona
  useEffect(() => {
    if (inferred?.continent) {
      const idx = CONTINENTS.findIndex(c => c.name === inferred.continent);
      if (idx !== -1) {
        animatedValues.forEach((val, i) => {
          Animated.timing(val, {
            toValue: i === idx ? 1 : 0,
            duration: 350,
            useNativeDriver: false,
          }).start();
        });
      }
    }
  }, [inferred?.continent]);

  // 2) Auto-selección correcta del país deducido por la LLM (por código, no por nombre)
  useEffect(() => {
    if (inferred?.country && selectedContinent) {
      const filtered = countryList.filter(c => c.continent === selectedContinent);
      const idx = filtered.findIndex(
        c => inferred.country && c.code.toLowerCase() === inferred.country.toLowerCase()
      );
      if (idx !== -1) {
        setSelectedIndex(idx);
        setCountry(filtered[idx].name);
        setCountryCode(filtered[idx].code);
        // Scroll al país deducido
        animateScrollToIndex(idx, 1200); // 1200ms de duración, ajustá a gusto
      }
    }
    // eslint-disable-next-line
  }, [inferred?.country, selectedContinent]);

  // Animación de entrada
  const fadeAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
    }).start(() => setShowFab(true));
  }, []);

  function animateScrollToIndex(targetIdx: number, duration = 1200) {
    if (!flatListRef.current) return;
    const start = Date.now();
    const from = selectedIndex * ITEM_WIDTH;
    const to = targetIdx * ITEM_WIDTH;

    function animate() {
      const now = Date.now();
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const current = from + (to - from) * progress;
      flatListRef.current?.scrollToOffset({ offset: current, animated: false });
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    }
    animate();
  }

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.container}>
        <LinearGradient
          colors={['#fb7185', '#be123c']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.header}
        >
          <TouchableOpacity onPress={() => step === 0 ? router.back() : setStep(step - 1)} style={styles.backButton}>
            <Ionicons name="chevron-back-circle" size={32} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Nuevo Viaje</Text>
          <View style={{ width: 32 }} />
        </LinearGradient>

        <KeyboardAvoidingView
          style={styles.form}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          {step === 0 && (
            <Animatable.View animation="fadeInRight" duration={500} style={{ flex: 1 }}>
              <Text style={styles.stepTitle}>¿Cómo se llama tu viaje?</Text>
              <TextInput
                style={styles.input}
                placeholder="Nombre del viaje"
                placeholderTextColor="#FCA5A5"
                value={name}
                onChangeText={setName}
                autoCapitalize="words"
              />
              {error && <Text style={styles.error}>{error}</Text>}
              <TouchableOpacity style={styles.button} onPress={handleNext} disabled={loading}>
                {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Siguiente</Text>}
              </TouchableOpacity>
            </Animatable.View>
          )}

          {step === 1 && (
            <Animatable.View animation="fadeInRight" duration={500} style={{ flex: 1, alignItems: 'center', justifyContent: 'flex-start' }}>
              <Text style={styles.stepTitle}>¿A qué país vas?</Text>

              {/* Mensaje de inferencia */}
              {inferred?.continent && inferred?.country && (
                <View style={styles.inferredBox}>
                  <Text style={styles.inferredText}>
                    Inferimos que tu viaje es a{' '}
                    <Text style={{ fontWeight: 'bold', color: '#be123c' }}>
                      {getCountryNameFromCode(inferred.country)}
                    </Text> ({inferred.continent}). Podés cambiarlo si es incorrecto.
                  </Text>
                </View>
              )}

              {/* Título para continentes */}
              <Text style={styles.sectionTitle}>Elegí un continente</Text>
              {/* --- Grid de continentes --- */}
              <View style={styles.continentGrid}>
                {CONTINENTS.map((cont, idx) => {
                  const isSelected = selectedContinent === cont.name;
                  const animatedBg = animatedValues[idx].interpolate({
                    inputRange: [0, 1],
                    outputRange: ['#F3F4F6', '#be123c'],
                  });
                  const animatedText = animatedValues[idx].interpolate({
                    inputRange: [0, 1],
                    outputRange: ['#64748B', '#fff'],
                  });
                  return (
                    <TouchableOpacity
                      key={cont.code}
                      onPress={() => handleSelectContinent(cont, idx)}
                      activeOpacity={0.8}
                      style={{ flex: 1, margin: 8, minWidth: 100, maxWidth: 140 }}
                    >
                      <Animated.View style={[
                        styles.continentBox,
                        {
                          backgroundColor: animatedBg,
                          transform: [{ scale: isSelected ? 1.08 : 1 }],
                          elevation: isSelected ? 6 : 2,
                          borderWidth: isSelected ? 2 : 0,
                          borderColor: isSelected ? '#be123c' : 'transparent',
                        }
                      ]}>
                        <Animated.Text style={[
                          styles.continentBoxText,
                          { color: animatedText }
                        ]}>
                          {cont.name}
                        </Animated.Text>
                      </Animated.View>
                    </TouchableOpacity>
                  );
                })}
              </View>

              {/* Título para países */}
              <Text style={styles.sectionTitle}>Elegí un país</Text>
              {/* --- Carrousel de países o mensaje --- */}
              {!selectedContinent ? (
                <View style={{ height: 120, justifyContent: 'center', alignItems: 'center', marginBottom: 32, marginTop: 12 }}>
                  <Text style={{ color: '#64748B', fontSize: 16, textAlign: 'center' }}>
                    Seleccioná primero un continente para ver los países disponibles.
                  </Text>
                </View>
              ) : filteredCountries.length === 0 ? (
                <View style={{ height: 120, justifyContent: 'center', alignItems: 'center', marginBottom: 32, marginTop: 12 }}>
                  <Text style={{ color: '#64748B', fontSize: 16, textAlign: 'center' }}>
                    No hay países conocidos para este continente.
                  </Text>
                </View>
              ) : (
                <View style={{ height: 120, marginBottom: 32, marginTop: 12, justifyContent: 'center' }}>
                  <Animated.FlatList
                    ref={flatListRef}
                    data={filteredCountries}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    snapToInterval={ITEM_WIDTH}
                    decelerationRate="fast"
                    contentContainerStyle={{
                      paddingHorizontal: (width - ITEM_WIDTH) / 2,
                      alignItems: 'center',
                    }}
                    keyExtractor={item => item.code}
                    onMomentumScrollEnd={onMomentumScrollEnd}
                    scrollEventThrottle={16}
                    initialScrollIndex={selectedIndex}
                    getItemLayout={(_, index) => ({
                      length: ITEM_WIDTH,
                      offset: ITEM_WIDTH * index,
                      index,
                    })}
                    onScroll={handleScroll}
                    renderItem={({ item, index }) => {
                      const inputRange = [
                        (index - 2) * ITEM_WIDTH,
                        (index - 1) * ITEM_WIDTH,
                        index * ITEM_WIDTH,
                        (index + 1) * ITEM_WIDTH,
                        (index + 2) * ITEM_WIDTH,
                      ];
                      const scale = scrollX.interpolate({
                        inputRange,
                        outputRange: [0.7, 1.0, 1.4, 1.0, 0.7], // Menos grande el seleccionado
                        extrapolate: 'clamp',
                      });
                      const opacity = scrollX.interpolate({
                        inputRange,
                        outputRange: [0.2, 0.5, 1, 0.5, 0.2],
                        extrapolate: 'clamp',
                      });
                      return (
                        <Animated.View style={{
                          alignItems: 'center',
                          width: ITEM_WIDTH,
                          opacity,
                          transform: [{ scale }],
                          justifyContent: 'flex-start',
                          height: 100,
                          paddingTop: 0,
                          paddingBottom: 0,
                        }}>
                          <View style={{ height: 38, justifyContent: 'center' }}>
                            <CountryFlag isoCode={item.code} size={28} style={styles.flag} />
                          </View>
                          <Text
                            style={{
                              color: index === selectedIndex ? '#be123c' : '#64748B',
                              fontWeight: index === selectedIndex ? '700' : '500',
                              fontSize: 11,
                              marginTop: 6,
                              textAlign: 'center',
                              maxWidth: 80,
                              lineHeight: 14,
                            }}
                            numberOfLines={2}
                            ellipsizeMode="tail"
                          >
                            {item.name}
                          </Text>
                        </Animated.View>
                      );
                    }}
                  />
                </View>
              )}
              {error && <Text style={styles.error}>{error}</Text>}
              <TouchableOpacity
                style={[styles.button, { marginTop: 12 }]}
                onPress={handleCreate}
                disabled={loading || !selectedContinent || filteredCountries.length === 0}
              >
                {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Crear</Text>}
              </TouchableOpacity>
            </Animatable.View>
          )}
        </KeyboardAvoidingView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 56,
    paddingBottom: 36,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#be123c',
    shadowOpacity: 0.13,
    shadowRadius: 12,
    elevation: 8,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#fff',
    letterSpacing: 0.5,
    textAlign: 'center',
    flex: 1,
  },
  backButton: {
    padding: 2,
    marginRight: 8,
  },
  form: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 36,
  },
  stepTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#be123c',
    marginBottom: 24,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1.5,
    borderColor: '#E0E7EF',
    borderRadius: 14,
    padding: 16,
    marginBottom: 18,
    backgroundColor: '#FFFFFF',
    fontSize: 16,
    color: '#1e293b',
  },
  button: {
    backgroundColor: '#be123c',
    padding: 16,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 8,
    shadowColor: '#be123c',
    shadowOpacity: 0.10,
    shadowRadius: 8,
    elevation: 2,
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 16,
    letterSpacing: 0.2,
  },
  error: {
    color: '#DC2626',
    fontWeight: '500',
    fontSize: 15,
    marginBottom: 10,
    textAlign: 'center',
  },
  flag: {
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#fff',
  },
  continentGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 12,
    marginTop: 4,
  },
  continentBox: {
    borderRadius: 18,
    paddingVertical: 24,
    paddingHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    minWidth: 100,
    maxWidth: 140,
    margin: 2,
  },
  continentBoxText: {
    fontWeight: '700',
    fontSize: 17,
    letterSpacing: 0.2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#64748B',
    marginTop: 10,
    marginBottom: 6,
    alignSelf: 'flex-start',
    marginLeft: 8,
  },
  inferredBox: {
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    marginTop: 2,
    alignSelf: 'stretch',
    marginHorizontal: 0,
  },
  inferredText: {
    color: '#64748B',
    fontSize: 14,
    textAlign: 'center',
  },
});
