import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, RefreshControl } from 'react-native';
import { Text, ActivityIndicator, Card, Chip, Snackbar } from 'react-native-paper';
import { useAuth } from '../../contexts/AuthContext';
import supabase from '../../app/config/supabase';
import { Order } from '../../types/food';

export default function OrdersScreen() {
  const { session } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (
            *,
            food_item:food_items (*)
          )
        `)
        .eq('user_id', session?.user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch orders');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (session?.user) {
      fetchOrders();
    }
  }, [session?.user]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return '#FFA500';
      case 'preparing':
        return '#1E90FF';
      case 'ready':
        return '#32CD32';
      case 'delivered':
        return '#808080';
      case 'cancelled':
        return '#FF0000';
      default:
        return '#808080';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchOrders();
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
        data={orders}
        renderItem={({ item }) => (
          <Card style={styles.card}>
            <Card.Content>
              <View style={styles.orderHeader}>
                <Text variant="titleMedium">Order #{item.id.slice(0, 8)}</Text>
                <Chip
                  mode="flat"
                  style={[styles.statusChip, { backgroundColor: getStatusColor(item.status) }]}
                >
                  {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                </Chip>
              </View>
              <Text variant="bodyMedium" style={styles.date}>
                {formatDate(item.created_at)}
              </Text>
              <Text variant="titleMedium" style={styles.total}>
                Total: ${item.total_amount.toFixed(2)}
              </Text>
              {item.order_items?.map((orderItem) => (
                <View key={orderItem.id} style={styles.orderItem}>
                  <Text variant="bodyMedium">
                    {orderItem.quantity}x {orderItem.food_item?.name}
                  </Text>
                  <Text variant="bodyMedium">
                    ${(orderItem.price_at_time * orderItem.quantity).toFixed(2)}
                  </Text>
                </View>
              ))}
            </Card.Content>
          </Card>
        )}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.centered}>
            <Text>No orders found</Text>
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
    backgroundColor: '#0A192F',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    margin: 8,
    backgroundColor: '#112240',
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  statusChip: {
    height: 24,
  },
  date: {
    color: '#8892B0',
    marginBottom: 8,
  },
  total: {
    marginTop: 8,
    marginBottom: 8,
    color: '#64FFDA',
  },
  orderItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 4,
  },
}); 