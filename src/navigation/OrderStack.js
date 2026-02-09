import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import OrderListScreen from '../screens/orders/OrderListScreen';
import OrderDetailScreen from '../screens/orders/OrderDetailScreen';
import { Colors } from '../constants/colors';

const Stack = createNativeStackNavigator();

const OrderStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: Colors.white },
        headerTintColor: Colors.textPrimary,
        headerTitleStyle: { fontWeight: '600' },
        headerShadowVisible: false,
        headerBackTitleVisible: false,
        contentStyle: { backgroundColor: Colors.background },
      }}
    >
      <Stack.Screen
        name="OrderList"
        component={OrderListScreen}
        options={{ title: 'Pesanan Saya' }}
      />
      <Stack.Screen
        name="OrderDetail"
        component={OrderDetailScreen}
        options={{ title: 'Detail Pesanan' }}
      />
    </Stack.Navigator>
  );
};

export default OrderStack;
