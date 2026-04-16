// App.tsx
//
// FIX: "props.pointerEvents is deprecated. Use style.pointerEvents"
//
// This warning comes from @react-navigation/stack (JS-based stack).
// It passes `pointerEvents` as a prop to View, which is deprecated
// in React Native 0.81+. The fix is to switch to:
//   @react-navigation/native-stack  ← uses native UINavigationController
//
// native-stack is faster, uses native animations, and does NOT have
// the pointerEvents prop issue because it doesn't use animated Views
// the same way the JS stack does.
//
// Install command (run this once):
//   npx expo install @react-navigation/native-stack

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack'; // ← CHANGED
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Platform, View, ActivityIndicator, Text } from 'react-native';
import { OfflineProvider } from './src/context/OfflineContext';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import HomeScreen from './src/screens/HomeScreen';
import QuizScreen from './src/screens/QuizScreen';
import ResultScreen from './src/screens/ResultScreen';
import LoginScreen from './src/screens/LoginScreen';
import ProfileScreen from './src/screens/ProfileScreen';

const Stack = createNativeStackNavigator(); // ← CHANGED from createStackNavigator
const Tab = createBottomTabNavigator();

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: '#556B2F' },
        headerTintColor: '#FFFAF0',
        headerTitleStyle: { fontWeight: '700' },
        tabBarActiveTintColor: '#556B2F',
        tabBarInactiveTintColor: '#9aab7a',
        tabBarStyle: {
          backgroundColor: 'white',
          borderTopColor: '#e8edda',
          borderTopWidth: 1,
        },
        tabBarLabelStyle: { fontSize: 12, fontWeight: '600' },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: '◈ QuizForge',
          tabBarLabel: 'Home',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>🏠</Text>,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: 'My Profile',
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>👤</Text>,
        }}
      />
    </Tab.Navigator>
  );
}

function RootNavigator() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#556B2F' }}>
        <Text style={{ fontSize: 40, marginBottom: 16 }}>◈</Text>
        <ActivityIndicator size="large" color="#FFDAB9" />
      </View>
    );
  }

  return (
    // native-stack uses NativeStackNavigatorProps — screenOptions differ slightly
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {user ? (
        <>
          <Stack.Screen name="MainTabs" component={MainTabs} />
          <Stack.Screen
            name="Quiz"
            component={QuizScreen}
            options={{
              headerShown: true,
              headerStyle: { backgroundColor: '#556B2F' },
              headerTintColor: '#FFFAF0',
              headerTitleStyle: { fontWeight: '700' },
              title: 'Quiz',
              // native-stack uses headerBackVisible instead of headerBackTitleVisible
              headerBackVisible: true,
            }}
          />
          <Stack.Screen
            name="Result"
            component={ResultScreen}
            options={{
              headerShown: true,
              headerStyle: { backgroundColor: '#556B2F' },
              headerTintColor: '#FFFAF0',
              headerTitleStyle: { fontWeight: '700' },
              title: 'Results',
              // Prevent going back from Results (user must press "Try Again" or "Home")
              headerBackVisible: false,
              gestureEnabled: false,    // ← native-stack prop (replaces gestureEnabled on JS stack)
            }}
          />
        </>
      ) : (
        <Stack.Screen name="Login" component={LoginScreen} />
      )}
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <AuthProvider>
          <OfflineProvider>
            <NavigationContainer>
              <StatusBar style="light" />
              {/*
                REMOVED: <View style={{ flex: 1, overflow: 'hidden' }}>
                That extra View wrapper with overflow:hidden was fighting
                with RNW's scroll context. The NavigationContainer itself
                already handles layout correctly.
              */}
              <RootNavigator />
            </NavigationContainer>
          </OfflineProvider>
        </AuthProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}