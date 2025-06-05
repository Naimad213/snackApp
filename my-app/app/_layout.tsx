import 'react-native-gesture-handler';
import 'react-native-reanimated';
import 'react-native-url-polyfill/auto';
import React from 'react';
import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { PaperProvider, ActivityIndicator, Snackbar } from 'react-native-paper';
import { View, StyleSheet } from 'react-native';
import { MD3LightTheme } from 'react-native-paper';
import { AuthProvider, useAuth } from '../contexts/AuthContext';
import { SupabaseProvider } from '../contexts/SupabaseProvider';

const theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#0A192F',
    secondary: '#112240',
    background: '#F8F9FA',
    surface: '#FFFFFF',
    error: '#FF5252',
    text: '#333333',
    accent: '#64FFDA',
  },
};

function AuthWrapper({ children }: { children: React.ReactNode }) {
  const { session, loading, error, retry } = useAuth();
  const [snackbarVisible, setSnackbarVisible] = React.useState(false);

  React.useEffect(() => {
    if (error) {
      setSnackbarVisible(true);
    }
  }, [error]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <>
      {children}
      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        action={{
          label: 'Retry',
          onPress: () => {
            setSnackbarVisible(false);
            retry();
          },
        }}
      >
        {error?.message || 'An error occurred'}
      </Snackbar>
    </>
  );
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={styles.container}>
      <PaperProvider theme={theme}>
        <SafeAreaProvider>
          <AuthProvider>
            <SupabaseProvider>
              <AuthWrapper>
                <Stack screenOptions={{ headerShown: false }}>
                  <Stack.Screen name="(auth)" />
                  <Stack.Screen name="(tabs)" />
                </Stack>
              </AuthWrapper>
            </SupabaseProvider>
          </AuthProvider>
        </SafeAreaProvider>
      </PaperProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
}); 