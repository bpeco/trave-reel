import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { ArrowLeft, MapPin, FileText, Check } from 'lucide-react-native';

export default function CreateTripScreen() {
  const [tripName, setTripName] = useState('');
  const [description, setDescription] = useState('');
  const [nameError, setNameError] = useState<string | null>(null);

  const validateInputs = () => {
    if (!tripName.trim()) {
      setNameError('El nombre del viaje es requerido');
      return false;
    }
    setNameError(null);
    return true;
  };

  const handleCreateTrip = () => {
    if (!validateInputs()) return;

    // Mock trip creation - replace with real API call
    Alert.alert(
      '¡Viaje Creado!',
      `Tu viaje "${tripName}" ha sido creado exitosamente.`,
      [
        {
          text: 'Continuar',
          onPress: () => router.back(),
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#4ECDC4', '#44A08D']}
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
            <Text style={styles.headerTitle}>Nuevo Viaje</Text>
            <Text style={styles.headerSubtitle}>
              Crea tu próxima aventura ✈️
            </Text>
          </View>
        </View>
      </LinearGradient>

      <View style={styles.content}>
        <View style={styles.formContainer}>
          <View style={styles.iconContainer}>
            <MapPin size={48} color="#4ECDC4" strokeWidth={1.5} />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Nombre del Viaje</Text>
            <View style={[styles.inputWrapper, nameError && styles.inputError]}>
              <TextInput
                style={styles.input}
                placeholder="ej. París, Tokyo, Barcelona..."
                value={tripName}
                onChangeText={(text) => {
                  setTripName(text);
                  if (nameError) setNameError(null);
                }}
                autoCapitalize="words"
                placeholderTextColor="#9CA3AF"
              />
            </View>
            {nameError && (
              <Text style={styles.errorText}>{nameError}</Text>
            )}
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Descripción (Opcional)</Text>
            <View style={styles.textAreaWrapper}>
              <TextInput
                style={styles.textArea}
                placeholder="Describe tu viaje, qué esperas encontrar, con quién vas..."
                value={description}
                onChangeText={setDescription}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
                placeholderTextColor="#9CA3AF"
              />
            </View>
          </View>

          <TouchableOpacity
            style={styles.createButton}
            onPress={handleCreateTrip}
          >
            <LinearGradient
              colors={['#4ECDC4', '#44A08D']}
              style={styles.createButtonGradient}
            >
              <Check size={20} color="#FFFFFF" strokeWidth={2} />
              <Text style={styles.createButtonText}>Crear Viaje</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        <View style={styles.tipsContainer}>
          <Text style={styles.tipsTitle}>💡 Consejos</Text>
          <View style={styles.tipItem}>
            <Text style={styles.tipText}>
              • Usa nombres específicos como "París 2024" o "Tokio con amigos"
            </Text>
          </View>
          <View style={styles.tipItem}>
            <Text style={styles.tipText}>
              • Puedes agregar múltiples itinerarios al mismo viaje
            </Text>
          </View>
          <View style={styles.tipItem}>
            <Text style={styles.tipText}>
              • La descripción te ayudará a recordar el contexto del viaje
            </Text>
          </View>
        </View>
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
    color: '#E0F2F1',
    opacity: 0.9,
  },
  content: {
    flex: 1,
    paddingTop: 24,
  },
  formContainer: {
    backgroundColor: '#FFFFFF',
    margin: 16,
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: 32,
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
  textAreaWrapper: {
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
  },
  textArea: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 16,
    color: '#1F2937',
    minHeight: 100,
  },
  errorText: {
    fontSize: 14,
    color: '#EF4444',
    marginTop: 8,
    fontWeight: '500',
  },
  createButton: {
    borderRadius: 16,
    overflow: 'hidden',
    marginTop: 16,
  },
  createButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    paddingHorizontal: 24,
  },
  createButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    marginLeft: 8,
  },
  tipsContainer: {
    backgroundColor: '#F0FDFA',
    margin: 16,
    marginTop: 0,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  tipsTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#065F46',
    marginBottom: 12,
  },
  tipItem: {
    marginBottom: 8,
  },
  tipText: {
    fontSize: 14,
    color: '#047857',
    lineHeight: 20,
  },
});