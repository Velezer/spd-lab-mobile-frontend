import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  RefreshControl,
} from 'react-native';
import { Colors } from '../../constants/colors';
import api from '../../api/axiosInstance';
import ProductCard from '../../components/ProductCard';
import LoadingSpinner from '../../components/LoadingSpinner';
import EmptyState from '../../components/EmptyState';

const ProductListScreen = ({ navigation }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchProducts = useCallback(async () => {
    try {
      const response = await api.get('/api/products');
      setProducts(response.data);
    } catch {
      // silently fail
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchProducts();
    });
    return unsubscribe;
  }, [navigation, fetchProducts]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchProducts();
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={products}
        keyExtractor={(item) => item._id}
        numColumns={2}
        renderItem={({ item }) => (
          <ProductCard
            product={item}
            onPress={() =>
              navigation.navigate('ProductDetail', { productId: item._id })
            }
          />
        )}
        contentContainerStyle={
          products.length === 0 ? styles.emptyList : styles.listContent
        }
        columnWrapperStyle={products.length > 0 ? styles.row : undefined}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={Colors.black}
          />
        }
        ListEmptyComponent={
          <EmptyState
            icon="cube-outline"
            title="Belum ada produk"
            subtitle="Produk akan muncul di sini"
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
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  emptyList: {
    flexGrow: 1,
  },
  row: {
    justifyContent: 'space-between',
  },
});

export default ProductListScreen;
