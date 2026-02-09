import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/colors';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../api/axiosInstance';
import ProductCard from '../../components/ProductCard';
import LoadingSpinner from '../../components/LoadingSpinner';
import { useNavigation } from '@react-navigation/native';

const HomeScreen = () => {
  const { user } = useAuth();
  const navigation = useNavigation();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchProducts = useCallback(async () => {
    try {
      const response = await api.get('/api/products?limit=6');
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

  const onRefresh = () => {
    setRefreshing(true);
    fetchProducts();
  };

  const userName = user?.name || user?.email || 'Pengguna';

  const renderHeader = () => (
    <View>
      <View style={styles.greeting}>
        <View>
          <Text style={styles.greetingSmall}>Selamat datang,</Text>
          <Text style={styles.greetingName}>Halo, {userName}!</Text>
        </View>
        <TouchableOpacity
          onPress={() => navigation.navigate('CartTab')}
          style={styles.cartIcon}
        >
          <Ionicons name="cart-outline" size={26} color={Colors.textPrimary} />
        </TouchableOpacity>
      </View>

      <View style={styles.banner}>
        <Text style={styles.bannerTitle}>SPD Marketplace</Text>
        <Text style={styles.bannerSubtitle}>
          Temukan produk terbaik untuk kebutuhan Anda
        </Text>
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Produk Terbaru</Text>
        <TouchableOpacity
          onPress={() => navigation.navigate('ProductTab')}
        >
          <Text style={styles.seeAll}>Lihat Semua</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={products}
        keyExtractor={(item) => item._id}
        numColumns={2}
        renderItem={({ item }) => (
          <ProductCard
            product={item}
            onPress={() =>
              navigation.navigate('ProductTab', {
                screen: 'ProductDetail',
                params: { productId: item._id },
              })
            }
          />
        )}
        ListHeaderComponent={renderHeader}
        contentContainerStyle={styles.listContent}
        columnWrapperStyle={styles.row}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={Colors.black}
          />
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  listContent: {
    paddingHorizontal: 12,
    paddingBottom: 20,
  },
  row: {
    justifyContent: 'space-between',
  },
  greeting: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingTop: 16,
    paddingBottom: 12,
  },
  greetingSmall: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  greetingName: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginTop: 2,
  },
  cartIcon: {
    padding: 8,
  },
  banner: {
    backgroundColor: Colors.gray900,
    borderRadius: 12,
    padding: 24,
    marginHorizontal: 6,
    marginBottom: 20,
  },
  bannerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.white,
    marginBottom: 6,
  },
  bannerSubtitle: {
    fontSize: 14,
    color: Colors.gray300,
    lineHeight: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 6,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  seeAll: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
});

export default HomeScreen;
