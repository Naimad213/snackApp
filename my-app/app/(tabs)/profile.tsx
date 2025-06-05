import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, Text } from 'react-native-paper';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../config/supabase';

export default function ProfileScreen() {
  const { session } = useAuth();

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile</Text>
      <Text style={styles.email}>{session?.user?.email}</Text>
      <Button 
        mode="contained" 
        onPress={handleSignOut}
        style={styles.button}
        buttonColor="#64FFDA"
        textColor="#0A192F"
      >
        Sign Out
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#0A192F',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#64FFDA',
  },
  email: {
    fontSize: 16,
    marginBottom: 30,
    color: '#8892B0',
  },
  button: {
    marginTop: 20,
  },
}); 