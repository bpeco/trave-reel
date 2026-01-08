import { Stack } from 'expo-router';

export default function MainLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="new-trip"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="trip/[tripId]"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="itinerary/[itineraryId]"
        options={{ headerShown: false }}
      />
    </Stack>
  );
}