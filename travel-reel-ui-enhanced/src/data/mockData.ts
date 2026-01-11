import { Trip, Itinerary, Stop, User } from '@/types';

export const mockUser: User = {
  id: '1',
  name: 'Alex Rivera',
  email: 'alex@example.com',
  isPremium: false,
};

export const mockStops: Stop[] = [
  {
    id: '1',
    name: 'Colosseum',
    description: 'Start your day at the iconic amphitheater. Get there early to avoid crowds.',
    duration: '2h',
    order: 1,
    category: 'iconico',
    coordinates: { lat: 41.8902, lng: 12.4922 },
  },
  {
    id: '2',
    name: 'Trattoria da Enzo',
    description: 'Authentic Roman cuisine in Trastevere. Try the cacio e pepe!',
    duration: '1.5h',
    order: 2,
    category: 'gastronomia',
    coordinates: { lat: 41.8892, lng: 12.4696 },
  },
  {
    id: '3',
    name: 'Vatican Museums',
    description: 'Explore centuries of art including the Sistine Chapel.',
    duration: '3h',
    order: 3,
    category: 'cultura',
    coordinates: { lat: 41.9065, lng: 12.4536 },
  },
  {
    id: '4',
    name: 'Villa Borghese Gardens',
    description: 'Relax in Rome\'s most famous park with stunning views.',
    duration: '1h',
    order: 4,
    category: 'naturaleza',
    coordinates: { lat: 41.9145, lng: 12.4924 },
  },
  {
    id: '5',
    name: 'Via del Corso',
    description: 'Rome\'s main shopping street with Italian brands.',
    duration: '1.5h',
    order: 5,
    category: 'compras',
    coordinates: { lat: 41.9010, lng: 12.4800 },
  },
];

export const mockItinerary: Itinerary = {
  id: '1',
  title: 'Perfect Day in Rome',
  city: 'Rome, Italy',
  date: '2024-03-15',
  totalTime: '9 hours',
  stops: mockStops,
  sourceUrl: 'https://instagram.com/reel/example',
};

export const mockTrips: Trip[] = [
  {
    id: '1',
    name: 'Italian Adventure',
    destination: 'Italy',
    startDate: '2024-03-14',
    endDate: '2024-03-21',
    coverImage: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800',
    itineraries: [mockItinerary],
  },
  {
    id: '2',
    name: 'Tokyo Explorer',
    destination: 'Japan',
    startDate: '2024-04-10',
    endDate: '2024-04-18',
    coverImage: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800',
    itineraries: [],
  },
  {
    id: '3',
    name: 'Barcelona Weekend',
    destination: 'Spain',
    startDate: '2024-05-01',
    endDate: '2024-05-04',
    coverImage: 'https://images.unsplash.com/photo-1583422409516-2895a77efded?w=800',
    itineraries: [],
  },
];
