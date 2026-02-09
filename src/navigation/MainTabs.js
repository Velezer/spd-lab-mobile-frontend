import React from 'react';
import { Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import HomeScreen from '../screens/home/HomeScreen';
import ProductStack from './ProductStack';
import CartStack from './CartStack';
import OrderStack from './OrderStack';
import ProfileScreen from '../screens/profile/ProfileScreen';
import { Colors } from '../constants/colors';
import { useCart } from '../contexts/CartContext';

const Tab = createBottomTabNavigator();

const MainTabs = () => {
  const { totalItems } = useCart();
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          switch (route.name) {
            case 'HomeTab':
              iconName = focused ? 'home' : 'home-outline';
              break;
            case 'ProductTab':
              iconName = focused ? 'grid' : 'grid-outline';
              break;
            case 'CartTab':
              iconName = focused ? 'cart' : 'cart-outline';
              break;
            case 'OrderTab':
              iconName = focused ? 'receipt' : 'receipt-outline';
              break;
            case 'ProfileTab':
              iconName = focused ? 'person' : 'person-outline';
              break;
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: Colors.black,
        tabBarInactiveTintColor: Colors.gray400,
        tabBarStyle: {
          backgroundColor: Colors.white,
          borderTopColor: Colors.gray200,
          borderTopWidth: 1,
          paddingBottom: Math.max(insets.bottom, 4),
          height: 56 + Math.max(insets.bottom, 0),
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '500',
        },
        headerShown: false,
      })}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeScreen}
        options={{ tabBarLabel: 'Home' }}
      />
      <Tab.Screen
        name="ProductTab"
        component={ProductStack}
        options={{ tabBarLabel: 'Produk' }}
      />
      <Tab.Screen
        name="CartTab"
        component={CartStack}
        options={{
          tabBarLabel: 'Keranjang',
          tabBarBadge: totalItems > 0 ? totalItems : undefined,
          tabBarBadgeStyle: {
            backgroundColor: Colors.gray900,
            color: Colors.white,
            fontSize: 10,
          },
        }}
      />
      <Tab.Screen
        name="OrderTab"
        component={OrderStack}
        options={{ tabBarLabel: 'Pesanan' }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Profil',
          headerShown: true,
          headerTitle: 'Profil',
          headerStyle: { backgroundColor: Colors.white },
          headerTitleStyle: { fontWeight: '600', color: Colors.textPrimary },
          headerShadowVisible: false,
        }}
      />
    </Tab.Navigator>
  );
};

export default MainTabs;
