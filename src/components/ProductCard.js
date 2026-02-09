import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Colors } from '../constants/colors';
import { formatRupiah } from '../utils/format';

const ProductCard = ({ product, onPress }) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
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
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 10,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.gray200,
    flex: 1,
    margin: 6,
  },
  image: {
    width: '100%',
    height: 150,
    backgroundColor: Colors.gray100,
  },
  info: {
    padding: 10,
  },
  name: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  price: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.gray900,
  },
});

export default ProductCard;
