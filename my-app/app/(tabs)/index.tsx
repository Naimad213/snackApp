import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, RefreshControl } from 'react-native';
import { Text, ActivityIndicator, Snackbar } from 'react-native-paper';
import { useAuth } from '../../contexts/AuthContext';
import supabase from '../../app/config/supabase';
import FoodCard from '../../components/FoodCard';
import { FoodItem } from '../../types/food';

export default function HomeScreen() {
  const { session } = useAuth();
  const [foodItems, setFoodItems] = useState<FoodItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [orderingItem, setOrderingItem] = useState<string | null>(null);

  const fetchFoodItems = async () => {
    try {
      const { data, error } = await supabase
        .from('food_items')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setFoodItems(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch food items');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchFoodItems();
  }, []);

  const handleOrder = async (item: FoodItem) => {
    if (!session?.user) {
      setError('You must be logged in to place an order');
      return;
    }

    try {
      setOrderingItem(item.id);
      setError(null);

      // Start a transaction
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: session.user.id,
          total_amount: item.price,
          status: 'pending'
        })
        .select()
        .single();

      if (orderError) {
        console.error('Order creation error:', orderError);
        throw new Error(orderError.message);
      }

      if (!order) {
        throw new Error('Failed to create order');
      }

      // Add the order item
      const { error: itemError } = await supabase
        .from('order_items')
        .insert({
          order_id: order.id,
          food_item_id: item.id,
          quantity: 1,
          price_at_time: item.price
        });

      if (itemError) {
        console.error('Order item creation error:', itemError);
        throw new Error(itemError.message);
      }

      // Show success message
      setError('Order placed successfully!');
      
      // Refresh the food items list
      fetchFoodItems();
    } catch (err) {
      console.error('Order error:', err);
      setError(err instanceof Error ? err.message : 'Failed to place order');
    } finally {
      setOrderingItem(null);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchFoodItems();
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={foodItems}
        renderItem={({ item }) => (
          <FoodCard
            item={item}
            onOrder={handleOrder}
            loading={orderingItem === item.id}
          />
        )}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.centered}>
            <Text>No food items available</Text>
          </View>
        }
      />
      <Snackbar
        visible={!!error}
        onDismiss={() => setError(null)}
        duration={3000}
        action={{
          label: 'Dismiss',
          onPress: () => setError(null),
        }}
      >
        {error}
      </Snackbar>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
}); 