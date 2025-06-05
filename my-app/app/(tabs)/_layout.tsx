import { Tabs } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function TabLayout() {
  return (
    <Tabs screenOptions={{
      tabBarActiveTintColor: '#64FFDA',
      tabBarInactiveTintColor: '#8892B0',
      tabBarStyle: {
        backgroundColor: '#0A192F',
        borderTopWidth: 1,
        borderTopColor: '#112240',
      },
      headerStyle: {
        backgroundColor: '#0A192F',
      },
      headerTintColor: '#64FFDA',
    }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="home" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="orders"
        options={{
          title: 'Orders',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="clipboard-list" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
} 