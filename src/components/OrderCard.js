import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Colors } from '../constants/colors';
import { formatRupiah, formatDate, truncateId } from '../utils/format';

const statusStyles = {
  pending: {
    backgroundColor: Colors.white,
    borderColor: Colors.gray400,
    textColor: Colors.gray600,
  },
  completed: {
    backgroundColor: Colors.gray900,
    borderColor: Colors.gray900,
    textColor: Colors.white,
  },
  cancelled: {
    backgroundColor: Colors.white,
    borderColor: Colors.gray300,
    textColor: Colors.gray400,
  },
};

const OrderCard = ({ order, onPress }) => {
  const status = statusStyles[order.status] || statusStyles.pending;
  const itemCount = order.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.header}>
        <Text style={styles.orderId}>#{truncateId(order._id)}</Text>
        <View
          style={[
            styles.badge,
            {
              backgroundColor: status.backgroundColor,
              borderColor: status.borderColor,
            },
          ]}
        >
          <Text
            style={[
              styles.badgeText,
              {
                color: status.textColor,
                textDecorationLine:
                  order.status === 'cancelled' ? 'line-through' : 'none',
              },
            ]}
          >
            {order.status}
          </Text>
        </View>
      </View>
      <Text style={styles.date}>{formatDate(order.createdAt)}</Text>
      <View style={styles.footer}>
        <Text style={styles.items}>{itemCount} item</Text>
        <Text style={styles.total}>{formatRupiah(order.totalPrice)}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 10,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: Colors.gray200,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  orderId: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  date: {
    fontSize: 13,
    color: Colors.textMuted,
    marginBottom: 10,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  items: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  total: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.gray900,
  },
});

export default OrderCard;
