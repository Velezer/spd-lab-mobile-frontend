import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { Colors } from '../../constants/colors';
import { formatRupiah, formatDate, truncateId } from '../../utils/format';
import api from '../../api/axiosInstance';
import Button from '../../components/Button';
import LoadingSpinner from '../../components/LoadingSpinner';

const PAYMENT_LABELS = {
  credit_card: 'Kartu Kredit',
  bank_transfer: 'Transfer Bank',
  e_wallet: 'E-Wallet',
};

const OrderDetailScreen = ({ route, navigation }) => {
  const { orderId } = route.params;
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await api.get(`/api/orders/${orderId}`);
        setOrder(response.data);
      } catch {
        Alert.alert('Error', 'Gagal memuat detail pesanan');
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [orderId]);

  const handleCancel = () => {
    Alert.alert(
      'Batalkan Pesanan',
      'Apakah Anda yakin ingin membatalkan pesanan ini?',
      [
        { text: 'Tidak', style: 'cancel' },
        {
          text: 'Ya, Batalkan',
          style: 'destructive',
          onPress: async () => {
            setCancelling(true);
            try {
              const response = await api.put(`/api/orders/${orderId}/status`, {
                status: 'cancelled',
              });
              setOrder(response.data);
              Alert.alert('Berhasil', 'Pesanan telah dibatalkan');
            } catch (error) {
              const message =
                error.response?.data?.error || 'Gagal membatalkan pesanan';
              Alert.alert('Error', message);
            } finally {
              setCancelling(false);
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!order) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Pesanan tidak ditemukan</Text>
      </View>
    );
  }

  const statusColor =
    order.status === 'completed'
      ? Colors.gray900
      : order.status === 'cancelled'
      ? Colors.gray400
      : Colors.gray600;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.card}>
        <View style={styles.headerRow}>
          <Text style={styles.label}>Order ID</Text>
          <Text style={styles.orderId}>#{truncateId(order._id)}</Text>
        </View>
        <View style={styles.headerRow}>
          <Text style={styles.label}>Tanggal</Text>
          <Text style={styles.value}>{formatDate(order.createdAt)}</Text>
        </View>
        <View style={styles.headerRow}>
          <Text style={styles.label}>Status</Text>
          <Text style={[styles.statusText, { color: statusColor }]}>
            {order.status === 'pending'
              ? 'Menunggu'
              : order.status === 'completed'
              ? 'Selesai'
              : 'Dibatalkan'}
          </Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Item Pesanan</Text>
      <View style={styles.card}>
        {order.items?.map((item, index) => (
          <View
            key={index}
            style={[
              styles.itemRow,
              index < order.items.length - 1 && styles.itemBorder,
            ]}
          >
            <View style={styles.itemInfo}>
              <Text style={styles.itemName} numberOfLines={2}>
                {item.product?.name || 'Produk'}
              </Text>
              <Text style={styles.itemQty}>
                {item.quantity} x {formatRupiah(item.price)}
              </Text>
            </View>
            <Text style={styles.itemSubtotal}>
              {formatRupiah(item.price * item.quantity)}
            </Text>
          </View>
        ))}
        <View style={styles.totalDivider} />
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalPrice}>
            {formatRupiah(order.totalPrice)}
          </Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Alamat Pengiriman</Text>
      <View style={styles.card}>
        <Text style={styles.addressText}>
          {order.shippingAddress?.street}
        </Text>
        <Text style={styles.addressText}>
          {order.shippingAddress?.city}, {order.shippingAddress?.postalCode}
        </Text>
        <Text style={styles.addressText}>
          {order.shippingAddress?.country}
        </Text>
      </View>

      <Text style={styles.sectionTitle}>Metode Pembayaran</Text>
      <View style={styles.card}>
        <Text style={styles.paymentText}>
          {PAYMENT_LABELS[order.paymentMethod] || order.paymentMethod}
        </Text>
      </View>

      {order.status === 'pending' && (
        <Button
          title="Batalkan Pesanan"
          onPress={handleCancel}
          variant="danger"
          loading={cancelling}
          style={styles.cancelButton}
        />
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 10,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.gray200,
    marginBottom: 16,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
  },
  label: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  orderId: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  value: {
    fontSize: 14,
    color: Colors.textPrimary,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 10,
    marginTop: 4,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  itemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray100,
  },
  itemInfo: {
    flex: 1,
    marginRight: 12,
  },
  itemName: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  itemQty: {
    fontSize: 13,
    color: Colors.textMuted,
  },
  itemSubtotal: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  totalDivider: {
    height: 1,
    backgroundColor: Colors.gray200,
    marginVertical: 10,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  totalPrice: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.gray900,
  },
  addressText: {
    fontSize: 14,
    color: Colors.textPrimary,
    lineHeight: 22,
  },
  paymentText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.textPrimary,
  },
  cancelButton: {
    marginTop: 8,
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

export default OrderDetailScreen;
