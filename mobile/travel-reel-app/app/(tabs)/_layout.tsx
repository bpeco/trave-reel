// app/(tabs)/_layout.tsx
import { Tabs } from 'expo-router'
import { MapPin, Plus, User, Palette } from 'lucide-react-native'

export default function TabLayout() {
  return (
    <Tabs
      initialRouteName="index"
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#FF6B6B',
        tabBarInactiveTintColor: '#94A3B8',
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 0,
          paddingTop: 8,
          paddingBottom: 8,
          height: 88,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
          marginTop: 4,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Mis Viajes',
          tabBarIcon: ({ size, color }) => <MapPin size={size} color={color} strokeWidth={2} />,
        }}
      />
      <Tabs.Screen
        name="create"
        options={{
          title: 'Crear',
          tabBarIcon: ({ size, color }) => <Plus size={size} color={color} strokeWidth={2} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Perfil',
          tabBarIcon: ({ size, color }) => <User size={size} color={color} strokeWidth={2} />,
        }}
      />
      <Tabs.Screen
        name="design-system"
        options={{
          title: 'Design',
          tabBarIcon: ({ size, color }) => <Palette size={size} color={color} strokeWidth={2} />,
        }}
      />
    </Tabs>
  )
}
