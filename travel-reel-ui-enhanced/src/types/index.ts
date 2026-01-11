export type Category = 'cultura' | 'gastronomia' | 'naturaleza' | 'iconico' | 'compras';

export interface Stop {
  id: string;
  name: string;
  description: string;
  duration: string;
  order: number;
  category: Category;
  coordinates?: {
    lat: number;
    lng: number;
  };
  imageUrl?: string;
}

export interface Itinerary {
  id: string;
  title: string;
  city: string;
  date: string;
  totalTime: string;
  stops: Stop[];
  coverImage?: string;
  sourceUrl?: string;
}

export interface Trip {
  id: string;
  name: string;
  destination: string;
  startDate: string;
  endDate: string;
  coverImage: string;
  itineraries: Itinerary[];
}

export type ProcessingState = 
  | 'idle'
  | 'downloading'
  | 'transcribing'
  | 'generating'
  | 'geocoding'
  | 'success'
  | 'error';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  isPremium: boolean;
}
