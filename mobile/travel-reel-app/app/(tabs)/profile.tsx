import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Switch,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  User, 
  Settings, 
  Bell, 
  Shield, 
  HelpCircle, 
  LogOut,
  ChevronRight,
  Mail,
  MapPin,
  Calendar,
  Star
} from 'lucide-react-native';

export default function ProfileScreen() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Mock login state

  const handleLogin = () => {
    // Mock login - replace with real authentication
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    Alert.alert(
      'Cerrar Sesión',
      '¿Estás seguro que quieres cerrar sesión?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Cerrar Sesión', 
          style: 'destructive',
          onPress: () => setIsLoggedIn(false)
        }
      ]
    );
  };

  const renderLoginScreen = () => (
    <View style={styles.loginContainer}>
      <View style={styles.loginIconContainer}>
        <User size={64} color="#FF6B6B" strokeWidth={1.5} />
      </View>
      
      <Text style={styles.loginTitle}>¡Bienvenido a TravelReel!</Text>
      <Text style={styles.loginSubtitle}>
        Inicia sesión para guardar tus viajes y sincronizar tus itinerarios en todos tus dispositivos
      </Text>

      <View style={styles.loginButtons}>
        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <LinearGradient
            colors={['#FF6B6B', '#FF8E53']}
            style={styles.loginButtonGradient}
          >
            <Mail size={20} color="#FFFFFF" strokeWidth={2} />
            <Text style={styles.loginButtonText}>Continuar con Email</Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity style={styles.googleButton} onPress={handleLogin}>
          <View style={styles.googleButtonContent}>
            <Text style={styles.googleIcon}>G</Text>
            <Text style={styles.googleButtonText}>Continuar con Google</Text>
          </View>
        </TouchableOpacity>
      </View>

      <Text style={styles.termsText}>
        Al continuar, aceptas nuestros Términos de Servicio y Política de Privacidad
      </Text>
    </View>
  );

  const renderProfileScreen = () => (
    <ScrollView style={styles.profileContent} showsVerticalScrollIndicator={false}>
      {/* User Info Card */}
      <View style={styles.userCard}>
        <View style={styles.avatarContainer}>
          <LinearGradient
            colors={['#FF6B6B', '#FF8E53']}
            style={styles.avatar}
          >
            <Text style={styles.avatarText}>JD</Text>
          </LinearGradient>
        </View>
        
        <View style={styles.userInfo}>
          <Text style={styles.userName}>Jane Doe</Text>
          <Text style={styles.userEmail}>jane.doe@example.com</Text>
        </View>
      </View>

      {/* Stats Cards */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <MapPin size={24} color="#FF6B6B" strokeWidth={2} />
          <Text style={styles.statNumber}>12</Text>
          <Text style={styles.statLabel}>Viajes</Text>
        </View>
        
        <View style={styles.statCard}>
          <Calendar size={24} color="#4ECDC4" strokeWidth={2} />
          <Text style={styles.statNumber}>28</Text>
          <Text style={styles.statLabel}>Itinerarios</Text>
        </View>
        
        <View style={styles.statCard}>
          <Star size={24} color="#FFD93D" strokeWidth={2} />
          <Text style={styles.statNumber}>156</Text>
          <Text style={styles.statLabel}>Lugares</Text>
        </View>
      </View>

      {/* Settings Sections */}
      <View style={styles.settingsSection}>
        <Text style={styles.sectionTitle}>Configuración</Text>
        
        <View style={styles.settingItem}>
          <View style={styles.settingLeft}>
            <Bell size={20} color="#64748B" strokeWidth={2} />
            <Text style={styles.settingText}>Notificaciones</Text>
          </View>
          <Switch
            value={notificationsEnabled}
            onValueChange={setNotificationsEnabled}
            trackColor={{ false: '#E5E7EB', true: '#FF6B6B' }}
            thumbColor={notificationsEnabled ? '#FFFFFF' : '#FFFFFF'}
          />
        </View>

        <TouchableOpacity style={styles.settingItem}>
          <View style={styles.settingLeft}>
            <Settings size={20} color="#64748B" strokeWidth={2} />
            <Text style={styles.settingText}>Preferencias</Text>
          </View>
          <ChevronRight size={20} color="#9CA3AF" strokeWidth={2} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.settingItem}>
          <View style={styles.settingLeft}>
            <Shield size={20} color="#64748B" strokeWidth={2} />
            <Text style={styles.settingText}>Privacidad y Seguridad</Text>
          </View>
          <ChevronRight size={20} color="#9CA3AF" strokeWidth={2} />
        </TouchableOpacity>
      </View>

      <View style={styles.settingsSection}>
        <Text style={styles.sectionTitle}>Soporte</Text>
        
        <TouchableOpacity style={styles.settingItem}>
          <View style={styles.settingLeft}>
            <HelpCircle size={20} color="#64748B" strokeWidth={2} />
            <Text style={styles.settingText}>Centro de Ayuda</Text>
          </View>
          <ChevronRight size={20} color="#9CA3AF" strokeWidth={2} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.settingItem}>
          <View style={styles.settingLeft}>
            <Mail size={20} color="#64748B" strokeWidth={2} />
            <Text style={styles.settingText}>Contactar Soporte</Text>
          </View>
          <ChevronRight size={20} color="#9CA3AF" strokeWidth={2} />
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <LogOut size={20} color="#EF4444" strokeWidth={2} />
        <Text style={styles.logoutText}>Cerrar Sesión</Text>
      </TouchableOpacity>

      <View style={styles.footer}>
        <Text style={styles.footerText}>TravelReel v1.0.0</Text>
        <Text style={styles.footerSubtext}>Hecho con ❤️ para viajeros</Text>
      </View>
    </ScrollView>
  );

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#667eea', '#764ba2']}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>
          {isLoggedIn ? 'Mi Perfil' : 'Iniciar Sesión'}
        </Text>
        <Text style={styles.headerSubtitle}>
          {isLoggedIn 
            ? 'Gestiona tu cuenta y preferencias' 
            : 'Únete a la comunidad de viajeros'
          }
        </Text>
      </LinearGradient>

      {isLoggedIn ? renderProfileScreen() : renderLoginScreen()}
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
  
  // Login Screen Styles
  loginContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  loginIconContainer: {
    backgroundColor: '#FFF5F5',
    borderRadius: 40,
    padding: 24,
    marginBottom: 32,
  },
  loginTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1F2937',
    marginBottom: 16,
    textAlign: 'center',
  },
  loginSubtitle: {
    fontSize: 16,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 40,
  },
  loginButtons: {
    width: '100%',
    marginBottom: 32,
  },
  loginButton: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
  },
  loginButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    paddingHorizontal: 24,
  },
  loginButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    marginLeft: 12,
  },
  googleButton: {
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
  },
  googleButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    paddingHorizontal: 24,
  },
  googleIcon: {
    fontSize: 18,
    fontWeight: '700',
    color: '#4285F4',
  },
  googleButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginLeft: 12,
  },
  termsText: {
    fontSize: 12,
    color: '#9CA3AF',
    textAlign: 'center',
    lineHeight: 18,
  },

  // Profile Screen Styles
  profileContent: {
    flex: 1,
    paddingTop: 16,
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginBottom: 24,
    padding: 20,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  avatarContainer: {
    marginRight: 16,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: '#64748B',
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 32,
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
  settingsSection: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 12,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingText: {
    fontSize: 16,
    color: '#1F2937',
    marginLeft: 12,
    fontWeight: '500',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FEF2F2',
    marginHorizontal: 16,
    marginBottom: 32,
    paddingVertical: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  logoutText: {
    fontSize: 16,
    color: '#EF4444',
    fontWeight: '600',
    marginLeft: 8,
  },
  footer: {
    alignItems: 'center',
    paddingBottom: 32,
  },
  footerText: {
    fontSize: 14,
    color: '#9CA3AF',
    fontWeight: '500',
  },
  footerSubtext: {
    fontSize: 12,
    color: '#CBD5E1',
    marginTop: 4,
  },
});