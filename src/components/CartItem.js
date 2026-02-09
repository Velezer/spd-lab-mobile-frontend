import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/colors';
import { formatRupiah } from '../utils/format';

const CartItem = ({ item, onUpdateQuantity, onRemove }) => {
  const { product, quantity } = item;
  const subtotal = product.price * quantity;

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: product.imgUrl }}
        style={styles.image}
        defaultSource={require('../../assets/icon.png')}
      />
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={2}>
          {product.name}
        </Text>
        <Text style={styles.price}>{formatRupiah(product.price)}</Text>
        <View style={styles.actions}>
          <View style={styles.quantityControl}>
            <TouchableOpacity
              style={styles.qtyButton}
              onPress={() => onUpdateQuantity(product._id, quantity - 1)}
            >
              <Ionicons name="remove" size={16} color={Colors.textPrimary} />
            </TouchableOpacity>
            <Text style={styles.qtyText}>{quantity}</Text>
            <TouchableOpacity
              style={styles.qtyButton}
              onPress={() => onUpdateQuantity(product._id, quantity + 1)}
            >
              <Ionicons name="add" size={16} color={Colors.textPrimary} />
            </TouchableOpacity>
          </View>
          <TouchableOpacity onPress={() => onRemove(product._id)}>
            <Ionicons name="trash-outline" size={20} color={Colors.danger} />
          </TouchableOpacity>
        </View>
        <Text style={styles.subtotal}>{formatRupiah(subtotal)}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: Colors.gray200,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: Colors.gray100,
  },
  info: {
    flex: 1,
    marginLeft: 12,
  },
  name: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  price: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginBottom: 8,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  quantityControl: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.gray200,
    borderRadius: 6,
  },
  qtyButton: {
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  qtyText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textPrimary,
    minWidth: 28,
    textAlign: 'center',
  },
  subtotal: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.gray900,
    marginTop: 6,
    textAlign: 'right',
  },
});

export default CartItem;
