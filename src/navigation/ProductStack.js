import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ProductListScreen from '../screens/products/ProductListScreen';
import ProductDetailScreen from '../screens/products/ProductDetailScreen';
import { Colors } from '../constants/colors';

const Stack = createNativeStackNavigator();

const ProductStack = () => {
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
        name="ProductList"
        component={ProductListScreen}
        options={{ title: 'Produk' }}
      />
      <Stack.Screen
        name="ProductDetail"
        component={ProductDetailScreen}
        options={{ title: 'Detail Produk' }}
      />
    </Stack.Navigator>
  );
};

export default ProductStack;
