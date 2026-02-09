import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import CartScreen from '../screens/cart/CartScreen';
import CheckoutScreen from '../screens/cart/CheckoutScreen';
import { Colors } from '../constants/colors';

const Stack = createNativeStackNavigator();

const CartStack = () => {
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
        name="Cart"
        component={CartScreen}
        options={{ title: 'Keranjang' }}
      />
      <Stack.Screen
        name="Checkout"
        component={CheckoutScreen}
        options={{ title: 'Checkout' }}
      />
    </Stack.Navigator>
  );
};

export default CartStack;
