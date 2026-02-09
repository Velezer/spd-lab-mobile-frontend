import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/colors';
import { formatRupiah } from '../../utils/format';
import { useCart } from '../../contexts/CartContext';
import api from '../../api/axiosInstance';
import Button from '../../components/Button';
import LoadingSpinner from '../../components/LoadingSpinner';
import { TouchableOpacity } from 'react-native';

const ProductDetailScreen = ({ route }) => {
  const { productId } = route.params;
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await api.get(`/api/products/${productId}`);
        setProduct(response.data);
      } catch {
        Alert.alert('Error', 'Gagal memuat detail produk');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [productId]);

  const handleAddToCart = () => {
    if (!product) return;
    addToCart(product, quantity);
    Alert.alert('Berhasil', `${product.name} ditambahkan ke keranjang`);
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!product) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Produk tidak ditemukan</Text>
      </View>
    );
  }

  const isOutOfStock = product.quantity <= 0;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Image
        source={{ uri: product.imgUrl }}
        style={styles.image}
        defaultSource={require('../../../assets/icon.png')}
      />
      <View style={styles.details}>
        <Text style={styles.name}>{product.name}</Text>
        <Text style={styles.price}>{formatRupiah(product.price)}</Text>

        <View style={styles.stockRow}>
          <Ionicons
            name={isOutOfStock ? 'close-circle-outline' : 'checkmark-circle-outline'}
            size={18}
            color={isOutOfStock ? Colors.danger : Colors.textSecondary}
          />
          <Text
            style={[styles.stockText, isOutOfStock && styles.outOfStockText]}
          >
            {isOutOfStock ? 'Stok Habis' : `Stok: ${product.quantity}`}
          </Text>
        </View>

        <View style={styles.divider} />

        <Text style={styles.descriptionLabel}>Deskripsi</Text>
        <Text style={styles.description}>{product.description}</Text>

        <View style={styles.divider} />

        {!isOutOfStock && (
          <View style={styles.quantitySection}>
            <Text style={styles.quantityLabel}>Jumlah</Text>
            <View style={styles.quantityControl}>
              <TouchableOpacity
                style={styles.qtyButton}
                onPress={() => setQuantity(Math.max(1, quantity - 1))}
              >
                <Ionicons name="remove" size={20} color={Colors.textPrimary} />
              </TouchableOpacity>
              <Text style={styles.qtyText}>{quantity}</Text>
              <TouchableOpacity
                style={styles.qtyButton}
                onPress={() =>
                  setQuantity(Math.min(product.quantity, quantity + 1))
                }
              >
                <Ionicons name="add" size={20} color={Colors.textPrimary} />
              </TouchableOpacity>
            </View>
          </View>
        )}

        <Button
          title={isOutOfStock ? 'Stok Habis' : 'Tambah ke Keranjang'}
          onPress={handleAddToCart}
          disabled={isOutOfStock}
          style={styles.addButton}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    paddingBottom: 32,
  },
  image: {
    width: '100%',
    height: 300,
    backgroundColor: Colors.gray100,
  },
  details: {
    padding: 20,
  },
  name: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  price: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.gray900,
    marginBottom: 12,
  },
  stockRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  stockText: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  outOfStockText: {
    color: Colors.danger,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.gray200,
    marginVertical: 16,
  },
  descriptionLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 22,
  },
  quantitySection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  quantityLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  quantityControl: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.gray200,
    borderRadius: 8,
    backgroundColor: Colors.surface,
  },
  qtyButton: {
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  qtyText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textPrimary,
    minWidth: 36,
    textAlign: 'center',
  },
  addButton: {
    marginTop: 4,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
  },
  errorText: {
    fontSize: 16,
    color: Colors.textMuted,
  },
});

export default ProductDetailScreen;
