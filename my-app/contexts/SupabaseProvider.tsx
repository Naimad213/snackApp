import React, { createContext, useContext, useEffect } from 'react';
import { useAuth } from './AuthContext';
import supabase from '../app/config/supabase';
import { Alert } from 'react-native';

type SupabaseContextType = {
  // Add any methods or state you want to expose
};

const SupabaseContext = createContext<SupabaseContextType>({});

export const useSupabase = () => useContext(SupabaseContext);

export const SupabaseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { session } = useAuth();

  useEffect(() => {
    if (!session?.user) return;

    // Subscribe to order updates
    const orderChannel = supabase
      .channel('order-updates')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'orders',
          filter: `user_id=eq.${session.user.id}`,
        },
        (payload) => {
          const updatedOrder = payload.new;
          console.log('Order updated:', updatedOrder);
          
          // Show an alert for order status changes
          Alert.alert(
            'Order Update',
            `Your order is now "${updatedOrder.status}"`,
            [{ text: 'OK' }]
          );
        }
      )
      .subscribe();

    // Subscribe to new order items
    const orderItemsChannel = supabase
      .channel('order-items-updates')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'order_items',
          filter: `order_id=in.(select id from orders where user_id=eq.${session.user.id})`,
        },
        (payload) => {
          const newOrderItem = payload.new;
          console.log('New order item:', newOrderItem);
        }
      )
      .subscribe();

    // Cleanup subscriptions
    return () => {
      supabase.removeChannel(orderChannel);
      supabase.removeChannel(orderItemsChannel);
    };
  }, [session?.user]);

  return (
    <SupabaseContext.Provider value={{}}>
      {children}
    </SupabaseContext.Provider>
  );
}; 