import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { Card, Text, Button } from 'react-native-paper';
import { FoodItem } from '../types/food';

interface FoodCardProps {
  item: FoodItem;
  onOrder: (item: FoodItem) => void;
  loading?: boolean;
}

export default function FoodCard({ item, onOrder, loading }: FoodCardProps) {
  return (
    <Card style={styles.card}>
      <Card.Cover source={{ uri: item.image_url }} style={styles.image} />
      <Card.Content style={styles.content}>
        <Text variant="titleMedium" style={styles.name}>{item.name}</Text>
        <Text variant="bodyMedium" style={styles.description}>{item.description}</Text>
        <Text variant="titleMedium" style={styles.price}>{item.price.toFixed(2)} Lei</Text>
      </Card.Content>
      <Card.Actions style={styles.actions}>
        <Button
          mode="contained"
          onPress={() => onOrder(item)}
          loading={loading}
          disabled={loading}
          style={styles.button}
        >
          Order Now
        </Button>
      </Card.Actions>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    margin: 8,
    elevation: 4,
  },
  image: {
    height: 200,
  },
  content: {
    padding: 16,
  },
  name: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  description: {
    color: '#666',
    marginBottom: 8,
  },
  price: {
    color: '#FF6B6B',
    fontWeight: 'bold',
  },
  actions: {
    padding: 8,
  },
  button: {
    flex: 1,
  },
}); 