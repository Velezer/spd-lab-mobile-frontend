import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { Colors } from '../../constants/colors';
import { formatRupiah } from '../../utils/format';
import { useCart } from '../../contexts/CartContext';
import CartItem from '../../components/CartItem';
import Button from '../../components/Button';
import EmptyState from '../../components/EmptyState';

const CartScreen = ({ navigation }) => {
  const { items, totalPrice, updateQuantity, removeFromCart } = useCart();

  if (items.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <EmptyState
          icon="cart-outline"
          title="Keranjang Anda kosong"
          subtitle="Mulai belanja dan tambahkan produk ke keranjang"
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={items}
        keyExtractor={(item) => item.product._id}
        renderItem={({ item }) => (
          <CartItem
            item={item}
            onUpdateQuantity={updateQuantity}
            onRemove={removeFromCart}
          />
        )}
        contentContainerStyle={styles.listContent}
      />
      <View style={styles.footer}>
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalPrice}>{formatRupiah(totalPrice)}</Text>
        </View>
        <Button
          title="Checkout"
          onPress={() => navigation.navigate('Checkout')}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  emptyContainer: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  listContent: {
    padding: 16,
  },
  footer: {
    backgroundColor: Colors.surface,
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.gray200,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  totalPrice: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.gray900,
  },
});

export default CartScreen;
