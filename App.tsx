import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// Import screens
import DashboardScreen from './src/screens/DashboardScreen';
import ChatScreen from './src/screens/ChatScreen';
import IntegrationScreen from './src/screens/IntegrationScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import LiveFeedsScreen from './src/screens/LiveFeedsScreen';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <StatusBar style="auto" />
        <Tab.Navigator
          screenOptions={{
            headerShown: true,
            tabBarActiveTintColor: '#007bff',
            tabBarInactiveTintColor: '#6c757d',
            tabBarStyle: {
              paddingBottom: 5,
              paddingTop: 5,
              height: 60,
            },
          }}
        >
          <Tab.Screen 
            name="Dashboard" 
            component={DashboardScreen}
            options={{
              tabBarLabel: 'Dashboard',
              title: 'Backtest Dashboard',
            }}
          />
          <Tab.Screen 
            name="LiveFeeds" 
            component={LiveFeedsScreen}
            options={{
              tabBarLabel: 'Live Feeds',
              title: 'Live Market Feeds',
            }}
          />
          <Tab.Screen 
            name="Chat" 
            component={ChatScreen}
            options={{
              tabBarLabel: 'Chat',
              title: 'Trading Assistant',
            }}
          />
          <Tab.Screen 
            name="Integration" 
            component={IntegrationScreen}
            options={{
              tabBarLabel: 'Integration',
              title: 'API Integration',
            }}
          />
          <Tab.Screen 
            name="Settings" 
            component={SettingsScreen}
            options={{
              tabBarLabel: 'Settings',
              title: 'Settings',
            }}
          />
        </Tab.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
