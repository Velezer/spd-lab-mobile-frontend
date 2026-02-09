import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/colors';
import { formatRupiah } from '../../utils/format';
import { useCart } from '../../contexts/CartContext';
import api from '../../api/axiosInstance';
import Input from '../../components/Input';
import Button from '../../components/Button';

const PAYMENT_METHODS = [
  { value: 'credit_card', label: 'Kartu Kredit' },
  { value: 'bank_transfer', label: 'Transfer Bank' },
  { value: 'e_wallet', label: 'E-Wallet' },
];

const CheckoutScreen = ({ navigation }) => {
  const { items, totalPrice, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [country, setCountry] = useState('Indonesia');
  const [paymentMethod, setPaymentMethod] = useState('credit_card');
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!street.trim()) newErrors.street = 'Alamat tidak boleh kosong';
    if (!city.trim()) newErrors.city = 'Kota tidak boleh kosong';
    if (!postalCode.trim()) newErrors.postalCode = 'Kode pos tidak boleh kosong';
    if (!country.trim()) newErrors.country = 'Negara tidak boleh kosong';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCheckout = async () => {
    if (!validate()) return;
    if (items.length === 0) {
      Alert.alert('Error', 'Keranjang kosong');
      return;
    }

    setLoading(true);
    try {
      const orderData = {
        items: items.map((item) => ({
          productId: item.product._id,
          quantity: item.quantity,
        })),
        shippingAddress: {
          street: street.trim(),
          city: city.trim(),
          postalCode: postalCode.trim(),
          country: country.trim(),
        },
        paymentMethod,
      };

      const response = await api.post('/api/orders', orderData);
      clearCart();
      Alert.alert('Pesanan Berhasil', 'Pesanan Anda telah dibuat!', [
        {
          text: 'Lihat Pesanan',
          onPress: () => {
            navigation.navigate('OrderTab', {
              screen: 'OrderDetail',
              params: { orderId: response.data.order._id },
            });
          },
        },
      ]);
    } catch (error) {
      const message =
        error.response?.data?.error || 'Gagal membuat pesanan. Silakan coba lagi.';
      Alert.alert('Error', message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={styles.sectionTitle}>Alamat Pengiriman</Text>

      <Input
        label="Alamat"
        value={street}
        onChangeText={setStreet}
        placeholder="Jl. Contoh No. 123"
        error={errors.street}
      />
      <Input
        label="Kota"
        value={city}
        onChangeText={setCity}
        placeholder="Jakarta"
        error={errors.city}
      />
      <Input
        label="Kode Pos"
        value={postalCode}
        onChangeText={setPostalCode}
        placeholder="12345"
        keyboardType="number-pad"
        error={errors.postalCode}
      />
      <Input
        label="Negara"
        value={country}
        onChangeText={setCountry}
        placeholder="Indonesia"
        error={errors.country}
      />

      <Text style={styles.sectionTitle}>Metode Pembayaran</Text>
      <View style={styles.paymentOptions}>
        {PAYMENT_METHODS.map((method) => (
          <TouchableOpacity
            key={method.value}
            style={[
              styles.paymentOption,
              paymentMethod === method.value && styles.paymentOptionSelected,
            ]}
            onPress={() => setPaymentMethod(method.value)}
          >
            <Ionicons
              name={
                paymentMethod === method.value
                  ? 'radio-button-on'
                  : 'radio-button-off'
              }
              size={20}
              color={
                paymentMethod === method.value
                  ? Colors.gray900
                  : Colors.gray400
              }
            />
            <Text
              style={[
                styles.paymentLabel,
                paymentMethod === method.value && styles.paymentLabelSelected,
              ]}
            >
              {method.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.sectionTitle}>Ringkasan Pesanan</Text>
      <View style={styles.summaryCard}>
        {items.map((item) => (
          <View key={item.product._id} style={styles.summaryItem}>
            <Text style={styles.summaryItemName} numberOfLines={1}>
              {item.product.name} x{item.quantity}
            </Text>
            <Text style={styles.summaryItemPrice}>
              {formatRupiah(item.product.price * item.quantity)}
            </Text>
          </View>
        ))}
        <View style={styles.summaryDivider} />
        <View style={styles.summaryItem}>
          <Text style={styles.summaryTotalLabel}>Total</Text>
          <Text style={styles.summaryTotalPrice}>
            {formatRupiah(totalPrice)}
          </Text>
        </View>
      </View>

      <Button
        title="Buat Pesanan"
        onPress={handleCheckout}
        loading={loading}
        style={styles.checkoutButton}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 14,
    marginTop: 8,
  },
  paymentOptions: {
    marginBottom: 16,
  },
  paymentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    padding: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.gray200,
    marginBottom: 8,
    gap: 10,
  },
  paymentOptionSelected: {
    borderColor: Colors.gray900,
    borderWidth: 1.5,
  },
  paymentLabel: {
    fontSize: 15,
    color: Colors.textSecondary,
  },
  paymentLabelSelected: {
    color: Colors.textPrimary,
    fontWeight: '600',
  },
  summaryCard: {
    backgroundColor: Colors.surface,
    borderRadius: 10,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.gray200,
    marginBottom: 20,
  },
  summaryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
  },
  summaryItemName: {
    fontSize: 14,
    color: Colors.textSecondary,
    flex: 1,
    marginRight: 12,
  },
  summaryItemPrice: {
    fontSize: 14,
    color: Colors.textPrimary,
    fontWeight: '500',
  },
  summaryDivider: {
    height: 1,
    backgroundColor: Colors.gray200,
    marginVertical: 10,
  },
  summaryTotalLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  summaryTotalPrice: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.gray900,
  },
  checkoutButton: {
    marginTop: 4,
  },
});

export default CheckoutScreen;
