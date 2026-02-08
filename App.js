import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { View, ActivityIndicator } from 'react-native';
import { Audio } from 'expo-av';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import SearchScreen from './src/screens/SearchScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import { ThemeProvider, useTheme } from './src/context/ThemeContext';
import { storageService } from './src/services/storageService';

const Tab = createBottomTabNavigator();

// Default API key that will be auto-saved on first launch
const DEFAULT_OPENAI_KEY = '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';

function AppContent() {
  const { theme, isDark } = useTheme();
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize API key on first app launch
  useEffect(() => {
    initializeApiKey();
    configureAudio();
  }, []);

  const configureAudio = async () => {
    try {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        playsInSilentModeIOS: true,
        interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
        interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
        shouldDuckAndroid: true,
        staysActiveInBackground: false,
      });
    } catch (error) {
      console.warn('Audio mode setup failed:', error);
    }
  };

  const initializeApiKey = async () => {
    try {
      const savedApiKey = await storageService.getApiKey();

      // If no API key is saved, save the default one automatically
      if (!savedApiKey) {
        console.log('No API key found, saving default OpenAI key...');
        await storageService.saveApiKey(DEFAULT_OPENAI_KEY);
        await storageService.saveProvider('openai');
        console.log('✅ API key saved automatically!');
      } else {
        console.log('✅ API key already configured');
      }
    } catch (error) {
      console.error('Error initializing API key:', error);
    } finally {
      setIsInitialized(true);
    }
  };

  if (!isInitialized) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.background }}>
        <ActivityIndicator size="large" color={theme.primary} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <Tab.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: theme.surface,
            borderBottomColor: theme.border,
            borderBottomWidth: 0,
            elevation: 0,
            shadowOpacity: 0,
          },
          headerTintColor: theme.text,
          headerTitleStyle: {
            fontSize: 18,
            fontWeight: '700',
          },
          tabBarStyle: {
            backgroundColor: theme.surface,
            borderTopColor: theme.border,
            borderTopWidth: 1,
            height: 64,
            paddingVertical: 10,
          },
          tabBarActiveTintColor: theme.primary,
          tabBarInactiveTintColor: theme.textSecondary,
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: '600',
          },
        }}
      >
        <Tab.Screen
          name="Recherche"
          component={SearchScreen}
          options={{
            title: 'DJ PRAFUL D',
            headerShown: false,
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="search" size={size} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="Paramètres"
          component={SettingsScreen}
          options={{
            title: 'Paramètres',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="settings-outline" size={size} color={color} />
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}
