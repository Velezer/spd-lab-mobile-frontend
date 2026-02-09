import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, FlatList, RefreshControl } from 'react-native';
import { Colors } from '../../constants/colors';
import api from '../../api/axiosInstance';
import OrderCard from '../../components/OrderCard';
import LoadingSpinner from '../../components/LoadingSpinner';
import EmptyState from '../../components/EmptyState';

const OrderListScreen = ({ navigation }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchOrders = useCallback(async () => {
    try {
      const response = await api.get('/api/orders');
      setOrders(response.data);
    } catch {
      // silently fail
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchOrders();
    });
    return unsubscribe;
  }, [navigation, fetchOrders]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchOrders();
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={orders}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <OrderCard
            order={item}
            onPress={() =>
              navigation.navigate('OrderDetail', { orderId: item._id })
            }
          />
        )}
        contentContainerStyle={
          orders.length === 0 ? styles.emptyList : styles.listContent
        }
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={Colors.black}
          />
        }
        ListEmptyComponent={
          <EmptyState
            icon="receipt-outline"
            title="Belum ada pesanan"
            subtitle="Pesanan Anda akan muncul di sini"
          />
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  listContent: {
    padding: 16,
  },
  emptyList: {
    flexGrow: 1,
  },
});

export default OrderListScreen;
